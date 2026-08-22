import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { RootNavigator } from './src/navigation/RootNavigator'; 
import Toast from 'react-native-toast-message';
export default function App() {
  return (
    <>
    <NavigationContainer>
      <RootNavigator />
    </NavigationContainer>
    <Toast />
    </>
  );
}