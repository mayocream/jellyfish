import { useSessionStore } from '@/lib/context'
import { Redirect } from 'expo-router'
import { CardItem, HorizontalCardScroller } from '@/components/card-view'
import { FlixLabel } from '@/components/flix-label'
import { getItemsApi, getTvShowsApi, getVideosApi } from '@jellyfin/sdk/lib/utils/api'
import { useState, useEffect } from 'react'
import { View, useWindowDimensions, StyleSheet } from 'react-native'
import { Text, Image } from 'tamagui'
import { Settings } from '@tamagui/lucide-icons'
import { BaseItemDto } from '@jellyfin/sdk/lib/generated-client/models'
import { TouchableOpacity } from 'react-native'

// import { VideoMpvView } from "react-native-video-mpv";

export default function Index() {
  const session = useSessionStore()
  if (!session.isAuthenticated()) {
    return <Redirect href='/sign-in' />
  }

  
  const api = session.api()!
  const itemsApi = getItemsApi(api)
  const tvShowsApi = getTvShowsApi(api)
  const videosApi = getVideosApi(session.api()!)

  // Get window dimensions to check orientation
  const { width, height } = useWindowDimensions()
  const isLandscape = width > height

  function poplulateCards(items: BaseItemDto[]): CardItem[] {
    const newCards: CardItem[] = []

    items.forEach((item) => {
      if (item.Type === 'Episode') {
        newCards.push({
          id: item.Id!,
          imageUrl:
            session.server +
            '/Items/' +
            item.SeriesId +
            '/Images/Thumb?fillHeight=512&fillWidth=910&tag=' +
            item.ImageTags?.Primary,
          title: item.SeriesName!,
          subtitle: "S" + item.ParentIndexNumber + ":E" + item.IndexNumber + " - " + item.Name!,
          rating: item.CommunityRating!,
          progress:
            ((item.UserData?.PlaybackPositionTicks || 0) /
              (item.RunTimeTicks || 1)) *
            100,
        })
      } else if (item.Type === 'Movie') {
        newCards.push({
          id: item.Id!,
          imageUrl:
            session.server +
            '/Items/' +
            item.Id +
            '/Images/Thumb?fillHeight=512&fillWidth=910&tag=' +
            item.ImageTags?.Primary,
          title: item.Name!,
          subtitle: item.ProductionYear?.toString(),
          rating: item.CommunityRating!,
          progress:
            ((item.UserData?.PlaybackPositionTicks || 0) /
              (item.RunTimeTicks || 1)) *
            100,
        })
      }
    })

    return newCards
  }

  const [resumeCards, setResumeCards] = useState<CardItem[]>([])

  useEffect(() => {
    const load = async () => {
      const items = await itemsApi.getResumeItems({
        limit: 12,
        enableImageTypes: ['Primary', 'Backdrop', 'Thumb'],
        imageTypeLimit: 1,
        enableTotalRecordCount: false,
        mediaTypes: ["Video"],
      })
      const newCards = poplulateCards(items.data.Items || [])
      // trigger re-render
      setResumeCards(newCards)
      //console.log(newCards)
    }

    load()
  }, [])

  const [nextUpCards, setNextUpCards] = useState<CardItem[]>([])

  useEffect(() => {
    const load = async () => {
      const items = await tvShowsApi.getNextUp({
        limit: 24,
        enableImageTypes: ['Primary', 'Backdrop', 'Banner', 'Thumb'],
        imageTypeLimit: 1,
        enableTotalRecordCount: false,
        disableFirstEpisode: false,
        enableResumable: false,
        enableRewatching: false,
      })
      const newCards = poplulateCards(items.data.Items || [])
      // trigger re-render
      setNextUpCards(newCards)
      //console.log(newCards)
    }

    load()
  }, [])

  const handleCardPress = (card: CardItem) => {
    console.log('card pressed')
    // const url = videosApi.getVideoStream({ itemId: card.id })
    // console.log("stream url: " + url)
    // return <Redirect href={ `/expo-player?url={url}` } />
    // Navigate or perform actions
  }

  const handleSettingsPress = () => {
    console.log('Settings pressed')
    // Navigate to settings page
  }

  // Calculate card width percentage based on orientation
  const cardWidthPercent = isLandscape ? 0.3 : 0.6

  // Extract server name from server URL
  const serverName = session.server 
    ? new URL(session.server).hostname
    : 'Jellyfin Server'

  return (
    <View style={styles.container}>
      {/* Static Header Bar */}
      <View style={styles.header}>
        {/* Left side: Jellyfin logo */}
        <Image
          source={{ uri: '/assets/images/logo.svg' }}
          width={36}
          height={36}
          resizeMode="contain"
        />
        
        {/* Center: Server name */}
        <Text style={styles.serverName}>
          {serverName}
        </Text>
        
        {/* Right side: Settings gear */}
        <TouchableOpacity onPress={handleSettingsPress}>
          <Settings size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* Scrollable content */}
      <View style={styles.content}>
        <FlixLabel text="Continue" />
        <HorizontalCardScroller
          cards={resumeCards}
          onCardPress={handleCardPress}
          cardWidthPercent={cardWidthPercent}
        />

        <FlixLabel text="Next Up" />
        <HorizontalCardScroller
          cards={nextUpCards}
          onCardPress={handleCardPress}
          cardWidthPercent={cardWidthPercent}
          hideProgressBar={true}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212', // $black3 equivalent
  },
  header: {
    height: 60,
    backgroundColor: '#1A1A1A', // $black5 equivalent
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  serverName: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
  content: {
    flex: 1,
  }
});