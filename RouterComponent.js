import React from 'react';
import { StyleSheet } from 'react-native';
import { Scene, Router } from 'react-native-router-flux';
import HomeComponent from './src/modules/home/HomeComponent';
import AnswerComponent from './src/modules/answer/AnswerComponent';

const RouterComponent = () => (
  <Router
    navigationBarStyle={styles.navBar}
    titleStyle={styles.navTitle}
    barButtonIconStyle={{ tintColor: 'white' }}
  >
    <Scene key="root">
      <Scene key="homeComponent" component={HomeComponent} title="Home" />
      <Scene key="answerComponent" component={AnswerComponent} title="Answer" />
    </Scene>
  </Router>
);

const styles = StyleSheet.create({
  navBar: {
    backgroundColor: '#512DA8',
    justifyContent: 'flex-start' // changing navbar color
  },
  navTitle: {
    color: 'white',
    justifyContent: 'flex-start' // changing navbar title color
  }
});

export default RouterComponent;
