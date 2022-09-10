import { useEffect, useState } from "react";
import config from "../config";
import './PersonApiCfg.css';

let personCountTimer = null;
let minBdayTimer = null;

const PersonApiCfg = (props) => {
    const [personCount, setPersonCount] = useState(config.personApi.initialPersonCount);
    const [minBday, setMinBday] = useState(null);
    const personCountHandler = (ev) => {
        setPersonCount(ev.target.value);
        if (personCountTimer) {
            console.log('Clearing timer %s.', personCountTimer);
            clearTimeout(personCountTimer);
        }
        personCountTimer = setTimeout(() => {
            console.log('Value: %i', ev.target.value);
            props.onPersonCountChanged(ev.target.value);
            console.log('Done.');
            personCountTimer = null;
        }, config.appSettings.inputDelay);
    };
    const minBdayHandler = (ev) => {
        if (minBdayTimer) {
            clearTimeout(minBdayTimer);
        }
        minBdayTimer = setTimeout(() => {
            setMinBday(ev.target.value);
            props.onMinBdayChanged(ev.target.value);
            minBdayTimer = null;
        }, config.appSettings.inputDelay);
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
