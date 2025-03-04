import { Stack } from 'expo-router'
import 'react-native-gesture-handler'
import { TamaguiProvider, createTamagui, Theme, View } from 'tamagui'
import { defaultConfig } from '@tamagui/config/v4'

const config = createTamagui(defaultConfig)

export default function RootLayout() {
  return (
    <TamaguiProvider config={config} defaultTheme='dark'>
      <Theme name='dark'>
        <View flex={1} backgroundColor='$background'>
          <Stack screenOptions={{ headerShown: false }} />
        </View>
      </Theme>
    </TamaguiProvider>
  )
}
