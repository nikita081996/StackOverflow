import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

// Loading component to show loading indicator
export const Loading = () => (
  <View style={styles.loadingView}>
    <ActivityIndicator size="large" color="#512DA8" />
    <View style={styles.textViewStyle}>
      <Text style={styles.loadingText}>Loading . . .</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  loadingView: {
    marginTop: 200
  },
  loadingText: {
    color: '#512DA8',
    fontSize: 14,
    fontWeight: 'bold'
  },
  textViewStyle: {
    justifyContent: 'center',
    alignItems: 'center'
  }
});
