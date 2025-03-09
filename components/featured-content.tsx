import React, { useState, useEffect, useRef } from 'react'
import { Text, Image, View, Stack, Button } from 'tamagui'
import { TouchableOpacity } from 'react-native'
import { CardItem } from '@/components/horizontal-cards'
import { ChevronLeft, ChevronRight } from '@tamagui/lucide-icons'

export const FeaturedContent = ({
  content,
  height,
  onPlayPress,
}: {
  content: CardItem[]
  height: number
  onPlayPress: (item: CardItem) => void
}): JSX.Element => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // Auto-scroll logic
  useEffect(() => {
    if (content.length <= 1) return

    // Set up interval for auto-scrolling
    intervalRef.current = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % content.length)
    }, 10000) // 10 seconds

    // Cleanup interval on unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [content])

  // Navigation handlers
  const handlePrev = () => {
    // Reset timer when manually navigating
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % content.length)
      }, 10000)
    }
    
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? content.length - 1 : prevIndex - 1
    )
  }

  const handleNext = () => {
    // Reset timer when manually navigating
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % content.length)
      }, 10000)
    }
    
    setCurrentIndex((prevIndex) => (prevIndex + 1) % content.length)
  }

  if (!content || content.length === 0) return <></>

  const currentContent = content[currentIndex]

  return (
    <Stack height={height} position="relative">
      <Image
        source={{ uri: currentContent.imageUrl }}
        position='absolute'
        top={0}
        left={0}
        right={0}
        bottom={0}
      />

      {/* Navigation arrows */}
      {content.length > 1 && (
        <>
          <TouchableOpacity
            onPress={handlePrev}
            style={{
              position: 'absolute',
              left: 16,
              top: '50%',
              zIndex: 10,
              backgroundColor: 'rgba(0,0,0,0.5)',
              borderRadius: 20,
              padding: 8,
            }}
          >
            <ChevronLeft size={24} color="white" />
          </TouchableOpacity>
          
          <TouchableOpacity
            onPress={handleNext}
            style={{
              position: 'absolute',
              right: 16,
              top: '50%',
              zIndex: 10,
              backgroundColor: 'rgba(0,0,0,0.5)',
              borderRadius: 20,
              padding: 8,
            }}
          >
            <ChevronRight size={24} color="white" />
          </TouchableOpacity>
        </>
      )}

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
        <Stack flexDirection="row" alignItems="center" gap={12}>
          {/* Logo image instead of plain text */}
          {currentContent.logoURL && (
            <Image
              source={{ uri: currentContent.logoURL }}
              width={200}
              height={150}
              resizeMode="contain"
            />
          )}
        </Stack>

        {currentContent.subtitle && <Text fontSize={16} color="white">{currentContent.subtitle}</Text>}

        <TouchableOpacity
          onPress={() => onPlayPress(currentContent)}
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

      {/* Dots indicator for multiple cards */}
      {/* {content.length > 1 && (
        <Stack 
          flexDirection="row" 
          justifyContent="center" 
          gap={8} 
          position="absolute" 
          bottom={8} 
          left={0} 
          right={0}
        >
          {content.map((_, index) => (
            <View 
              key={index}
              width={8}
              height={8}
              borderRadius={4}
              backgroundColor={index === currentIndex ? 'white' : 'rgba(255,255,255,0.5)'}
            />
          ))}
        </Stack>
      )} */}
    </Stack>
  )
}