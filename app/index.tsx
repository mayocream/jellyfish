import { useSessionStore } from '@/lib/context'
import { Redirect } from 'expo-router'
import { CardItem, HorizontalCardScroller } from '@/components/card-view'
import { getItemsApi } from '@jellyfin/sdk/lib/utils/api'
import { useState, useEffect } from 'react'
import { View } from 'tamagui'

export default function Index() {
  const session = useSessionStore()
  if (!session.isAuthenticated()) {
    return <Redirect href='/sign-in' />
  }

  const api = session.api()!
  const itemsApi = getItemsApi(api)

  const [myCards, setMyCards] = useState<CardItem[]>([])

  useEffect(() => {
    const load = async () => {
      const items = await itemsApi.getResumeItems()
      const newCards: CardItem[] = []

      items.data.Items?.forEach((item) => {
        console.log('Item:', item)
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
            subtitle: item.Name!,
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
            progress:
              ((item.UserData?.PlaybackPositionTicks || 0) /
                (item.RunTimeTicks || 1)) *
              100,
          })
        }
      })

      // trigger re-render
      setMyCards(newCards)
      console.log(newCards)
    }

    load()
  }, [])

  const handleCardPress = (card: CardItem) => {
    console.log(`Card pressed: ${card.title || card.id}`)
    // Navigate or perform actions
  }

  return (
    <View
      flex={1}
      justifyContent='center'
      alignItems='center'
      backgroundColor='$background'
    >
      <HorizontalCardScroller cards={myCards} onCardPress={handleCardPress} />
    </View>
  )
}
