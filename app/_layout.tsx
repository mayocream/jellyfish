import { SessionProvider } from '@/lib/context'
import { Slot } from 'expo-router'

export default function RootLayout() {
  return (
    <SessionProvider>
      <Slot />
    </SessionProvider>
  )
}
