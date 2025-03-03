import { useSessionStore } from '@/lib/context'
import { Redirect } from 'expo-router'
import { Text, View } from 'react-native'
import { CardItem, HorizontalCardScroller } from '@/components/card-view'
import { getItemsApi } from '@jellyfin/sdk/lib/utils/api'
import { useState, useEffect } from 'react'

export default async function Index() {
  const session = useSessionStore()
  if (!session.isAuthenticated()) {
    return <Redirect href='/sign-in' />
  }

  const api = session.api()!
  const itemsApi = getItemsApi(api)

  const [myCards] = useState([] as CardItem[])

  useEffect(() => {
    const load = async () => {
      const items = await itemsApi.getResumeItems()
      items.data.Items?.forEach(item => {
        console.log(item)
        if (item.Type === "Episode") {
          myCards.push({
            id: item.Id!,
            imageUrl: session.server + "/Items/" + item.SeriesId + "/Images/Thumb?fillHeight=512&fillWidth=910&tag=" + item.ImageTags?.Primary,
            title: item.SeriesName!,
            subtitle: item.Name!,
            progress: (item.UserData?.PlaybackPositionTicks || 0) / (item.RunTimeTicks || 1) * 100
          })
        } else if (item.Type === "Movie") {
          myCards.push({
            id: item.Id!,
            imageUrl: session.server + "/Items/" + item.Id + "/Images/Thumb?fillHeight=512&fillWidth=910&tag=" + item.ImageTags?.Primary,
            title: item.Name!,
            subtitle: item.ProductionYear?.toString(),
            progress: (item.UserData?.PlaybackPositionTicks || 0) / (item.RunTimeTicks || 1) * 100
          })
        }
      })

      console.log(myCards)
    }
    load()
  }, [])

  const handleCardPress = (card: { id: string; imageUrl?: string; title?: string; progress: number }) => {
    console.log(`Card pressed: ${card.title || card.id}`);
    // Navigate or perform actions
  }

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <HorizontalCardScroller cards={myCards} onCardPress={handleCardPress} />
    </View>
  )
}
