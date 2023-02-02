/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {SafeAreaView} from 'react-native-safe-area-context'
import {
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';


import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// pages 
import Main   from './src/Pages/Main';
import Room   from './src/Pages/Room';

const App = (props) => {
const options = {
  headerMode:'none',
  mode:'card'
}

const Stack = createNativeStackNavigator();

  // const mainBlock = createStackNavigator({
  //   Main:Main,
  // }, options, options.initialRouteName='Main')

  

  // const roomblock = createStackNavigator({
  //   Room:Room,
  // }, options, options.initialRouteName='Room', options.headerLeft=null)

  // const AppNavigator = () =>
  // createSwitchNavigator(
  //   {
  //     Main:mainBlock,
  //     Room:roomblock
  //   },
  //   options,
  //   (options.initialRouteName = 'Main'),
  // )

  // const AppContainer = createAppContainer(AppNavigator)


return (
  <SafeAreaView style={{flex:1}} edges={['right', 'bottom', 'left']}>
    {/* <AppContainer/> */}
    <NavigationContainer>
      <Stack.Navigator  screenOptions={{headerShown:false}}>
        <Stack.Screen name='Main' component={Main}  />
        <Stack.Screen {...props} name='Room' component={Room} options={{ headerBackVisible:false, gestureEnabled:false}}/>
      </Stack.Navigator>
    </NavigationContainer>
  </SafeAreaView>
)



};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
