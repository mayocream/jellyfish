import React, { useState, useRef, useEffect } from 'react'
import { View, StyleSheet } from 'react-native'
import { YStack, Text, Spinner, Button, XStack } from 'tamagui'
import { Video, ResizeMode, AVPlaybackStatus } from 'expo-av'
import { Ionicons } from '@expo/vector-icons'

interface VideoPlayerProps {
  videoUrl: string
  autoPlay?: boolean
  onPlaybackStatusUpdate?: (status: AVPlaybackStatus) => void
  onEnd?: () => void
}

interface VideoStatus {
  isLoaded: boolean
  isPlaying: boolean
  durationMillis?: number
  positionMillis?: number
  isBuffering?: boolean
  didJustFinish?: boolean
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  videoUrl,
  autoPlay = false,
  onPlaybackStatusUpdate,
  onEnd,
}) => {
  const [status, setStatus] = useState<VideoStatus>({
    isLoaded: false,
    isPlaying: false,
  })
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const videoRef = useRef<Video>(null)

  useEffect(() => {
    // Auto-play if enabled
    if (autoPlay && videoRef.current && status.isLoaded && !status.isPlaying) {
      videoRef.current.playAsync()
    }
  }, [autoPlay, status.isLoaded])

  const handlePlaybackStatusUpdate = (status: AVPlaybackStatus) => {
    if (status.isLoaded) {
      setStatus({
        isLoaded: status.isLoaded,
        isPlaying: status.isPlaying,
        durationMillis: status.durationMillis,
        positionMillis: status.positionMillis,
        isBuffering: status.isBuffering,
        didJustFinish: status.didJustFinish,
      })

      if (isLoading) {
        setIsLoading(false)
      }

      if (status.didJustFinish && onEnd) {
        onEnd()
      }
    }

    if (onPlaybackStatusUpdate) {
      onPlaybackStatusUpdate(status)
    }
  }

  const handlePlayPause = async (): Promise<void> => {
    if (!videoRef.current) return

    if (status.isPlaying) {
      await videoRef.current.pauseAsync()
    } else {
      await videoRef.current.playAsync()
    }
  }

  const handleReplay = async (): Promise<void> => {
    if (!videoRef.current) return
    await videoRef.current.replayAsync()
  }

  const handleForward = async (): Promise<void> => {
    if (!videoRef.current || !status.positionMillis) return
    await videoRef.current.setPositionAsync(status.positionMillis + 10000) // 10 seconds forward
  }

  const handleBackward = async (): Promise<void> => {
    if (!videoRef.current || !status.positionMillis) return
    await videoRef.current.setPositionAsync(
      Math.max(0, status.positionMillis - 10000),
    ) // 10 seconds backward
  }

  // Format time in MM:SS
  const formatTime = (millis?: number): string => {
    if (!millis) return '00:00'
    const totalSeconds = Math.floor(millis / 1000)
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = totalSeconds % 60
    return `${minutes.toString().padStart(2, '0')}:${seconds
      .toString()
      .padStart(2, '0')}`
  }

  // Calculate progress
  const progress: number =
    status.positionMillis && status.durationMillis
      ? status.positionMillis / status.durationMillis
      : 0

  return (
    <YStack space='$4' padding='$4' width='100%'>
      <View style={styles.videoContainer}>
        <Video
          ref={videoRef}
          source={{ uri: videoUrl }}
          style={styles.video}
          resizeMode={ResizeMode.CONTAIN}
          useNativeControls={false}
          onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
          onLoad={() => setIsLoading(false)}
        />

        {isLoading && (
          <View style={styles.loadingContainer}>
            <Spinner size='large' color='$blue10' />
          </View>
        )}
      </View>

      {/* Progress bar */}
      <View style={styles.progressBarContainer}>
        <View style={[styles.progressBar, { width: `${progress * 100}%` }]} />
      </View>

      {/* Time display */}
      <XStack justifyContent='space-between'>
        <Text fontSize='$2' color='$gray11'>
          {formatTime(status.positionMillis)}
        </Text>
        <Text fontSize='$2' color='$gray11'>
          {formatTime(status.durationMillis)}
        </Text>
      </XStack>

      {/* Controls */}
      <XStack justifyContent='space-between' alignItems='center'>
        <Button
          size='$4'
          circular
          icon={<Ionicons name='play-back' size={24} color='#fff' />}
          onPress={handleBackward}
        />
        <Button
          size='$6'
          circular
          icon={
            <Ionicons
              name={status.isPlaying ? 'pause' : 'play'}
              size={32}
              color='#fff'
            />
          }
          onPress={handlePlayPause}
        />
        <Button
          size='$4'
          circular
          icon={<Ionicons name='play-forward' size={24} color='#fff' />}
          onPress={handleForward}
        />
        <Button
          size='$4'
          circular
          icon={<Ionicons name='reload' size={24} color='#fff' />}
          onPress={handleReplay}
        />
      </XStack>
    </YStack>
  )
}

const styles = StyleSheet.create({
  videoContainer: {
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: '#000',
    borderRadius: 10,
    overflow: 'hidden',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressBarContainer: {
    width: '100%',
    height: 6,
    backgroundColor: '#e0e0e0',
    borderRadius: 3,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#3b82f6',
    borderRadius: 3,
  },
})

export { VideoPlayer }
