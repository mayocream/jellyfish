import { Stack } from 'expo-router'
import 'react-native-gesture-handler';

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }} />
  )
}
