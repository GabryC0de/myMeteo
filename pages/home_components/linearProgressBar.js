import { View, StyleSheet, Dimensions } from 'react-native';
import { useSelector } from 'react-redux';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle } from 'react-native-svg';

const PROGRESS_BAR_WIDTH = 70;
const PROGRESS_BAR_HEIGHT = 6;
// const { width: PROGRESS_BAR_WIDTH } = Dimensions.get('window');
function LinearProgressBar({ min, max, weekMinMax, isToday }) {

  const { current } = useSelector((state) => state.weather);
  // temp range
  const availableSpace = Math.round(weekMinMax[1]) - Math.round(weekMinMax[0]);
  // percentuale di range rimepito -> {availableSpace : 100 = (max - min) : availableSpaceFilled}
  const filledPercentage = ((max - min) * 100) / availableSpace;

  return (
    <View style={styles.trackContainer}>
      {/* Transparent track with border */}
      <View style={[styles.track, { width: PROGRESS_BAR_WIDTH }]} />
      {/* Gradient fill (only visible between min and max) */}
      <LinearGradient
        colors={['#c0ebc3', '#e1d087', '#f1b365']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[
          styles.fill,
          {
            left: (min == Math.round(weekMinMax[0])) ? 0 : `${((min - weekMinMax[0]) * 100) / availableSpace}%`, // Start from offset
            width: `${filledPercentage}%`,
          },
        ]}
      />
      {
        (isToday) ?
          <Svg height="100%" width="100%" style={{ position: 'absolute' }}>
            <Circle cx={`${(current.temperature_2m)}%`} cy='50%' r={(PROGRESS_BAR_HEIGHT / 2) + 1} fill={'rgba(255, 255, 255, 0.6)'}></Circle>
          </Svg> : <></>
      }
    </View>
  );
};

const styles = StyleSheet.create({
  trackContainer: {
    height: 10,
    justifyContent: 'center',
    position: 'relative',
  },
  track: {
    height: PROGRESS_BAR_HEIGHT, // Inner height (smaller than container for border)
    width: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 5,
    display: 'flex',
    alignItems: 'center',
  },
  fill: {
    position: 'absolute',
    height: PROGRESS_BAR_HEIGHT, // Match track's inner height
    borderRadius: 5,
  },
});

export default LinearProgressBar;