import { useSessionStore } from '@/lib/context'
import { Redirect } from 'expo-router'
import { Text, View } from 'react-native'

export default function Index() {
  const session = useSessionStore()
  if (!session.authenticated) {
    return <Redirect href='/sign-in' />
  }

  const api = session.api()

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Text>{api?.deviceInfo.name}</Text>
    </View>
  )
}
