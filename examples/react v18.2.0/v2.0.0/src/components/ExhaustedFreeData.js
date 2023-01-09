import config from "../config"
import './ExhaustedFreeData.css';

const ExhaustedFreeData = () => {
    return <div className="no-free-data">
        <p>No more free data for today.  Try again tomorrow.</p>
        <p><a href={config.appSettings.mockarooUrl} target="_blank">{config.appSettings.mockarooText}</a></p>
    </div>
};

export default ExhaustedFreeData;
