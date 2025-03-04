import React, { useEffect, useState } from 'react'
import { ActivityIndicator, StyleSheet } from 'react-native'
import { YStack, Button, Card, Text, View } from 'tamagui'
import { Ionicons } from '@expo/vector-icons'
import * as Linking from 'expo-linking'
import { VideoPlayer } from '@/components/expo-av-player'

interface VideoPlayerScreenProps {
  defaultUrl?: string
  onGoBack?: () => void
}

const VideoPlayerScreen: React.FC<VideoPlayerScreenProps> = ({
  defaultUrl = 'https://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4',
  onGoBack,
}) => {
  const [videoUrl, setVideoUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Function to parse the URL and get query parameters
    const getVideoUrlFromQueryParams = async () => {
      try {
        // Get the current URL
        const url = await Linking.getInitialURL()

        if (!url) {
          // If no URL is available, use the default URL
          setVideoUrl(defaultUrl)
          return
        }

        // Parse the URL to get query parameters
        const parsedUrl = Linking.parse(url)

        // Check if 'url' parameter exists in query params
        if (parsedUrl.queryParams && 'url' in parsedUrl.queryParams) {
          const urlParam = parsedUrl.queryParams.url as string

          if (urlParam) {
            // Validate URL (basic check)
            if (
              urlParam.startsWith('http') &&
              (urlParam.endsWith('.mp4') ||
                urlParam.endsWith('.mov') ||
                urlParam.endsWith('.m4v') ||
                urlParam.includes('youtube.com') ||
                urlParam.includes('vimeo.com'))
            ) {
              setVideoUrl(urlParam)
            } else {
              setError(
                'Invalid video URL format. Please provide a valid video URL.',
              )
              setVideoUrl(defaultUrl)
            }
          } else {
            setError('Video URL parameter is empty.')
            setVideoUrl(defaultUrl)
          }
        } else {
          // Default to a sample video if no URL is provided
          setVideoUrl(defaultUrl)
        }
      } catch (err) {
        setError(
          'Error parsing URL: ' +
            (err instanceof Error ? err.message : String(err)),
        )
        setVideoUrl(defaultUrl)
      }
    }

    getVideoUrlFromQueryParams()
  }, [defaultUrl])

  // Handle go back action
  const handleGoBack = () => {
    if (onGoBack) {
      onGoBack()
    }
  }

  // Retry loading with a different URL
  const handleRetry = () => {
    setError(null)
    setVideoUrl(defaultUrl)
  }

  return (
    <YStack flex={1} backgroundColor='$background' padding='$4'>
      <YStack
        flexDirection='row'
        justifyContent='space-between'
        alignItems='center'
        paddingBottom='$4'
      >
        {onGoBack && (
          <Button
            size='$4'
            circular
            icon={<Ionicons name='arrow-back' size={24} color='#fff' />}
            onPress={handleGoBack}
          />
        )}
        <Text fontSize={20} fontWeight='bold'>
          Video Player
        </Text>
        <View style={{ width: 40 }} />
      </YStack>

      {error ? (
        <Card padding='$4' marginVertical='$4'>
          <YStack space='$4' alignItems='center'>
            <Ionicons name='alert-circle' size={48} color='#f43f5e' />
            <Text fontSize={16} color='#f43f5e' textAlign='center'>
              {error}
            </Text>
            <Button
              onPress={handleRetry}
              icon={<Ionicons name='refresh' size={20} color='#fff' />}
            >
              Try Sample Video
            </Button>
          </YStack>
        </Card>
      ) : !videoUrl ? (
        <View flex={1} justifyContent='center' alignItems='center'>
          <ActivityIndicator size='large' color='#3b82f6' />
          <Text marginTop={12} fontSize={16} color='#666'>
            Loading video URL...
          </Text>
        </View>
      ) : (
        <>
          <Card padding='$2' marginBottom='$4'>
            <Text fontSize={14} color='#666' textAlign='center'>
              Playing: {videoUrl}
            </Text>
          </Card>
          <VideoPlayer
            videoUrl={videoUrl}
            autoPlay={true}
            onEnd={() => console.log('Video playback completed')}
          />
        </>
      )}
    </YStack>
  )
}

export default { VideoPlayerScreen }
