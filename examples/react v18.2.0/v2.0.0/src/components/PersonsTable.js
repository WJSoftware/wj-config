import React, { useState, useEffect } from "react";
import config from '../config';
import './PersonsTable.css';
import countryService from "../services/country-service";

const PersonsTable = props => {
    const [persons, setPersons] = useState([]);
    const [countries, setCountries] = useState({});
    useEffect(() => {
        const fetchPersons = async () => {
            const response = await fetch(config.ws.mockaroo.person.all(), {
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
    }, []);

    return <table className="persons">
        <thead>
            <tr>
                <th>ID</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Email</th>
                <th>Country</th>
            </tr>
        </thead>
        <tbody>
            {persons.map(p => <tr key={p.id}>
                <td>{p.id}</td>
                <td>{p.first_name}</td>
                <td>{p.last_name}</td>
                <td>{p.email}</td>
                <td><img className="flag" src={config.ws.flags.flag(() => p.country_code)} title={countries[p.country_code]} alt={countries[p.country_code]} />&nbsp;{countries[p.country_code]} ({p.country_code})</td>
            </tr>)}
        </tbody>
    </table>
}

export default PersonsTable;
