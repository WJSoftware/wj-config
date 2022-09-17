import React, { useState, useEffect, Suspense, Fragment } from "react";
import config from '../config';
import countryService from "../services/country-service";
import { suspenderWrapper } from '../utils';
import ExhaustedFreeData from "./ExhaustedFreeData";
import './PersonsTable.css';

const fetchPersons = async (personCount, minBday) => {
    let additionalSpecifiers = undefined;
    if (minBday) {
        minBday = minBday.substring(5, 7) + '/' + minBday.substring(8, 10) + '/' + minBday.substring(0, 4);
        additionalSpecifiers = {
            min_bday: minBday
        };
        console.log('Received min bday: %s', minBday);
        console.log('Refactored min bday: %s', minBday);
    }
    const personsUrl = config.api.mockaroo.person.all({ numRecords: personCount }, additionalSpecifiers);
    console.log('Persons URL: %s', personsUrl);
    const response = await fetch(personsUrl, {
        headers: {
            'x-api-key': config.api.options.mockaroo.key
        }
    });
    let data = await response.json();
    return Array.isArray(data) ? data : [data];
};

const fetchCountries = (persons) => {
    const countryCodes = [];
    persons.forEach(p => {
        if (!countryCodes.includes(p.country_code)) {
            countryCodes.push(p.country_code);
        }
    });
    return countryService(countryCodes);
}

let startingResolver = null;
let startingPromise = new Promise(rslv => {
    startingResolver = rslv;
});
let readPersons = suspenderWrapper(startingPromise);
let readCountries = null;

const CountryInfo = props => {
    const countries = readCountries();
    return <Fragment>
        <img className="flag" src={config.api.flags.flag(() => props.countryCode)} title={countries[props.countryCode]} alt={countries[props.countryCode]} />
        &nbsp;
        {countries[props.countryCode]} ({props.countryCode})
    </Fragment>
};

const CorePersonsTable = props => {
    const persons = readPersons();
    if (!persons) {
        return <span>No persons</span>
    }
    // See if the Mockaroo free key is exhausted.
    if (persons.length === 1) {
        const firstElem = persons[0];
        if (firstElem.error && firstElem.error.startsWith('Free accounts are limited to 200 requests per day')) {
            return <ExhaustedFreeData />
        }
    }
    if (!readCountries) {
        const countriesPromise = fetchCountries(persons);
        readCountries = suspenderWrapper(
            countriesPromise
                .then(ctries => {
                    return new Promise(rslv => {
                        setTimeout(() => {
                            rslv(ctries);
                        }, config.appSettings.dramaticPause);
                    })
                })
        );
    }
    return <table className="persons">
        <thead>
            <tr>
                <th>ID</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Email</th>
                <th>Birth Date</th>
                <th>Country</th>
            </tr>
        </thead>
        <tbody>
            {persons.map(p => <tr key={p.id}>
                <td>{p.id}</td>
                <td>{p.first_name}</td>
                <td>{p.last_name}</td>
                <td>{p.email}</td>
                <td>{p.birth_date}</td>
                <td>
                    <Suspense fallback={<span className="loader loader-inline">Loading countries...</span>}>
                        <CountryInfo countryCode={p.country_code} />
                    </Suspense>
                </td>
            </tr>)}
        </tbody>
    </table>
}

const PersonsTable = ({ personCount, minBday }) => {
    const [updateCount, setUpdateCount] = useState(0);
    useEffect(() => {
        console.log('Running useEffect in PersonsTable.');
        let personsPromise = fetchPersons(personCount, minBday);
        if (startingPromise) {
            personsPromise = personsPromise.then(persons => {
                startingResolver(persons);
            });
            startingPromise = null;
        }
        readPersons = suspenderWrapper(
            personsPromise
                .then(ctries => {
                    return new Promise(rslv => {
                        setTimeout(() => {
                            rslv(ctries);
                        }, config.appSettings.dramaticPause);
                    })
                })
        );
        readCountries = null;
        setUpdateCount(updateCount + 1);
    }, [personCount, minBday]);
    return <Suspense fallback={<span className="loader loader-large">Loading persons...</span>}>
        <CorePersonsTable />
    </Suspense>
}

export default PersonsTable;
