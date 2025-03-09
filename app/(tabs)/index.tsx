import { useSessionStore } from '@/lib/state'
import { Redirect } from 'expo-router'
import { getItemsApi, getTvShowsApi } from '@jellyfin/sdk/lib/utils/api'
import { useState, useEffect } from 'react'
import { useWindowDimensions } from 'react-native'
import { Text, Image, View, XStack, YStack, ScrollView, Stack } from 'tamagui'
import { Settings } from '@tamagui/lucide-icons'
import { BaseItemDto } from '@jellyfin/sdk/lib/generated-client/models'
import { TouchableOpacity } from 'react-native'

// Types
export interface CardItem {
  id: string
  imageUrl: string
  title: string
  subtitle?: string
  rating?: number
  progress?: number
}

// Components
const SectionTitle = ({ text }: { text: string }): JSX.Element => (
  <Text
    color='white'
    fontWeight='600'
    fontSize={20}
    paddingLeft={16}
    paddingVertical={12}
  >
    {text}
  </Text>
)

const MediaCard = ({
  item,
  width,
  onPress,
  showProgress = true,
}: {
  item: CardItem
  width: number
  onPress: (item: CardItem) => void
  showProgress?: boolean
}): JSX.Element => (
  <TouchableOpacity onPress={() => onPress(item)} style={{ width }}>
    <Stack>
      <Image
        source={{ uri: item.imageUrl }}
        width={width}
        height={width * 0.56}
        borderRadius={4}
      />

      {showProgress && item.progress && item.progress > 0 && (
        <View position='absolute' bottom={0} left={0} right={0} height={3}>
          <View
            height='100%'
            width={`${item.progress}%`}
            backgroundColor='$red10'
          />
        </View>
      )}

      <Text
        color='white'
        fontSize={14}
        fontWeight='bold'
        marginTop={8}
        numberOfLines={1}
      >
        {item.title}
      </Text>

      {item.subtitle && (
        <Text fontSize={12} numberOfLines={1}>
          {item.subtitle}
        </Text>
      )}
    </Stack>
  </TouchableOpacity>
)

const MediaRow = ({
  title,
  items,
  cardWidth,
  onCardPress,
  showProgress = true,
}: {
  title: string
  items: CardItem[]
  cardWidth: number
  onCardPress: (item: CardItem) => void
  showProgress?: boolean
}): JSX.Element | null => {
  if (items.length === 0) return null

  return (
    <YStack>
      <SectionTitle text={title} />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingLeft: 16, paddingRight: 8 }}
      >
        <XStack gap={12}>
          {items.map((item) => (
            <MediaCard
              key={item.id}
              item={item}
              width={cardWidth}
              onPress={onCardPress}
              showProgress={showProgress}
            />
          ))}
        </XStack>
      </ScrollView>
    </YStack>
  )
}

const FeaturedBanner = ({
  content,
  height,
  onPlayPress,
}: {
  content: CardItem | null
  height: number
  onPlayPress: () => void
}): JSX.Element => {
  if (!content) return <View height={height} />

  return (
    <Stack height={height}>
      <Image
        source={{ uri: content.imageUrl }}
        position='absolute'
        top={0}
        left={0}
        right={0}
        bottom={0}
      />

      <Stack
        position='absolute'
        bottom={0}
        left={0}
        right={0}
        height='50%'
        background='linear-gradient(to top, $black1, transparent)'
        justifyContent='flex-end'
        paddingBottom={24}
        paddingHorizontal={16}
        gap={12}
      >
        <Text color='white' fontSize={24} fontWeight='bold'>
          {content.title}
        </Text>

        {content.subtitle && <Text fontSize={16}>{content.subtitle}</Text>}

        <TouchableOpacity
          onPress={onPlayPress}
          style={{
            backgroundColor: 'white',
            paddingHorizontal: 24,
            paddingVertical: 12,
            borderRadius: 4,
            alignSelf: 'flex-start',
          }}
        >
          <Text color='black' fontWeight='bold'>
            ▶ Play
          </Text>
        </TouchableOpacity>
      </Stack>
    </Stack>
  )
}

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
      {/* Content */}
      <ScrollView showsVerticalScrollIndicator={false}>
        <YStack gap={24}>
          {/* Featured Banner */}
          <FeaturedBanner
            content={featuredContent}
            height={featuredHeight}
            onPlayPress={() =>
              featuredContent && handleCardPress(featuredContent)
            }
          />

          {/* Media Rows */}
          <MediaRow
            title='Continue Watching'
            items={resumeCards}
            cardWidth={cardWidth}
            onCardPress={handleCardPress}
            showProgress={true}
          />

          <MediaRow
            title='Next Up'
            items={nextUpCards}
            cardWidth={cardWidth}
            onCardPress={handleCardPress}
            showProgress={false}
          />

          {/* Footer spacing */}
          <View height={40} />
        </YStack>
      </ScrollView>
    </YStack>
  )
}
