import { useSessionStore } from '@/lib/state'
import { useEvent } from 'expo'
import { useVideoPlayer, VideoView } from 'expo-video'
import { View, Button } from 'tamagui'
import { getVideosApi } from '@jellyfin/sdk/lib/utils/api'
import { useLocalSearchParams } from 'expo-router'

const videoSource =
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'

export default function Player() {
  const { source } = useLocalSearchParams<{ source: string }>()

  const player = useVideoPlayer(videoSource, (player) => {
    player.loop = true
    player.play()
  })

  const { isPlaying } = useEvent(player, 'playingChange', {
    isPlaying: player.playing,
  })

  return (
    <View
      flex={1}
      padding={10}
      alignItems='center'
      justifyContent='center'
      paddingHorizontal={50}
    >
      <VideoView
        style={{
          width: '100%',
          aspectRatio: 16 / 9,
        }}
        player={player}
        allowsFullscreen
        allowsPictureInPicture
      />
      <View padding={10}>
        <Button
          onPress={() => {
            if (isPlaying) {
              player.pause()
            } else {
              player.play()
            }
          }}
        >
          {isPlaying ? 'Pause' : 'Play'}
        </Button>
      </View>
    </View>
  )
}
