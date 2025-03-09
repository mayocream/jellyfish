import { useSessionStore } from '@/lib/state'
import { LogOut, Server } from '@tamagui/lucide-icons'
import {
  Button,
  Card,
  H2,
  Paragraph,
  Separator,
  Stack,
  Text,
  Theme,
  XStack,
  YStack,
} from 'tamagui'
import Constants from 'expo-constants'

export default function Settings() {
  const session = useSessionStore()
  const server = session.server

  const handleSignOut = () => {
    // Add sign out logic here
    console.log('Signing out...')
  }

  return (
    <YStack fullscreen backgroundColor='$background' padding='$5' gap='$5'>
      {/* Server Info Card */}
      <Card elevate bordered borderRadius='$4' padding='$4'>
        <YStack gap='$4'>
          <XStack alignItems='center' gap='$2'>
            <Server size={20} color='$color' />
            <Text color='$color' fontWeight='bold'>
              Server Information
            </Text>
          </XStack>

          <YStack paddingLeft='$1' gap='$2'>
            <Text fontSize='$3' opacity={0.7}>
              Current Connection
            </Text>
            <Text color='$color' fontSize='$4' fontFamily='$mono'>
              {server}
            </Text>
          </YStack>
        </YStack>
      </Card>

      {/* Account Actions */}
      <YStack gap='$4'>
        <Text color='$color' fontWeight='bold'>
          Account
        </Text>

        <Button
          onPress={handleSignOut}
          backgroundColor='$red10'
          borderRadius='$4'
          size='$4'
          height='$5'
          iconAfter={LogOut}
        >
          <Text color='white' fontWeight='bold'>
            Sign out
          </Text>
        </Button>
      </YStack>

      {/* Footer */}
      <YStack flex={1} justifyContent='flex-end'>
        <Paragraph
          size='$2'
          color='$colorFocus'
          opacity={0.5}
          textAlign='center'
        >
          Version {Constants.expoConfig?.version}
        </Paragraph>
      </YStack>
    </YStack>
  )
}
