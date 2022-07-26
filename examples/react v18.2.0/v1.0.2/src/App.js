import logo from './logo.svg';
import './App.css';
import config from './config';
import PersonsTable from './components/PersonsTable';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1>{config.appSettings.title}</h1>
        {config.environment.isProduction() || <h5>{config.environment.value} environment</h5>}
        {config.gateway.host}
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
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
        <PersonsTable />
      </main>
    </div>
  );
}

export default App;
