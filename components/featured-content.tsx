import { Text, Image, View, Stack } from 'tamagui'
import { TouchableOpacity } from 'react-native'
import { CardItem } from '@/components/horizontal-cards'

export const FeaturedBanner = ({
  content,
  height,
  onPlayPress,
}: {
  content: CardItem | null
  height: number
  onPlayPress: () => void
}): JSX.Element => {
  if (!content) return <View height={height} />

  return (
    <Stack height={height}>
      <Image
        source={{ uri: content.imageUrl }}
        position='absolute'
        top={0}
        left={0}
        right={0}
        bottom={0}
      />

      <Stack
        position='absolute'
        bottom={0}
        left={0}
        right={0}
        height='50%'
        background='linear-gradient(to top, $black1, transparent)'
        justifyContent='flex-end'
        paddingBottom={24}
        paddingHorizontal={16}
        gap={12}
      >
        <Text color='white' fontSize={24} fontWeight='bold'>
          {content.title}
        </Text>

        {content.subtitle && <Text fontSize={16}>{content.subtitle}</Text>}

        <TouchableOpacity
          onPress={onPlayPress}
          style={{
            backgroundColor: 'white',
            paddingHorizontal: 24,
            paddingVertical: 12,
            borderRadius: 4,
            alignSelf: 'flex-start',
          }}
        >
          <Text color='black' fontWeight='bold'>
            ▶ Play
          </Text>
        </TouchableOpacity>
      </Stack>
    </Stack>
  )
}
