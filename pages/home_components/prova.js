import React from 'react';
import { View } from 'react-native';
import * as Progress from 'react-native-progress';

function TestProgress() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Progress.Bar progress={0.5} width={200} />
      <Progress.Circle size={100} progress={0.7} />
    </View>
  );
}

export default TestProgress;