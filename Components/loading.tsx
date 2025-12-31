import { Dimensions, StyleSheet, View } from 'react-native';
import * as Progress from 'react-native-progress';
import React from 'react';

const screenWidth = Dimensions.get('window').width;
const screenHeigh = Dimensions.get('window').height;

export default function Loading() {
  return (
    <View style={[{ width: screenWidth, height: screenHeigh * 0.5 }, styles.container]}>
      <Progress.CircleSnail thickness={8} size={100} color={['red', 'green', 'blue']} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
