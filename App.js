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
import WebRTC from './src/components/WebRTC';
import Main from './src/components/Main';
import {createAppContainer} from 'react-navigation'
import {createStackNavigator} from 'react-navigation-stack'

const App = (props) => {
const options = {
  headerMode:'none',
  mode:'card'
}
  const roomBlock = createStackNavigator({
    WebRTC:WebRTC
  }, options, options.initialRouteName='WebRTC')

  const mainBlock = createStackNavigator({
    Main:Main
  }, options, options.initialRouteName='Main')

  const AppNavigator = createStackNavigator({
    Main:mainBlock,
    Room:roomBlock,
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
