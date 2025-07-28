import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {AuthProvider} from './src/auth/AuthContext';
import RootNavigator from './src/navigation/RootNavigator';

const App = () => {
  return (
    <AuthProvider>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
};

export default App;
