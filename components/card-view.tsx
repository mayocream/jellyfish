import React from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  ImageBackground,
  Text,
  Dimensions,
  TouchableOpacity,
  ImageSourcePropType,
} from 'react-native';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.85;
const CARD_MARGIN = 10;

interface CardItem {
  id: string;
  imageUrl?: string;
  title?: string;
  subtitle?: string
  progress: number;
}

interface HorizontalCardScrollerProps {
  cards: CardItem[];
  onCardPress?: (card: CardItem) => void;
}

/**
 * HorizontalCardScroller - A horizontally scrollable component with cards
 * @param {CardItem[]} cards - Array of card objects with properties: 
 *                       - id: unique identifier
 *                       - imageUrl: background image source
 *                       - title: card title (optional)
 *                       - progress: number between 0-100
 * @param {Function} onCardPress - Function to call when a card is pressed
 * @returns {JSX.Element}
 */
const HorizontalCardScroller: React.FC<HorizontalCardScrollerProps> = ({ 
  cards = [], 
  onCardPress = () => {} 
}) => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.scrollContainer}
      snapToInterval={CARD_WIDTH + CARD_MARGIN * 2}
      snapToAlignment="center"
      decelerationRate="fast"
    >
      {cards.map((card) => (
        <TouchableOpacity
          key={card.id}
          style={styles.cardContainer}
          onPress={() => onCardPress(card)}
          activeOpacity={0.9}
        >
          <ImageBackground
            source={{ uri: card.imageUrl }}
            style={styles.cardBackground}
            imageStyle={styles.cardBackgroundImage}
          >
            <View style={styles.cardContent}>
              {card.title && <Text style={styles.cardTitle}>{card.title}</Text>}
              {card.subtitle && <Text style={styles.cardSubTitle}>{card.subtitle}</Text>}
            </View>
            <View style={styles.toolbar}>
              <View style={styles.progressBarContainer}>
                <View 
                  style={[
                    styles.progressBar, 
                    { width: `${card.progress || 0}%` }
                  ]} 
                />
              </View>
              <Text style={styles.progressText}>{`${Math.round(card.progress || 0)}%`}</Text>
            </View>
          </ImageBackground>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    paddingVertical: 16,
    paddingHorizontal: CARD_MARGIN,
  },
  cardContainer: {
    width: CARD_WIDTH,
    height: 220,
    marginHorizontal: CARD_MARGIN,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardBackground: {
    flex: 1,
    justifyContent: 'space-between',
  },
  cardBackgroundImage: {
    borderRadius: 12,
  },
  cardContent: {
    flex: 1,
    padding: 16,
  },
  cardTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  cardSubTitle: {
    color: '#AAAAAA',
    fontSize: 18,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 12,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  progressBarContainer: {
    flex: 1,
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 3,
    marginRight: 10,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 3,
  },
  progressText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export { CardItem, HorizontalCardScroller };