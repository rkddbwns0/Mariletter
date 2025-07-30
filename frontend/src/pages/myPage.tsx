import {Pressable, StyleSheet, View} from 'react-native';
import CustomFont from '../../components/customFont';
import {useAuth} from '../auth/AuthContext';

const MyPage = () => {
  const {user, logout} = useAuth();

  return (
    <View style={styles.myPageContainer}>
      <View></View>
      <View style={styles.profileView}>
        <View style={styles.profile}></View>
        <CustomFont
          children={`${user?.name}님`}
          size="large"
          style={{marginTop: 10}}
        />
      </View>
      <View style={styles.changeInfoView}>
        <Pressable style={styles.changeInfoBtn}>
          <CustomFont
            children="내 정보 수정"
            size="small"
            weight="400"
            style={{lineHeight: 20, fontSize: 13}}
          />
        </Pressable>
      </View>
      <View style={styles.ddayView}>
        <CustomFont
          children="현재 결혼 대상이 없습니다."
          size="large"
          weight="500"
        />
      </View>
      <View>
        <View>
          <Pressable onPress={logout}>
            <CustomFont children="로그아웃" size="medium" />
          </Pressable>
        </View>
        <View></View>
      </View>
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
  profileView: {
    alignItems: 'center',
  },
  profile: {
    width: 80,
    height: 80,
    borderRadius: 50,
    backgroundColor: 'white',
    alignSelf: 'center',
  },
  changeInfoView: {
    alignItems: 'center',
    marginTop: 30,
  },
  changeInfoBtn: {
    backgroundColor: 'white',
    width: 95,
    height: 35,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  ddayView: {
    marginTop: 30,
  },
});
