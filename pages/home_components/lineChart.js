import { useSelector } from 'react-redux';
import { Text as SvgText } from "react-native-svg";
import { Svg, Path, Circle, Line } from "react-native-svg";
import { View, Text, ActivityIndicator, ScrollView, Image } from 'react-native';

export default function LineChart() {
    const { today } = useSelector((state) => state.weather);

    if (!today || today.length === 0) {
        return (
            <ActivityIndicator size={'small'}>
                <Text style={{
                    textAlign: 'center',
                    color: 'rgba(255, 255, 255, 0.6)',
                    fontSize: 16
                }}>
                    Loading...
                </Text>
            </ActivityIndicator>
        );
    }

    const viewHeight = 170;                                         // Altezza totale della View
    const padding = 10;                                             // Padding intorno al grafico                                  
    const topMargin = 28;                                           // spazio extra sopra la linea
    const graphHeight = viewHeight - padding * 2;                   // Altezza totale del grafico
    const graphWidth = 1400;                                        // Larghezza totale del grafico
    const labelSize = 14;                                           // Dimensione del font delle etichette temp
    const iconSize = 36;                                            // Dimensione delle icone meteo
    const iconBoxSize = (graphWidth - 2 * padding) / today.length;  // Larghezza del box per ogni icona
    console.log((graphWidth - iconBoxSize * 24) / 24)

    // Example: create a simple line path using temperature as y and index as x
    const minTemp = Math.min(...today.map(item => item.temperature_2m));
    const maxTemp = Math.max(...today.map(item => item.temperature_2m));

    // Funzione per generare una curva Catmull-Rom (convertita in cubic Bezier)
    function getSmoothPath(points) {
        if (points.length < 2) return '';
        let d = `M${points[0].x},${points[0].y}`;
        for (let i = 0; i < points.length - 1; i++) {
            const p0 = points[i - 1] || points[i];
            const p1 = points[i];
            const p2 = points[i + 1];
            const p3 = points[i + 2] || p2;
            // Catmull-Rom to Bezier conversion
            const cp1x = p1.x + (p2.x - p0.x) / 6;
            const cp1y = p1.y + (p2.y - p0.y) / 6;
            const cp2x = p2.x - (p3.x - p1.x) / 6;
            const cp2y = p2.y - (p3.y - p1.y) / 6;
            d += ` C${cp1x},${cp1y} ${cp2x},${cp2y} ${p2.x},${p2.y}`;
        }
        return d;
    }

    // Preparo i punti
    const points = today.map((item, idx) => {
        const x = (iconBoxSize / 2) + ((graphWidth - iconBoxSize) / 23 * idx);
        // const x = (iconBoxSize / 2) + (iconBoxSize * idx) + ((graphWidth - iconBoxSize * 24) / 24);
        const y = topMargin + (graphHeight - topMargin - padding) * (1 - (item.temperature_2m - minTemp) / (maxTemp - minTemp || 1));
        return { x, y };
    });
    const path = getSmoothPath(points);

    return (
        <ScrollView horizontal={true}
            style={{
                backgroundColor: 'rgba(0, 0, 0, 0.15)',
                height: viewHeight + 90,
                marginTop: 10,
                padding: 0,
                borderRadius: 16,
            }}>
            <View style={{ padding: padding }}>
                <Svg width={graphWidth} height={graphHeight}>
                    {/* Serie di Dati (Temperature_2m) */}
                    <Path
                        d={path}
                        stroke='#ffd600'
                        fillOpacity={0}
                        strokeWidth={3}
                        strokeLinecap={'round'}
                    />
                    {/* Temperature labels above each point */}
                    {today.map((item, idx) => {
                        const x = padding + idx * (graphWidth - 2 * padding) / (today.length - 1)
                        // const x = padding + idx * ((graphWidth - 2 * padding) / (today.length - 1)) + labelSize / 2;
                        const y = topMargin + (graphHeight - topMargin - padding) * (1 - (item.temperature_2m - minTemp) / (maxTemp - minTemp || 1));
                        return (
                            <SvgText
                                key={idx}
                                x={points[idx].x}
                                y={y - 12}
                                textAnchor='middle'
                                fontSize={labelSize}
                                fontWeight={'200'}
                                fill='white'
                                stroke='white'
                                fontFamily='MiSans-Regular'
                                strokeWidth={0.1}
                                strokeDasharray={[1, 2]}
                                strokeDashoffset={0.5}
                            >{Math.round(item.temperature_2m)}°</SvgText>
                        );
                    })}
                    {/* Cerchi sui punti dati */}
                    {points.map((point, idx) => {
                        return (
                            <>
                                <Circle
                                    key={idx}
                                    cx={point.x}
                                    cy={point.y}
                                    r={3}
                                    fill='white'>
                                </Circle>
                                <Line
                                    key={idx + 24}
                                    x1={point.x}
                                    y1={point.y}
                                    x2={point.x}
                                    y2={point.y + 300}
                                    stroke='rgba(255, 255, 255, 0.8)'
                                    strokeWidth={1}>

                                </Line>
                            </>
                        )
                    })}
                </Svg>
                {/* Icone meteo e orari sotto il grafico */}
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'flex-end',
                    marginTop: 8,
                    borderColor: 'black'
                }}>
                    {today.map((item, idx) => {
                        const hour = `${idx.toString().padStart(2, '0')}:00`;
                        return (
                            <View key={idx} style={{
                                width: iconBoxSize,
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}>
                                <Image
                                    source={{ uri: `https://gabryc0de.github.io/weather-icons/wmo_${item.weather_code}.png` }}
                                    style={{ width: iconSize, aspectRatio: '1/1', marginBottom: 2 }}
                                    resizeMode='contain'
                                />
                                <Text style={{ color: '#fff', fontFamily: 'MiSans-Regular', fontSize: 13, opacity: 0.7, marginBottom: 2 }}>{item.wind_speed_10m ? `${item.wind_speed_10m}km/h` : ''}</Text>
                                <Text style={{ color: '#fff', fontFamily: 'MiSans-Regular', fontSize: 13, opacity: 0.7 }}>{hour}</Text>
                            </View>
                        );
                    })}
                </View>
            </View>
        </ScrollView>
    );
}