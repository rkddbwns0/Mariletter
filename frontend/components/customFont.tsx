import {StyleProp, StyleSheet, Text, TextStyle, View} from 'react-native';

interface Props {
  children: string;
  size: 'small' | 'medium' | 'large' | 'extraLarge';
  color?: string;
  weight?:
    | 'normal'
    | 'bold'
    | '100'
    | '200'
    | '300'
    | '400'
    | '500'
    | '600'
    | '700'
    | '800'
    | '900';
  style?: StyleProp<TextStyle>;
}

const SIZE = {
  small: 12,
  medium: 14,
  large: 20,
  extraLarge: 24,
};

const CustomFont = (props: Props) => {
  const {children, size, color, weight, style} = props;
  return (
    <View>
      <Text
        style={[
          {fontSize: SIZE[size], color: color, fontWeight: weight},
          style,
        ]}>
        {children}
      </Text>
    </View>
  );
};

export default CustomFont;
