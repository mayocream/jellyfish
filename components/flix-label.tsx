import React from 'react'
import { Label, View, useWindowDimensions } from 'tamagui'
import { Dimensions, TouchableOpacity } from 'react-native'

/** */

interface FlixLabelProps {
  fontSize?: number
  barColor?: string
  text: string
}
const FlixLabel: React.FC<FlixLabelProps> = ({
  text = '',
  fontSize = 22,
  barColor = '$red10',
}) => {
  return (
    <View
      width='100%'
      paddingTop={12}
      paddingBottom={4}
      paddingLeft={16}
      flexDirection='row'
      alignItems='center'
    >
      <View
        width={3}
        height={fontSize}
        backgroundColor={barColor}
        marginRight={8}
      />
      <Label fontSize={fontSize} textAlign='left'>
        {text}
      </Label>
    </View>
  )
}

export { FlixLabel }
