import React, { useState, useEffect } from "react";
import config from '../config';
import './PersonsTable.css';
import countryService from "../services/country-service";

const PersonsTable = props => {
    const [persons, setPersons] = useState([]);
    const [countries, setCountries] = useState({});
    useEffect(() => {
        const fetchPersons = async () => {
            let additionalSpecifiers = undefined;
            if (props.minBday) {
                const minBday = props.minBday.substring(5, 7) + '/' + props.minBday.substring(8, 10) + '/' + props.minBday.substring(0, 4);
                additionalSpecifiers = {
                    min_bday: minBday
                };
                console.log('Received min bday: %s', props.minBday);
                console.log('Refactored min bday: %s', minBday);
            }
            const personsUrl = config.ws.mockaroo.person.all({ numRecords: props.personCount }, additionalSpecifiers);
            console.log('Persons URL: %s', personsUrl);
            const response = await fetch(personsUrl, {
                headers: {
                    'x-api-key': config.ws.options.mockaroo.key
                }
            });
            const data = await response.json();
            setPersons(data);
            // Obtain a unique list of country codes.
            const countryCodes = [];
            data.forEach(p => {
                if (!countryCodes.includes(p.country_code)) {
                    countryCodes.push(p.country_code);
                }
            });
            setCountries(await countryService(countryCodes));
        };
        fetchPersons().catch(console.error);
    }, [props.personCount, props.minBday]);

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
                <td><img className="flag" src={config.ws.flags.flag(() => p.country_code)} title={countries[p.country_code]} alt={countries[p.country_code]} />&nbsp;{countries[p.country_code]} ({p.country_code})</td>
            </tr>)}
        </tbody>
    </table>
}

export default PersonsTable;
