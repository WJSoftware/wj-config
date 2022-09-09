import { useState } from "react";
import config from "../config";
import './PersonApiCfg.css';

const PersonApiCfg = (props) => {
    const [personCount, setPersonCount] = useState(config.personApi.initialPersonCount);
    const [minBday, setMinBday] = useState(null);
    const personCountHandler = (ev) => {
        setPersonCount(ev.target.value);
        props.onPersonCountChanged(ev.target.value);
    };
    const minBdayHandler = (ev) => {
        setMinBday(ev.target.value);
        props.onMinBdayChanged(ev.target.value);
    }
    return <div className="control">
        <label>Person count: <input
            type="number"
            min="10"
            max={config.personApi.maxPersonCount}
            value={personCount}
            step={config.personApi.personCountStep}
            onChange={personCountHandler}
        /></label>
        &nbsp;
        <label>Minimum birth date: <input
            type="date"
            min={config.personApi.defaultMinBday}
            onChange={minBdayHandler}
        /></label>
    </div>
}

export default PersonApiCfg;
