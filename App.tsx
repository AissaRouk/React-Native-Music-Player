// App.js
import React, {useLayoutEffect, useState} from 'react';
import {setupPlayer, addTrack, playbackService} from './musicPlayerServices';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';
import MainScreen from './src/Screens/MainScreen';
import SearchScreen from './src/Screens/SearchScreen';
import {ContextProvider} from './src/Context/Context';

export function App() {
  const Stack = createNativeStackNavigator();

  return (
    <ContextProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="main"
          screenOptions={{headerShown: false}}>
          <Stack.Screen name="main" component={MainScreen} />
          <Stack.Screen name="search" component={SearchScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </ContextProvider>
  );
}

export default App;
