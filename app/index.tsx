import { useSessionStore } from '@/lib/context'
import { Redirect } from 'expo-router'
import { Text, View } from 'react-native'
import { CardItem, HorizontalCardScroller } from '@/components/card-view'
import { getItemsApi } from '@jellyfin/sdk/lib/utils/api'

export default function Index() {
  const session = useSessionStore()
  if (!session.authenticated) {
    return <Redirect href='/sign-in' />
  }


  const api = session.api()

  const itemsApi = getItemsApi(api!)

  const myCards = [] as CardItem[]
  
  itemsApi.getResumeItems().then((items) => {
    console.log(items, "items")
    items.data.Items?.forEach(item => {
      console.log(item, "-")
    });
  })


  const handleCardPress = (card: { id: string; imageUrl: string; title?: string; progress: number }) => {
    console.log(`Card pressed: ${card.title || card.id}`);
    // Navigate or perform actions
  };


  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
       <HorizontalCardScroller 
          cards={myCards} 
          onCardPress={handleCardPress} 
        />
    </View>
  )
}
