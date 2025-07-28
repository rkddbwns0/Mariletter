import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {useAuth} from '../auth/AuthContext';

import IndexPage from '../pages/index';
import MainPage from '../pages/main';
import MyPage from '../pages/myPage';
import BoxPage from '../pages/box';
import SignupPage from '../pages/signup';

const Stack = createNativeStackNavigator();

const AuthStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="IndexPage"
      component={IndexPage}
      options={{headerShown: false}}
    />
    <Stack.Screen
      name="SignupPage"
      component={SignupPage}
      options={{headerShown: false}}
    />
  </Stack.Navigator>
);

const MainStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="MainPage"
      component={MainPage}
      options={{headerShown: false}}
    />
    <Stack.Screen
      name="MyPage"
      component={MyPage}
      options={{headerShown: false}}
    />
    <Stack.Screen
      name="BoxPage"
      component={BoxPage}
      options={{headerShown: false}}
    />
  </Stack.Navigator>
);

const RootNavigator = () => {
  const {logined} = useAuth();

  return logined ? <MainStack /> : <AuthStack />;
};

export default RootNavigator;
