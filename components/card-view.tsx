import React from 'react'
import { Dimensions, TouchableOpacity } from 'react-native'
import { ScrollView, Image, View, Text, XStack, YStack, styled, useWindowDimensions } from 'tamagui'

const { width, height } = useWindowDimensions()
const isLandscape = width > height

// Types
interface CardItem {
  id: string
  imageUrl?: string
  title?: string
  subtitle?: string
  progress: number
  rating?: number // Add rating property
}

interface HorizontalCardScrollerProps {
  cards: CardItem[]
  cardWidthPercent?: number
  cardOrientation?: 'horizontal' | 'vertical'
  hideProgressBar?: boolean
  onCardPress?: (card: CardItem) => void
}

const Card = styled(TouchableOpacity, {
  borderRadius: 3,
  overflow: 'hidden',
  marginHorizontal: 10,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 4,
})

const CardImageContainer = styled(View, {
  width: '100%',
  overflow: 'hidden',
  borderTopLeftRadius: 3,
  borderTopRightRadius: 3,
})

const CardImage = styled(Image, {
  width: '100%',
  height: '100%',
  borderTopLeftRadius: 3,
  borderTopRightRadius: 3,
})

const CardContent = styled(YStack, {
  borderRadius: 3,
  padding: 12,
  backgroundColor: '#CCCCCC',
})

const ProgressBarContainer = styled(View, {
  flex: 1,
  height: 6,
  backgroundColor: 'rgba(200, 200, 200, 0.3)',
  borderRadius: 3,
  marginRight: 10,
})

const ProgressBar = styled(View, {
  height: '100%',
  backgroundColor: '#4CAF50',
  borderRadius: 3,
})

const RatingContainer = styled(View, {
  backgroundColor: '#FFD700', // Gold color for the rating
  borderRadius: 12,
  paddingHorizontal: 8,
  paddingVertical: 2,
  alignItems: 'center',
  justifyContent: 'center',
})

/**
 * HorizontalCardScroller - A horizontally scrollable component with cards
 */
const HorizontalCardScroller: React.FC<HorizontalCardScrollerProps> = ({
  cards = [],
  cardWidthPercent = 0.85,
  hideProgressBar = false,
  cardOrientation = 'horizontal',
  onCardPress = () => { },
}) => {
  // Calculate card dimensions
  const cardWidth = cardWidthPercent * (isLandscape ? height: width);
  const imageHeight = cardOrientation === "horizontal"
    ? cardWidth * (1 / 1.77)  // Horizontal aspect ratio
    : cardWidth * 1.2;      // Vertical aspect ratio, adjusted to allow space for text below

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingVertical: 16, paddingHorizontal: 10 }}
      snapToInterval={cardWidth + 20}
      snapToAlignment='center'
      decelerationRate='fast'
    >
      {cards.map((card) => (
        <Card
          width={cardWidth}
          key={card.id}
          onPress={() => onCardPress(card)}
          activeOpacity={0.9}
        >
          <YStack>
            {/* Image Container */}
            <CardImageContainer height={imageHeight}>
              <CardImage source={{ uri: card.imageUrl }} />

              {/* Progress Bar (if needed on the image) */}
              {!hideProgressBar && (
                <XStack
                  alignItems='center'
                  backgroundColor='rgba(0, 0, 0, 0.6)'
                  padding={12}
                  position='absolute'
                  bottom={0}
                  left={0}
                  right={0}
                >
                  <ProgressBarContainer>
                    <ProgressBar width={`${card.progress || 0}%`} />
                  </ProgressBarContainer>
                  <Text color='#FFFFFF' fontSize={12} fontWeight='bold'>
                    {`${Math.round(card.progress || 0)}%`}
                  </Text>
                </XStack>
              )}
            </CardImageContainer>

            {/* Title and subtitle below the image */}
            <CardContent>
              {card.title && (
                <Text
                  color='#000000'
                  fontSize={16}
                  fontWeight='bold'
                >
                  {card.title}
                </Text>
              )}

              {/* Subtitle with rating */}
              {card.subtitle && (
                <XStack
                  justifyContent='space-between'
                  alignItems='center'
                  marginTop={4}
                >
                  <Text
                    color='#666666'
                    fontSize={12}
                    flex={1}
                  >
                    {card.subtitle}
                  </Text>
                  
                  {card.rating !== undefined && (
                    <RatingContainer>
                      <Text
                        color='#000000'
                        fontSize={12}
                        fontWeight='bold'
                      >
                        {card.rating.toFixed(1)}
                      </Text>
                    </RatingContainer>
                  )}
                </XStack>
              )}
            </CardContent>
          </YStack>
        </Card>
      ))}
    </ScrollView>
  )
}

export { CardItem, HorizontalCardScroller }