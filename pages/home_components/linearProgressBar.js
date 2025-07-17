import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const PROGRESS_BAR_WIDTH = 100;

function LinearProgressBar({ min, max, progress }) {
  // il massimo tra 0 e il valore minimo tra il progresso attuale e il prop massimo - il prop minimo
  const clampedProgress = Math.max(0, Math.min(progress, max) - min);
  const filledWidth = clampedProgress * PROGRESS_BAR_WIDTH;

  return (
    <View style={[styles.trackContainer, { width: PROGRESS_BAR_WIDTH }]}>
      {/* Transparent track with border */}
      <View style={styles.track} />
      {/* Gradient fill (only visible between min and max) */}
      {progress > min && (
        <LinearGradient
          colors={['#4A90E2', '#FF9500']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[
            styles.fill,
            {
              width: filledWidth,
              left: `${min * 100}%`, // Start from offset
            },
          ]}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  trackContainer: {
    height: 10, // Adjust for border visibility
    justifyContent: 'center',
    position: 'relative',
  },
  track: {
    height: 6, // Inner height (smaller than container for border)
    width: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 3,
  },
  fill: {
    position: 'absolute',
    height: 6, // Match track's inner height
    borderRadius: 3,
  },
});

export default LinearProgressBar;