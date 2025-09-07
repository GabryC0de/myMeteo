import CircularProgress from "./circularProgressBar.js"

//Redux
import { useSelector } from 'react-redux'

function ProgressBarsSection() {
    const { current } = useSelector((state) => state.weather);
    return (
        // UV Rays
        <>
            {/* UV progress bar */}
            <CircularProgress label='UV' value={(current) ? current.uv_index : ''} maxValue={11} progressDot={true} fullGradient={true} propColor={null} centralIcon={null}></CircularProgress>
            {/* Humidity Bar */}
            <CircularProgress label='Umidità' value={(current) ? current.relative_humidity_2m : ''} maxValue={100} progressDot={false} fullGradient={false} propColor='#1c9dff' centralIcon={'droplet'}></CircularProgress>
        </>
    )
};

export default ProgressBarsSection;