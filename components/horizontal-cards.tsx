import { Text, Image, View, XStack, YStack, ScrollView, Stack } from 'tamagui'
import { TouchableOpacity } from 'react-native'

export interface CardItem {
  id: string
  imageUrl: string
  title: string
  subtitle?: string
  rating?: number
  progress?: number
}

export const MediaCard = ({
  item,
  width,
  onPress,
  showProgress = true,
}: {
  item: CardItem
  width: number
  onPress: (item: CardItem) => void
  showProgress?: boolean
}): JSX.Element => (
  <TouchableOpacity onPress={() => onPress(item)} style={{ width }}>
    <Stack>
      <Image
        source={{ uri: item.imageUrl }}
        width={width}
        height={width * 0.56}
        borderRadius={4}
      />

      {showProgress && item.progress && item.progress > 0 && (
        <View position='absolute' bottom={0} left={0} right={0} height={3}>
          <View
            height='100%'
            width={`${item.progress}%`}
            backgroundColor='$red10'
          />
        </View>
      )}

      <Text
        color='white'
        fontSize={14}
        fontWeight='bold'
        marginTop={8}
        numberOfLines={1}
      >
        {item.title}
      </Text>

      {item.subtitle && (
        <Text fontSize={12} numberOfLines={1}>
          {item.subtitle}
        </Text>
      )}
    </Stack>
  </TouchableOpacity>
)

export const HorizontalCards = ({
  title,
  items,
  cardWidth,
  onCardPress,
  showProgress = true,
}: {
  title: string
  items: CardItem[]
  cardWidth: number
  onCardPress: (item: CardItem) => void
  showProgress?: boolean
}): JSX.Element | null => {
  if (items.length === 0) return null

  return (
    <YStack>
      <Text
        color='white'
        fontWeight='600'
        fontSize={20}
        paddingLeft={16}
        paddingVertical={12}
      >
        {title}
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingLeft: 16, paddingRight: 8 }}
      >
        <XStack gap={12}>
          {items.map((item) => (
            <MediaCard
              key={item.id}
              item={item}
              width={cardWidth}
              onPress={onCardPress}
              showProgress={showProgress}
            />
          ))}
        </XStack>
      </ScrollView>
    </YStack>
  )
}
