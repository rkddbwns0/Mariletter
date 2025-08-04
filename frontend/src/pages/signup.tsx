import React, {use, useEffect, useRef, useState} from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import CustomFont from '../../components/customFont';
import CustomInput from '../../components/customInput';
import RadioButton from '../../components/radioButton';
import axios from 'axios';

const SignupPage = ({navigation}: {navigation: any}) => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [passwordCheck, setPasswordCheck] = React.useState('');
  const [name, setName] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [cerNum, setCerNum] = React.useState('');
  const [birth, setBirth] = React.useState('');
  const [gender, setGender] = React.useState('');

  const [errorMsg, setErrorMsg] = useState({
    email: '',
    password: '',
    passwordCheck: '',
    name: '',
    phone: '',
    cerNum: '',
    birth: '',
  });

  const [checkList, setCheckList] = useState({
    email: false,
    password: false,
    passwordCheck: false,
    birth: false,
  });

  const handleDupEmail = async () => {
    if (email === '') {
      setErrorMsg(prev => ({...prev, email: '이메일을 입력해 주세요.'}));
      return;
    }
    try {
      const response = await axios.get(`http://10.0.2.2:3000/users`, {
        params: {
          email: email,
        },
      });
      if (response.data.avalidate === true) {
        errorMsg.email = '사용 가능한 이메일입니다.';
        setCheckList(prev => ({...prev, email: true}));
      }
    } catch (e: any) {
      if (e.response.status === 409) {
        setErrorMsg(prev => ({...prev, email: e.response.data.message}));
        setCheckList(prev => ({...prev, email: false}));
      } else {
        setErrorMsg(prev => ({
          ...prev,
          email: '중복확인 과정에 문제가 발생하였습니다 다시 시도해 주세요.',
        }));
        setCheckList(prev => ({...prev, email: false}));
      }
    }
  };

  const validatePassword = (value: string) => {
    setPassword(value);
    if (value === '') {
      setErrorMsg(prev => ({...prev, password: ''}));
      setCheckList(prev => ({...prev, password: false}));
      return;
    }

    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,16}$/;
    if (passwordRegex.test(value)) {
      setErrorMsg(prev => ({...prev, password: '사용 가능한 비밀번호입니다.'}));
      setCheckList(prev => ({...prev, password: true}));
    } else {
      setErrorMsg(prev => ({
        ...prev,
        password: '영문과 숫자를 포함하여 8~20자로 입력해 주세요.',
      }));
      setCheckList(prev => ({...prev, password: false}));
    }

    if (passwordCheck !== '') {
      validatePasswordCheck(passwordCheck, value);
    }
  };

  const validatePasswordCheck = (value: string, passwordValue?: string) => {
    const comparedPassword = passwordValue ?? password;
    setPasswordCheck(value);

    if (value === '') {
      setErrorMsg(prev => ({...prev, passwordCheck: ''}));
      setCheckList(prev => ({...prev, passwordCheck: false}));
      return;
    } else if (value === comparedPassword) {
      setErrorMsg(prev => ({...prev, passwordCheck: '비밀번호가 일치합니다.'}));
      setCheckList(prev => ({...prev, passwordCheck: true}));
    } else {
      setErrorMsg(prev => ({
        ...prev,
        passwordCheck: '비밀번호가 일치하지 않습니다.',
      }));
      setCheckList(prev => ({...prev, passwordCheck: false}));
    }
  };
  const formatBrithDate = (input: string) => {
    const filtering = input.replace(/\D/g, '');

    const sliced = filtering.slice(0, 8);

    if (sliced.length >= 8) {
      return `${sliced.slice(0, 4)}-${sliced.slice(4, 6)}-${sliced.slice(
        6,
        8,
      )}`;
    }

    return sliced;
  };

  const handleKeyPress = (event: any) => {
    if (event.key === 'Enter') {
    }
  };

  const handleSignup = async () => {
    if (Object.values(checkList).every(value => value === true)) {
      try {
        const res = await axios.post('http://1.2.3.4:3000/users', {
          email: email,
          password: password,
          name: name,
          phone: phone,
          birth_day: birth,
          sex: gender,
        });
        Alert.alert('회원가입 완료', '회원가입을 완료했습니다.', [
          {
            text: '확인',
            onPress: () => {
              navigation.navigate('IndexPage');
            },
          },
        ]);
      } catch (e) {
        if (axios.isAxiosError(e)) {
          const message =
            e.response?.data.message ||
            '알 수 없는 에러가 발생했습니다. 다시 시도해 주세요.';
          Alert.alert('회원가입 실패', message);
        } else {
          Alert.alert('회원가입 실패', '알 수 없는 에러가 발생했습니다.');
        }
      }
    } else {
      Alert.alert('회원 정보를 모두 입력해 주세요.');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 20 : 0}
      style={styles.container}>
      <ScrollView
        style={{width: '100%'}}
        contentContainerStyle={styles.scrollContainer}>
        <View style={styles.logoView}>
          <Image
            source={require('../../images/logo.webp')}
            style={{width: 200}}
            resizeMode="contain"
          />
        </View>
        <View style={styles.inputContainer}>
          <View style={styles.inputView}>
            <CustomFont children="아이디(이메일)" size="medium" weight="bold" />
            <View style={styles.chkView}>
              <CustomInput
                width={220}
                placeholder="아이디(이메일)"
                value={email}
                onChangeText={setEmail}
                style={{marginTop: 10}}
              />
              <Pressable style={styles.chkBtn} onPress={handleDupEmail}>
                <CustomFont
                  children="중복확인"
                  size="small"
                  color="#rgba(124, 124, 124, 1)"
                  weight="500"
                  style={{lineHeight: 20}}
                />
              </Pressable>
            </View>
            {errorMsg.email !== '' && (
              <CustomFont
                children={errorMsg.email}
                size="small"
                color={checkList.email === true ? 'green' : 'red'}
                style={{marginTop: 5}}
              />
            )}
          </View>
          <View style={styles.inputView}>
            <CustomFont children="비밀번호" size="medium" weight="bold" />
            <CustomInput
              width={330}
              placeholder="비밀번호"
              secure
              value={password}
              onChangeText={text => validatePassword(text)}
              style={{marginTop: 10}}
              length={20}
            />
            {errorMsg.password !== '' && (
              <CustomFont
                children={errorMsg.password}
                size="small"
                style={{marginTop: 5}}
                color={checkList.password === true ? 'green' : 'red'}
              />
            )}
            <CustomInput
              width={330}
              placeholder="비밀번호 확인"
              secure
              value={passwordCheck}
              onChangeText={text => validatePasswordCheck(text)}
              style={{marginTop: 10}}
              length={20}
            />
            {errorMsg.passwordCheck !== '' && (
              <CustomFont
                children={errorMsg.passwordCheck}
                size="small"
                style={{marginTop: 5}}
                color={checkList.passwordCheck === true ? 'green' : 'red'}
              />
            )}
          </View>
          <View style={styles.inputView}>
            <CustomFont children="이름" size="medium" weight="bold" />
            <CustomInput
              width={330}
              placeholder="이름"
              value={name}
              onChangeText={setName}
              style={{marginTop: 10}}
            />
          </View>
          <View style={styles.inputView}>
            <CustomFont children="휴대폰 번호" size="medium" weight="bold" />
            <View style={styles.chkView}>
              <CustomInput
                width={220}
                placeholder="'-' 구분없이 입력"
                value={phone}
                onChangeText={setPhone}
                style={{marginTop: 10}}
                length={11}
              />
              <Pressable style={styles.chkBtn}>
                <CustomFont
                  children="인증번호 전송"
                  size="small"
                  color="#rgba(124, 124, 124, 1)"
                  weight="500"
                  style={{lineHeight: 20}}
                />
              </Pressable>
            </View>
            <CustomInput
              width={330}
              placeholder="인증 번호"
              value={cerNum}
              onChangeText={setCerNum}
              style={{marginTop: 10}}
            />
          </View>
          <View style={styles.inputView}>
            <CustomFont children="생년월일" size="medium" weight="bold" />
            <CustomInput
              width={330}
              placeholder="8자리 입력"
              value={birth}
              onChangeText={text => {
                const formatted = formatBrithDate(text);
                setBirth(formatted);
              }}
              style={{marginTop: 10}}
            />
          </View>
          <View style={styles.inputView}>
            <CustomFont children="성별" size="medium" weight="bold" />
            <View style={styles.genderView}>
              <View style={styles.chkGender}>
                <RadioButton
                  onPress={setGender}
                  value="f"
                  selectValue={gender}
                />
                <CustomFont
                  children="여성"
                  size="medium"
                  weight="500"
                  style={{marginLeft: 8}}
                />
              </View>
              <View style={styles.chkGender}>
                <RadioButton
                  onPress={setGender}
                  value="m"
                  selectValue={gender}
                />
                <CustomFont
                  children="남성"
                  size="medium"
                  weight="500"
                  style={{marginLeft: 8}}
                />
              </View>
            </View>
          </View>
        </View>
        <View style={styles.btnView}>
          <Pressable style={styles.btn} onPress={handleSignup}>
            <CustomFont
              children="가입하기"
              size="medium"
              weight="500"
              style={{lineHeight: 20}}
            />
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
export default SignupPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#rgba(255, 229, 235, 1)',
  },
  scrollContainer: {
    flexGrow: 1,
  },
  logoView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputContainer: {
    alignItems: 'center',
    width: '100%',
  },
  inputView: {
    alignItems: 'flex-start',
    width: '80%',
    margin: 5,
  },
  input: {
    width: '100%',
    height: 40,
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    backgroundColor: 'white',
    marginTop: 5,
  },
  genderView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: '100%',
    marginTop: 10,
  },
  chkGender: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: '50%',
  },
  chkView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  chkBtn: {
    width: '30%',
    height: 40,
    borderRadius: 10,
    backgroundColor: '#rgba(255, 143, 204, 1)',
    marginTop: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnView: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  btn: {
    width: '80%',
    height: 40,
    padding: 10,
    borderRadius: 20,
    backgroundColor: '#rgba(255, 143, 204, 1)',
    marginTop: 5,
    alignItems: 'center',
  },
});
