import {Pressable, StyleSheet, Text, View} from 'react-native';

interface Props {
  onPress: (value: string) => void;
  value: string;
  selectValue: string;
}

const RadioButton = ({selectValue, onPress, value}: Props) => {
  const isSelected = selectValue === value;
  return (
    <Pressable style={styles.radioStyle} onPress={() => onPress(value)}>
      {isSelected && <View style={styles.chkItem}></View>}
    </Pressable>
  );
};

export default RadioButton;

const styles = StyleSheet.create({
  radioStyle: {
    borderWidth: 2,
    width: 25,
    height: 25,
    borderRadius: 20,
    borderColor: '#rgba(124, 124, 124, 1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  chkItem: {
    width: 15,
    height: 15,
    borderRadius: 20,
    backgroundColor: '#rgba(255, 143, 204, 1)',
  },
});
