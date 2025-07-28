import {StyleSheet, View} from 'react-native';
import CustomFont from '../../components/customFont';
import {useAuth} from '../auth/AuthContext';

const MyPage = () => {
  const {user} = useAuth();

  return (
    <View style={styles.myPageContainer}>
      <CustomFont children={`안녕하세요, ${user?.name}님`} size="extraLarge" />
    </View>
  );
};

export default MyPage;

const styles = StyleSheet.create({
  myPageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#rgba(255, 229, 235, 1)',
  },
});
