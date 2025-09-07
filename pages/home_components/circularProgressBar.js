import { View, Text } from "react-native"
import { FontAwesomeIcon } from "../../icons/icons.js"
import Svg, { Path, Defs, LinearGradient, Stop, Circle } from "react-native-svg"

// Componente che disegna un indicatore circolare con gradiente e pallino di avanzamento opzionale
function CircularProgress({ label, value, maxValue, progressDot, fullGradient, propColor, centralIcon }) {
    // Dimensioni e parametri di base del cerchio
    const size = 75; // dimensione totale SVG (larghezza/altezza)
    const strokeWidth = 6; // spessore della linea
    const radius = (size - strokeWidth) / 2; // raggio effettivo dell'arco
    const startAngle = -Math.PI * (5 / 4); // angolo di inizio (in radianti)
    const endAngle = Math.PI * (1 / 4); // angolo di fine (in radianti)
    const angleRange = endAngle - startAngle; // ampiezza totale dell'arco

    // Percentuale di avanzamento (limitata a 1 = 100%)
    const percentage = Math.min(value / maxValue, 1);

    // Gap attorno al pallino (in radianti) se attivato
    const gapAngle = (progressDot) ? 0.8 : 0; // più alto = più spazio vuoto
    const progressAngle = startAngle + percentage * angleRange; // angolo attuale di avanzamento

    // Calcolo della fine dell'arco (prima del pallino, per lasciare il gap)
    const arcEndBeforeDot = progressAngle - gapAngle;
    // const arcEndAfterDot = (progressDot) ? progressAngle + gapAngle : endAngle;
    const progressPath = describeArc(size / 2, size / 2, radius, startAngle, arcEndBeforeDot); // percorso SVG dell'arco progressivo

    // if (progressDot) {
    // Coordinate del pallino sull'arco
    const cx = size / 2 + radius * Math.cos(progressAngle);
    const cy = size / 2 + radius * Math.sin(progressAngle);
    const iconSize = radius / 1.5; // dimensione dell'icona centrale
    // Percorso SVG dell'arco di sfondo (completo)
    const arcPath = describeArc(size / 2, size / 2, radius, startAngle, endAngle);

    return (
        <View style={{ display: 'grid', gridTemplateColums: '1fr', gridTemplateRows: 'repeat(2, 50%)', gap: 5, aspectRatio: '1 / 1', backgroundColor: "rgba(0, 0, 0, 0.2)", borderRadius: 16, padding: 5 }}>
            <View style={{ paddingLeft: 15, gridArea: '1 1 2 2', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center' }}>
                <Text style={{ margin: 5, fontFamily: 'MiSans-regular', fontSize: 16, color: 'rgba(255, 255, 255, 0.6)' }}>
                    {label || 'Loading...'}
                </Text>
                <Text style={{ margin: 5, fontFamily: 'MiSans-regular', fontSize: 24, color: 'white' }}>
                    {value}
                </Text>
            </View>
            <View style={{ gridArea: '2 1 3 2', width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}>
                <Svg width={size} height={size}>
                    {/* Definizione gradiente lineare per l'arco */}
                    <Defs>
                        <LinearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
                            <Stop offset={`${18}%`} stopColor="rgb(64, 224, 125)" />
                            <Stop offset={`${18 + 8}%`} stopColor="rgb(207, 255, 79)" />
                            <Stop offset={`${18 + 8 + 28}%`} stopColor="rgb(255, 176, 59)" />
                            <Stop offset={`${18 + 8 + 28 + 25}%`} stopColor="rgb(255, 100, 68)" />
                            <Stop offset={`${18 + 8 + 28 + 25 + 5}%`} stopColor="rgb(255, 130, 215)" />
                            <Stop offset="100%" stopColor="rgb(213, 102, 255)" />
                        </LinearGradient>
                    </Defs>

                    {/* Arco di base */}

                    <Path
                        d={arcPath}
                        stroke={(fullGradient) ? 'url(#grad)' : "rgba(0, 0, 0, 0.15)"}
                        strokeWidth={strokeWidth}
                        fill="none"
                        strokeLinecap="round"
                    />

                    {/* Arco per il progresso (con gap se pallino attivo) */}
                    {
                        (fullGradient) ? null :
                            <Path
                                d={progressPath}
                                stroke={propColor}
                                strokeWidth={strokeWidth}
                                fill="none"
                                strokeLinecap="round"
                            />
                    }

                    {/* Pallino colorato sul punto di avanzamento */}
                    {(progressDot) ? <Circle cx={cx} cy={cy} r={strokeWidth / 1.5} fill={'white'} /> : null}
                </Svg>
                {/* Icona centrata */}
                {(centralIcon !== null) &&
                    // <View style={{ position: 'absolute', left: size / 2 - iconSize / 2, top: size / 2 - iconSize / 2, }}>
                    <FontAwesomeIcon
                        style={{ position: 'absolute', right: radius - iconSize / 2 + strokeWidth / 2 }}
                        icon={centralIcon} size={iconSize} color={propColor} />
                    // </View>
                }
            </View>
        </View>
    );
}

// Funzione per creare un arco SVG usando coordinate polari
function describeArc(x, y, radius, startAngle, endAngle) {
    const start = polarToCartesian(x, y, radius, endAngle); // punto iniziale
    const end = polarToCartesian(x, y, radius, startAngle); // punto finale
    const largeArcFlag = endAngle - startAngle <= Math.PI ? "0" : "1"; // flag per arco maggiore o minore di 180°

    return [
        "M", start.x, start.y,
        "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y
    ].join(" ");
}

// Converte coordinate polari in coordinate cartesiane (x, y)
function polarToCartesian(centerX, centerY, radius, angleInRadians) {
    return {
        x: centerX + radius * Math.cos(angleInRadians),
        y: centerY + radius * Math.sin(angleInRadians)
    };
}

export default CircularProgress;