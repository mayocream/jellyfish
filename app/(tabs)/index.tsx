import { useSessionStore } from '@/lib/state'
import { Redirect, router } from 'expo-router'
import {
  getItemsApi,
  getSuggestionsApi,
  getTvShowsApi,
  getVideosApi,
} from '@jellyfin/sdk/lib/utils/api'
import { useState, useEffect } from 'react'
import { useWindowDimensions } from 'react-native'
import { View, YStack, ScrollView } from 'tamagui'
import { BaseItemDto, ImageType } from '@jellyfin/sdk/lib/generated-client/models'
import { CardItem, HorizontalCards } from '@/components/horizontal-cards'
import { FeaturedContent } from '@/components/featured-content'

export default function Index(): JSX.Element {
  const session = useSessionStore()
  if (!session.isAuthenticated()) {
    return <Redirect href='/sign-in' />
  }

  const api = session.api()!
  const [mediaContent, setMediaContent] = useState<{
    resumeCards: CardItem[]
    nextUpCards: CardItem[]
    featuredContent: CardItem[]
  }>({
    resumeCards: [],
    nextUpCards: [],
    featuredContent: [],
  })

  // Dimensions
  const { width, height } = useWindowDimensions()
  const isLandscape = width > height
  const cardWidth = width * (isLandscape ? 0.22 : 0.42)
  const featuredHeight = isLandscape ? height * 0.75 : height * 0.4

  // Convert API items to card format
  function createCards(items: BaseItemDto[], imageType: ImageType = "Thumb"): CardItem[] {
    return items.map((item) => {
      const isEpisode = item.Type === 'Episode'
      const imageUrl = `${session.server}/Items/${isEpisode ? item.SeriesId : item.Id}/Images/${imageType}?fillHeight=512&fillWidth=910&tag=${item.ImageTags?.Primary}`
      const logoURL = item.ImageTags?.Logo && `${session.server}/Items/${item.Id}/Images/Logo?maxHeight=512&maxWidth=512&tag=${item.ImageTags?.Logo}`

      return {
        id: item.Id!,
        imageUrl,
        logoURL,
        title: isEpisode ? item.SeriesName! : item.Name!,
        subtitle: isEpisode
          ? `S${item.ParentIndexNumber}:E${item.IndexNumber} - ${item.Name}`
          : item.ProductionYear?.toString(),
        rating: item.CommunityRating ?? undefined,
        progress:
          ((item.UserData?.PlaybackPositionTicks || 0) /
            (item.RunTimeTicks || 1)) *
          100,
      }
    })
  }

  // Load data
  useEffect(() => {
    async function loadData(): Promise<void> {
      const itemsApi = getItemsApi(api)
      const tvShowsApi = getTvShowsApi(api)
      const suggestionApi = getSuggestionsApi(api)

      // Load both data sources in parallel
      const [resumeItems, nextUpItems, featuredItems] = await Promise.all([
        itemsApi.getResumeItems({
          limit: 12,
          enableImageTypes: ['Primary', 'Backdrop', 'Thumb'],
          imageTypeLimit: 1,
          enableTotalRecordCount: false,
          mediaTypes: ['Video'],
        }),
        tvShowsApi.getNextUp({
          limit: 24,
          enableImageTypes: ['Primary', 'Backdrop', 'Banner', 'Thumb'],
          imageTypeLimit: 1,
          enableTotalRecordCount: false,
          disableFirstEpisode: false,
        }),
        suggestionApi.getSuggestions({
          //userId: session.user?.Id!,
          limit: 100,
          mediaType: ['Video'],
          type: ['Movie', 'TvProgram'],
        })
      ])

      const resumeResults = createCards(resumeItems.data.Items || [])
      const nextUpResults = createCards(nextUpItems.data.Items || [])
      const featureResults = createCards(featuredItems.data.Items || [], 'Backdrop')
      console.log(featureResults)

      // Set all state at once
      setMediaContent({
        resumeCards: resumeResults,
        nextUpCards: nextUpResults,
        featuredContent: featureResults
      })
    }

    loadData()
  }, [])

  // Event handlers
  const handleCardPress = async (card: CardItem) => {
    console.log('Playing:', card.id)
    const videosApi = getVideosApi(api)
    const stream = videosApi.getVideoStream({
      itemId: card.id,
    })

    console.log('stream:', stream)

    router.push(`/player?source=${card.id}`)
  }

  const { resumeCards, nextUpCards, featuredContent } = mediaContent

  return (
    <YStack flex={1} backgroundColor='$black1'>
      <ScrollView showsVerticalScrollIndicator={false}>
        <YStack gap={24}>
          <FeaturedContent
            content={featuredContent}
            height={featuredHeight}
            onPlayPress={handleCardPress}
          />

          <HorizontalCards
            title='Continue Watching'
            items={resumeCards}
            cardWidth={cardWidth}
            onCardPress={handleCardPress}
            showProgress={true}
          />

          <HorizontalCards
            title='Next Up'
            items={nextUpCards}
            cardWidth={cardWidth}
            onCardPress={handleCardPress}
            showProgress={false}
          />

          <View height={40} />
        </YStack>
      </ScrollView>
    </YStack>
  )
}
