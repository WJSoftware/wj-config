import { useState } from "react";
import config from "../config";
import './PersonApiCfg.css';
import PillSelector from "./PillSelector";

let personCountTimer = null;
let minBdayTimer = null;

const PersonApiCfg = (props) => {
    const [personCount, setPersonCount] = useState(config.personApi.initialPersonCount);
    const [minBday, setMinBday] = useState(null);
    const personCountHandler = (ev) => {
        setPersonCount(ev.target.value);
        if (personCountTimer) {
            clearTimeout(personCountTimer);
        }
        personCountTimer = setTimeout(() => {
            props.onPersonCountChanged(ev.target.value);
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
    const items = [
        {
            id: 1,
            value: 100,
            name: '100'
        },
        {
            id: 2,
            value: 200,
            name: '200'
        },
        {
            id: 3,
            value: 300,
            name: '300'
        },
        {
            id: 4,
            value: 400,
            name: '400'
        },
        {
            id: 5,
            value: 500,
            name: '500'
        }
    ];
    const onPillSelectionChange = item => {
        console.log('onPillSelectionChange.  Item: %o', item);
        setPersonCount(item.value);
        props.onPersonCountChanged(item.value);
    };
    return <div className="control">
        <PillSelector title="Person Count" items={items} selectedIndex={0} onSelectionChange={onPillSelectionChange}>
            <label>Other: <input
                type="number"
                min="10"
                max={config.personApi.maxPersonCount}
                value={personCount}
                step={config.personApi.personCountStep}
                onChange={personCountHandler}
                size="3"
            /></label>
        </PillSelector>
        <div className="section">
            <label>
                <h5>Minimum Birth Date</h5>
                <input
                    type="date"
                    min={config.personApi.defaultMinBday}
                    onChange={minBdayHandler}
                />
            </label>
        </div>
    </div>
}

export default PersonApiCfg;
