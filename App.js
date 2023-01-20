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

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import {createAppContainer} from 'react-navigation'
import {createStackNavigator} from 'react-navigation-stack'

// pages 
import WebRTC from './src/Pages/WebRTC';
import Main   from './src/Pages/Main';
import Room   from './src/Pages/Room';

const App = (props) => {
const options = {
  headerMode:'none',
  mode:'card'
}

  const AppNavigator = createStackNavigator({
    Main:Main,
    Room:Room,
  }, options, options,initialRouteName='Main')

  const AppContainer = createAppContainer(AppNavigator)


return (
  <SafeAreaView style={{flex:1}} edges={['right', 'bottom', 'left']}>
    <AppContainer/>
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
