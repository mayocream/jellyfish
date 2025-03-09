import { Stack } from 'expo-router'
import 'react-native-gesture-handler'
import { TamaguiProvider, createTamagui, Theme } from 'tamagui'
import { defaultConfig } from '@tamagui/config/v4'

const config = createTamagui(defaultConfig)

export default function RootLayout() {
  return (
    <TamaguiProvider config={config} defaultTheme='dark'>
      <Theme name='dark'>
        <Stack>
          <Stack.Screen name='(tabs)' options={{ headerShown: false }} />
        </Stack>
      </Theme>
    </TamaguiProvider>
  )
}
