import React, { useState } from 'react'
import { Alert } from 'react-native'
import { StatusBar } from 'expo-status-bar'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { useSessionStore } from '@/lib/context'
import { YStack, XStack, Text, Input, Button, Image, View } from 'tamagui'

export default function SignInScreen() {
  const router = useRouter()
  const session = useSessionStore()
  const [server, setServer] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isServerFocused, setIsServerFocused] = useState(false)
  const [isUsernameFocused, setIsUsernameFocused] = useState(false)
  const [isPasswordFocused, setIsPasswordFocused] = useState(false)

  const handleSignIn = () => {
    if (!server.trim()) {
      Alert.alert('Error', 'Please enter your server address')
      return
    }

    if (!username.trim()) {
      Alert.alert('Error', 'Please enter your username')
      return
    }

    if (!password.trim()) {
      Alert.alert('Error', 'Please enter your password')
      return
    }

    session
      .authenticate(server, username, password)
      .then(() => {
        router.push('/')
      })
      .catch((error) => {
        Alert.alert('Error', error.message)
      })
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  return (
    <View flex={1} backgroundColor='$background' padding={20}>
      <StatusBar style='auto' />

      <YStack alignItems='center' marginTop={60} marginBottom={40}>
        <Image
          source={require('../assets/images/logo.png')}
          width={70}
          height={70}
        />
        <Text fontSize={22} fontWeight='bold' marginTop={10}>
          Jellyfin
        </Text>
      </YStack>

      <YStack flex={1}>
        <Text fontSize={28} fontWeight='bold' marginBottom={30}>
          Sign In
        </Text>

        <XStack
          alignItems='center'
          borderWidth={isServerFocused ? 1.5 : 1}
          borderColor={isServerFocused ? '#4285F4' : '#ddd'}
          borderRadius={10}
          paddingHorizontal={15}
          height={55}
          marginBottom={15}
        >
          <Ionicons
            name='server-outline'
            size={20}
            color='#666'
            style={{ marginRight: 10 }}
          />
          <Input
            flex={1}
            height='100%'
            fontSize={16}
            borderWidth={0}
            placeholder='e.g., https://jellyfin.example.com'
            value={server}
            onChangeText={setServer}
            autoCapitalize='none'
            keyboardType='url'
            autoCorrect={false}
            onFocus={() => setIsServerFocused(true)}
            onBlur={() => setIsServerFocused(false)}
          />
        </XStack>

        <XStack
          alignItems='center'
          borderWidth={isUsernameFocused ? 1.5 : 1}
          borderColor={isUsernameFocused ? '#4285F4' : '#ddd'}
          borderRadius={10}
          paddingHorizontal={15}
          height={55}
          marginBottom={15}
        >
          <Ionicons
            name='person-outline'
            size={20}
            color='#666'
            style={{ marginRight: 10 }}
          />
          <Input
            flex={1}
            height='100%'
            fontSize={16}
            borderWidth={0}
            placeholder='Username'
            value={username}
            onChangeText={setUsername}
            autoCapitalize='none'
            onFocus={() => setIsUsernameFocused(true)}
            onBlur={() => setIsUsernameFocused(false)}
          />
        </XStack>

        <XStack
          alignItems='center'
          borderWidth={isPasswordFocused ? 1.5 : 1}
          borderColor={isPasswordFocused ? '#4285F4' : '#ddd'}
          borderRadius={10}
          paddingHorizontal={15}
          height={55}
          marginBottom={15}
        >
          <Ionicons
            name='lock-closed-outline'
            size={20}
            color='#666'
            style={{ marginRight: 10 }}
          />
          <Input
            flex={1}
            height='100%'
            fontSize={16}
            borderWidth={0}
            placeholder='Password'
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            onFocus={() => setIsPasswordFocused(true)}
            onBlur={() => setIsPasswordFocused(false)}
          />
          <View padding={5} onPress={togglePasswordVisibility}>
            <Ionicons
              name={showPassword ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color='#666'
            />
          </View>
        </XStack>

        <Button
          backgroundColor='#4285F4'
          borderRadius={10}
          height={55}
          justifyContent='center'
          alignItems='center'
          marginTop={15}
          onPress={handleSignIn}
        >
          <Text color='#fff' fontSize={16} fontWeight='bold'>
            Sign In
          </Text>
        </Button>
      </YStack>
    </View>
  )
}
