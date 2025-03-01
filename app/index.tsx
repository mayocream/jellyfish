import { useSession } from '@/lib/context'
import { Redirect } from 'expo-router'
import { Text, View } from 'react-native'

export default function Index() {
  const session = useSession()
  if (!session.authenticated) {
    return <Redirect href='/sign-in' />
  }

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Text>Hello</Text>
    </View>
  )
}
