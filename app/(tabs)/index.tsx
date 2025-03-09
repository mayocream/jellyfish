import { useSessionStore } from '@/lib/state'
import { Redirect } from 'expo-router'
import { getItemsApi, getTvShowsApi } from '@jellyfin/sdk/lib/utils/api'
import { useState, useEffect } from 'react'
import { useWindowDimensions } from 'react-native'
import { View, YStack, ScrollView } from 'tamagui'
import { BaseItemDto } from '@jellyfin/sdk/lib/generated-client/models'
import { CardItem, HorizontalCards } from '@/components/horizontal-cards'
import { FeaturedBanner } from '@/components/featured-content'

export default function Index(): JSX.Element {
  const session = useSessionStore()
  if (!session.isAuthenticated()) {
    return <Redirect href='/sign-in' />
  }

  const api = session.api()!
  const [mediaContent, setMediaContent] = useState<{
    resumeCards: CardItem[]
    nextUpCards: CardItem[]
    featuredContent: CardItem | null
  }>({
    resumeCards: [],
    nextUpCards: [],
    featuredContent: null,
  })

  // Dimensions
  const { width, height } = useWindowDimensions()
  const isLandscape = width > height
  const cardWidth = width * (isLandscape ? 0.22 : 0.42)
  const featuredHeight = isLandscape ? height * 0.75 : height * 0.6

  // Convert API items to card format
  function createCards(items: BaseItemDto[]): CardItem[] {
    return items.map((item) => {
      const isEpisode = item.Type === 'Episode'
      const imageUrl = `${session.server}/Items/${isEpisode ? item.SeriesId : item.Id}/Images/Thumb?fillHeight=512&fillWidth=910&tag=${item.ImageTags?.Primary}`

      return {
        id: item.Id!,
        imageUrl,
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
      try {
        const itemsApi = getItemsApi(api)
        const tvShowsApi = getTvShowsApi(api)

        // Load both data sources in parallel
        const [resumeItems, nextUpItems] = await Promise.all([
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
        ])

        const resumeResults = createCards(resumeItems.data.Items || [])
        const nextUpResults = createCards(nextUpItems.data.Items || [])

        // Set all state at once
        setMediaContent({
          resumeCards: resumeResults,
          nextUpCards: nextUpResults,
          featuredContent:
            resumeResults.length > 0
              ? resumeResults[0]
              : nextUpResults.length > 0
                ? nextUpResults[0]
                : null,
        })
      } catch (error) {
        console.error('Error loading data:', error)
      }
    }

    loadData()
  }, [])

  // Event handlers
  const handleCardPress = (card: CardItem): void => {
    console.log('Playing:', card.id)
    // Navigate to player
  }

  const { resumeCards, nextUpCards, featuredContent } = mediaContent

  return (
    <YStack flex={1} backgroundColor='$black1'>
      <ScrollView showsVerticalScrollIndicator={false}>
        <YStack gap={24}>
          <FeaturedBanner
            content={featuredContent}
            height={featuredHeight}
            onPlayPress={() =>
              featuredContent && handleCardPress(featuredContent)
            }
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
