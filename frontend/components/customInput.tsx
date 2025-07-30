import {Pressable, StyleSheet, TextInput, TextStyle, View} from 'react-native';
import CustomFont from './customFont';

interface Props {
  placeholder: string;
  color?: string;
  width: number;
  value?: string;
  length?: number;
  onChangeText: (text: string) => void;
  onPress?: () => void;
  secure?: boolean;
  style?: TextStyle;
}

const CustomInput = (props: Props) => {
  const {
    placeholder,
    color,
    width,
    value,
    length,
    onChangeText,
    onPress,
    secure,
    style,
  } = props;
  return (
    <TextInput
      value={value}
      onChangeText={onChangeText}
      onPressIn={onPress}
      placeholder={placeholder}
      secureTextEntry={secure}
      style={[styles.input, {width: width, color: color}, style]}
      scrollEnabled={false}
      maxLength={length}
    />
  );
};

export default CustomInput;

const styles = StyleSheet.create({
  input: {
    height: 40,
    padding: 10,
    borderRadius: 10,
    backgroundColor: 'white',
    fontSize: 13,
  },
});
