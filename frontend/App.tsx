import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React, {useEffect} from 'react';
import IndexPage from './pages/index';
import SignupPage from './pages/signup';
import Main from './pages/main';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import MyPage from './pages/MyPage';
import Box from './pages/box';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator initialRouteName="Main">
      <Tab.Screen
        name="myPage"
        component={MyPage}
        options={{headerShown: false}}
      />
      <Tab.Screen name="Main" component={Main} options={{headerShown: false}} />
      <Tab.Screen name="Box" component={Box} options={{headerShown: false}} />
    </Tab.Navigator>
  );
}

const Stack = createNativeStackNavigator();

function App(): React.JSX.Element {
  const [accessToken, setAccessToken] = React.useState<string | null>(null);
  const [refreshToken, setRefreshToken] = React.useState<string | null>(null);

  useEffect(() => {
    const getProfile = async () => {
      try {
        const accessToken = await AsyncStorage.getItem('access_token');
        const refreshToken = await AsyncStorage.getItem('refresh_token');

        const response = await axios.get(`http://10.0.2.2:3000/users/profile`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'refresh-token': refreshToken,
          },
        });
      } catch (e) {
        console.error(e);
      }
    };
    getProfile();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Index">
        <Stack.Screen
          name="Index"
          component={IndexPage}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Signup"
          component={SignupPage}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="MainTabs"
          component={MainTabs}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
