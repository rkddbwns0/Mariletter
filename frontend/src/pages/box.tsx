import {View} from 'react-native';
import CustomFont from '../../components/customFont';
import {useAuth} from '../auth/AuthContext';

const Box = () => {
  const {user} = useAuth();

  return (
    <View>
      <CustomFont children={`안녕하세요, ${user?.name}님`} size="extraLarge" />
    </View>
  );
};

export default Box;
