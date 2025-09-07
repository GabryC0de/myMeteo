import { useSelector } from 'react-redux';
import { LineChart } from "react-native-gifted-charts";
import { Text, ActivityIndicator, ScrollView, View, Image } from 'react-native';

export default function BarsDataset() {
    const { today } = useSelector((state) => state.weather);

    if (!today || today.length === 0) {
        return (
            <ActivityIndicator size={'small'}>
                <Text className="text-center text-white/60 text-lg">
                    Loading...
                </Text>
            </ActivityIndicator>
        );
    }

    const iconSize = 30;

    const tempData = today.map(item => ({
        value: item.temperature_2m,
        label: item.time,
    }));

    const feelsLikeData = today.map(item => ({
        value: item.apparent_temperature,
        label: item.time,
        dataPointLabelComponent: () => (
            <Image
                source={{
                    uri: `https://gabryc0de.github.io/weather-icons/wmo_${item.weather_code}.png`,
                }}
                style={{
                    width: iconSize,
                    height: iconSize,
                }}
                resizeMode="contain"
            />
        ),
    }));

    const allValues = [...tempData.map(i => i.value), ...feelsLikeData.map(i => i.value)];
    const maxVal = Math.max(...allValues);
    const noOfSections = 5;
    const viewHeight = 300;

    return (
        <ScrollView horizontal={true} centerContent={true} style={{ backgroundColor: 'rgba(0, 0, 0, 0.2)', height: `${viewHeight}`, marginTop: 10, padding: 20, borderRadius: 16 }}>

            <LineChart
                showDataPointLabelOnFocus={true}

                dataPointLabelShiftX={-iconSize / 2}
                dataPointLabelShiftY={100}

                yAxisLabelText={'Temperatura'}
                overflowTop={50}
                width={1400}
                height={200}
                initialSpacing={iconSize}
                data={tempData}
                data2={feelsLikeData}
                yAxisTextStyle={{
                    color: 'rgba(255,255,255,0.6)',
                    fontFamily: 'MiSans-regular',
                    fontSize: 15
                }}

                xAxisLabelTextStyle={{
                    color: 'rgba(255,255,255,0.6)',
                    fontFamily: 'MiSans-regular',
                    fontSize: 15
                }}
                hideRules
                color1="#ff7300"
                color2="#387908"
                dataPointsHeight={6}
                dataPointsWidth={6}
                dataPointsColor="#ff7300"
                dataPointsColor2="#387908"
                thickness={3}
                adjustToWidth={true}
                isAnimated={true}

                yAxisColor={'rgba(255, 255, 255, 0.6)'}
                xAxisColor={'rgba(255, 255, 255, 0.6)'}

                maxValue={Math.ceil(maxVal) + 1}
                stepValue={(Math.ceil(maxVal) + 1) / noOfSections}
                noOfSections={noOfSections}

                showVerticalLines={true}
                verticalLinesColor={'rgba(255, 255, 255, 0.15)'}
                verticalLinesWidth={0.5}
                showHorizontalLines={false}
                verticalLinesHeight={200}
            />
        </ScrollView>
    );
}