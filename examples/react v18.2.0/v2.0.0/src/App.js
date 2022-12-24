import logo from './logo.svg';
import './App.css';
import config from './config';
import PersonsTable from './components/PersonsTable';
import PersonApiCfg from './components/PersonApiCfg';
import { useState } from 'react';
import ConfigValues from './components/ConfigValues';
import envTraits from './env-traits';
import logger from './logger';
import Logging from './components/Logging';

function App() {
    const [personCount, setPersonCount] = useState(config.personApi.initialPersonCount);
    const [minBday, setMinBday] = useState(null);

    const personCountChangedHandler = newCount => setPersonCount(newCount);
    const minBdayChangedHandler = newMinBday => setMinBday(newMinBday);

    logger.verbose('This is a log entry in the verbose level.  It should only appear with configurations with the Verbose trait assigned.');
    logger.info('This is an informational log entry.');
    logger.warn('This is a warning log entry.');

    return (
        <div className="App">
            <header className="App-header">
                <img src={logo} className="App-logo" alt="logo" />
                <h1>{config.appSettings.title}</h1>
                {config.environment.hasAnyTrait(envTraits.Production) || <h5>{config.environment.current.name} environment</h5>}
                <a
                    className="App-link"
                    href={config.appSettings.projectHome}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    {config.appSettings.projectName}
                </a>
            </header>
            <main>
                <section>
                    <Logging />
                </section>
                <section>
                    <ConfigValues />
                </section>
                <section>
                    <h2>Querying Data</h2>
                    <p>Below is a list of (ficticious) people from around the world.  It is fetched data.  The URL's
                        needed to fetch are defined inside the <strong>api</strong> section of the configuration
                        object.  The configuration section <strong>personApi</strong> limits the values that are
                        possible from the controls below.  Premium customers may query up to 1000 people; basic
                        customers may query up to 100 people.
                    </p>
                    <PersonApiCfg onPersonCountChanged={personCountChangedHandler} onMinBdayChanged={minBdayChangedHandler} />
                    <PersonsTable personCount={personCount} minBday={minBday} />
                </section>
            </main>
        </div>
    );
}

export default App;
