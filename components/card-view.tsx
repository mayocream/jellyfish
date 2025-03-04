import React from 'react'
import { Dimensions, TouchableOpacity } from 'react-native'
import { ScrollView, Image, View, Text, XStack, YStack, styled } from 'tamagui'

const { width } = Dimensions.get('window')
const CARD_WIDTH = width * 0.85

// Types
interface CardItem {
  id: string
  imageUrl?: string
  title?: string
  subtitle?: string
  progress: number
}

interface HorizontalCardScrollerProps {
  cards: CardItem[]
  onCardPress?: (card: CardItem) => void
}

const Card = styled(TouchableOpacity, {
  width: CARD_WIDTH,
  height: 220,
  borderRadius: 12,
  overflow: 'hidden',
  marginHorizontal: 10,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 4,
})

const CardBackground = styled(Image, {
  width: '100%',
  height: '100%',
  position: 'absolute',
  borderRadius: 12,
})

const ProgressBarContainer = styled(View, {
  flex: 1,
  height: 6,
  backgroundColor: 'rgba(255, 255, 255, 0.3)',
  borderRadius: 3,
  marginRight: 10,
})

const ProgressBar = styled(View, {
  height: '100%',
  backgroundColor: '#4CAF50',
  borderRadius: 3,
})

/**
 * HorizontalCardScroller - A horizontally scrollable component with cards
 */
const HorizontalCardScroller: React.FC<HorizontalCardScrollerProps> = ({
  cards = [],
  onCardPress = () => {},
}) => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingVertical: 16, paddingHorizontal: 10 }}
      snapToInterval={CARD_WIDTH + 20}
      snapToAlignment='center'
      decelerationRate='fast'
    >
      {cards.map((card) => (
        <Card
          key={card.id}
          onPress={() => onCardPress(card)}
          activeOpacity={0.9}
        >
          <CardBackground source={{ uri: card.imageUrl }} />

          <YStack flex={1} justifyContent='space-between'>
            {/* Card content */}
            <YStack padding={16}>
              {card.title && (
                <Text
                  color='#FFFFFF'
                  fontSize={18}
                  fontWeight='bold'
                  textShadowColor='rgba(0, 0, 0, 0.75)'
                  textShadowOffset={{ width: 0, height: 1 }}
                  textShadowRadius={2}
                >
                  {card.title}
                </Text>
              )}

              {card.subtitle && (
                <Text
                  color='#AAAAAA'
                  fontSize={18}
                  fontWeight='bold'
                  textShadowColor='rgba(0, 0, 0, 0.75)'
                  textShadowOffset={{ width: 0, height: 1 }}
                  textShadowRadius={2}
                >
                  {card.subtitle}
                </Text>
              )}
            </YStack>

            {/* Toolbar with progress */}
            <XStack
              alignItems='center'
              backgroundColor='rgba(0, 0, 0, 0.6)'
              padding={12}
              borderBottomLeftRadius={12}
              borderBottomRightRadius={12}
            >
              <ProgressBarContainer>
                <ProgressBar width={`${card.progress || 0}%`} />
              </ProgressBarContainer>

              <Text color='#FFFFFF' fontSize={12} fontWeight='bold'>
                {`${Math.round(card.progress || 0)}%`}
              </Text>
            </XStack>
          </YStack>
        </Card>
      ))}
    </ScrollView>
  )
}

export { CardItem, HorizontalCardScroller }
