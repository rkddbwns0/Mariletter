import React from 'react';
import {Image, Pressable, View} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {
  createBottomTabNavigator,
  BottomTabBarButtonProps,
} from '@react-navigation/bottom-tabs';
import {useAuth} from '../auth/AuthContext';

import IndexPage from '../pages/index';
import MainPage from '../pages/main';
import MyPage from '../pages/myPage';
import BoxPage from '../pages/box';
import SignupPage from '../pages/signup';

// Define the param lists for the navigators for type safety
type RootStackParamList = {
  IndexPage: undefined;
  SignupPage: undefined;
};

type MainTabParamList = {
  마이페이지: undefined;
  홈: undefined;
  보관함: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

const AuthStack = () => (
  <Stack.Navigator initialRouteName="IndexPage">
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

const MainTabs = () => (
  <Tab.Navigator
    initialRouteName="홈"
    screenOptions={{
      headerShown: false,
      tabBarActiveTintColor: '#rgba(255, 143, 204, 1)',
      tabBarInactiveTintColor: '#rgba(255, 143, 204, 1)',
      tabBarItemStyle: {
        alignItems: 'center',
        justifyContent: 'center',
      },
      tabBarStyle: {
        position: 'absolute',
        bottom: 10,
        right: 20,
        left: 20,
        backgroundColor: 'transparent',
        borderTopWidth: 0,
        elevation: 0,
        height: 65,
        alignItems: 'center',
        justifyContent: 'center',
      },
      tabBarBackground: () => (
        <View
          style={{
            position: 'absolute',
            right: 20,
            left: 20,
            height: 65,
            backgroundColor: 'transparent',
            borderTopWidth: 1,
            borderTopColor: '#rgba(255, 143, 204, 1)',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        />
      ),
      tabBarLabelStyle: {
        fontSize: 10,
        fontWeight: '600',
        marginTop: 5,
      },
    }}>
    <Tab.Screen
      name="마이페이지"
      component={MyPage}
      options={{
        tabBarIcon: ({size}) => (
          <Image
            source={require('../../images/myPage.png')}
            style={{width: size, height: size, marginTop: 10}}
            resizeMode="contain"
          />
        ),
      }}
    />
    <Tab.Screen
      name="홈"
      component={MainPage}
      options={{
        tabBarIcon: ({size}) => (
          <Image
            source={require('../../images/home.png')}
            style={{width: size, height: size, marginTop: 10}}
            resizeMode="contain"
          />
        ),
      }}
    />
    <Tab.Screen
      name="보관함"
      component={BoxPage}
      options={{
        tabBarIcon: ({size}) => (
          <Image
            source={require('../../images/box.png')}
            style={{width: size, height: size, marginTop: 10}}
            resizeMode="contain"
          />
        ),
      }}
    />
  </Tab.Navigator>
);

const RootNavigator = () => {
  const {logined} = useAuth();

  return logined ? <MainTabs /> : <AuthStack />;
};

export default RootNavigator;
