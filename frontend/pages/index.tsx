import React from 'react';
import {
  Alert,
  Button,
  Image,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import CustomFont from '../components/customFont';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const IndexPage = ({navigation}: {navigation: any}) => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const handleSignup = () => {
    navigation.navigate('Signup');
  };

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('이메일과 비밀번호를 입력해주세요.');
      return;
    }
    try {
      const response = await axios.post(`http://10.0.2.2:3000/users/login`, {
        email: email,
        password: password,
      });

      console.log(response);

      if (response.status === 201) {
        await AsyncStorage.setItem('access_token', response.data.access_token);
        await AsyncStorage.setItem(
          'refresh_token',
          response.data.refresh_token,
        );
        navigation.navigate('MainTabs');
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.topView}>
        <Image
          source={require('../images/logo.webp')}
          style={{width: '60%', marginBottom: 30}}
          resizeMode="contain"
        />
      </View>
      <View style={styles.InputView}>
        <TextInput
          style={styles.indexInput}
          placeholder="이메일"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.indexInput}
          placeholder="비밀번호"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
      </View>
      <View style={styles.subView}>
        <View style={styles.checkView}>
          <Pressable style={styles.checkbox}></Pressable>
          <CustomFont children="로그인 정보 저장" size="small" />
        </View>
        <View>
          <Pressable style={styles.findBtn}>
            <CustomFont children="아이디/비밀번호 찾기" size="small" />
          </Pressable>
        </View>
      </View>
      <View style={styles.btnView}>
        <Pressable
          style={({pressed}) => [
            {
              backgroundColor: pressed ? 'white' : '#rgba(255, 143, 204, 1)',
            },
            styles.loginBtn,
          ]}
          onPress={handleLogin}>
          <CustomFont children="로그인" size="medium" weight="500" />
        </Pressable>
        <Pressable style={styles.signupBtn} onPress={handleSignup}>
          <CustomFont
            children="회원가입"
            size="small"
            weight="500"
            color="#rgba(124, 124, 124, 1)"
          />
        </Pressable>
        <View style={styles.lineContainer}>
          <View style={styles.lineText}>
            <CustomFont
              children="SNS 계정으로 시작하기"
              size="small"
              color="color: '#rgba(124, 124, 124, 1)'"
            />
          </View>
          <View style={styles.line} />
        </View>
        <View>
          <Button title="Kakao" />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#rgba(255, 229, 235, 1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  topView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    width: '100%',
  },
  InputView: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: '100%',
  },
  indexInput: {
    width: 300,
    height: 45,
    margin: 10,
    padding: 10,
    borderRadius: 20,
    backgroundColor: 'white',
    paddingLeft: 15,
  },
  subView: {
    alignItems: 'center',
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: 10,
  },
  checkView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 17,
    height: 17,
    borderRadius: 5,
    backgroundColor: 'white',
    marginRight: 10,
  },
  findBtn: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  // btn
  btnView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: '70%',
    marginTop: 10,
  },
  // line
  lineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  line: {
    flex: 1,
    height: 2,
    backgroundColor: 'white',
  },
  lineText: {
    paddingHorizontal: 5,
  },
  loginBtn: {
    width: 300,
    height: 45,
    margin: 10,
    padding: 10,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  signupBtn: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default IndexPage;
