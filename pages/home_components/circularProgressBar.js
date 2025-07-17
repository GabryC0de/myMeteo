import { Circle } from 'react-native-progress';
import { View, Text, StyleSheet } from 'react-native';

export const CircularProgressBar = ({ progress, size = 100, color }) => (
  <View style={styles.circleContainer}>
    <Circle
      size={size}
      progress={progress}
      thickness={6}
      color={color || '#FF9500'}
      unfilledColor="#E5E5E5"
      borderWidth={0}
      endAngle={0.8} // Per un effetto "aperto" come Xiaomi
      strokeCap="round"
    />
    <Text style={[styles.progressText, { color: color }]}>
      {Math.round(progress * 100)}%
    </Text>
  </View>
);

const styles = StyleSheet.create({
  circleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressText: {
    position: 'absolute',
    fontSize: 20,
    fontWeight: 'bold',
  }
});