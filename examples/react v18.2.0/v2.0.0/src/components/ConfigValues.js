import React from "react";
import config from "../config.js";
import './ConfigValues.css';
import envTraits from "../env-traits.js";
import Banner from "./Banner.js";
import bannerTypes from "./banner-types.js";

function ConfigValues() {
    return <React.Fragment>
        <h2>Peeking Inside the Configuration Object</h2>
        <p>The following are some configuration values picked up from the <strong>wj-config</strong>-built
            configuration object.  They are the result of merging the various configuration sources in the order they
            were specified.</p>
        <table className="data config">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Value</th>
                    <th>Source</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>appSettings.title</td>
                    <td>{config.appSettings.title}</td>
                    <td>{config._trace.appSettings.title.name}, index {config._trace.appSettings.title.index}</td>
                </tr>
                <tr>
                    <td>appSettings.dramaticPause</td>
                    <td>{config.appSettings.dramaticPause}</td>
                    <td>{config._trace.appSettings.dramaticPause.name}, index {config._trace.appSettings.dramaticPause.index}</td>
                </tr>
                <tr>
                    <td>personApi.initialPersonCount</td>
                    <td>{config.personApi.initialPersonCount}</td>
                    <td>{config._trace.personApi.initialPersonCount.name}, index {config._trace.personApi.initialPersonCount.index}</td>
                </tr>
                <tr>
                    <td>personApi.personCountStep</td>
                    <td>{config.personApi.personCountStep}</td>
                    <td>{config._trace.personApi.personCountStep.name}, index {config._trace.personApi.personCountStep.index}</td>
                </tr>
                <tr>
                    <td>personApi.maxPersonCount</td>
                    <td>{config.personApi.maxPersonCount}</td>
                    <td>{config._trace.personApi.maxPersonCount.name}, index {config._trace.personApi.maxPersonCount.index}</td>
                </tr>
                <tr>
                    <td>logging.minLevel</td>
                    <td>{config.logging.minLevel}</td>
                    <td>{config._trace.logging.minLevel.name}, index {config._trace.logging.minLevel.index}</td>
                </tr>
                <tr>
                    <td>ldap.username</td>
                    <td>{config.ldap.username}</td>
                    <td>{config._trace.ldap.username.name}, index {config._trace.ldap.username.index}</td>
                </tr>
                <tr>
                    <td>ldap.password</td>
                    <td>{config.ldap.password}</td>
                    <td>{config._trace.ldap.password.name}, index {config._trace.ldap.password.index}</td>
                </tr>
                <tr>
                    <td>api.gateway.host</td>
                    <td>{config.api.gateway.host}</td>
                    <td>{config._trace.api.gateway.host.name}, index {config._trace.api.gateway.host.index}</td>
                </tr>
            </tbody>
        </table>
        <Banner type={bannerTypes.Collab}>
            <p>If you would like to collaborate, clone <strong>wj-config</strong>'s&nbsp;
                <a href="https://github.com/WJSoftware/wj-config">GitHub repository</a> and make the above table
                list all of the configuration's properties by recursively traversing the entire object.  Ideally, the
                table will have rows for the first level properties and have a twistie to expand to show the next level
                of properties, and so on.</p>
        </Banner>
        <p>The <strong>Source</strong> column comes from the ability of the configuration package to trace which data
            source last set a given configuration value.  <i>Tracing</i> is a great tool to easily debug configuration or
            understand the mechanics provided by <strong>wj-config</strong>.  The <strong>Index</strong> part of the
            source shows the index of the data source.  It is zero-based, so the first configuration source added to
            the builder is index 0.</p>
        <h3>Qualified Data Sources</h3>
        <p><i>Tracing</i> also includes the <strong>_qualifiedDs</strong> property in the root of the configuration
            object.  This is an array of all data sources that actually qualified for inclusion.  If you haven't read
            this in the package's documentation, data sources can be conditioned by using a predicate function.  The
            final list of data sources depend on the result of the evaluation of said predicate.</p>
        <table className="data config">
            <thead>
                <tr>
                    <th>Qualified Data Source</th>
                    <th>Index</th>
                </tr>
            </thead>
            <tbody>
                {config._qualifiedDs.map(ds => {
                    return <tr key={ds.index}>
                        <td>{ds.name}</td>
                        <td>{ds.index}</td>
                    </tr>
                })}
            </tbody>
        </table>
        <p>Only the above <strong>{config._qualifiedDs?.length ?? 0}</strong> data source(s) qualified, so only those
            were used to build the configuration object.</p>
        <Banner type={bannerTypes.Tip} inline={true}>
            Qualified data sources are only present when data tracing is enabled.
        </Banner>
        <hr />
        <p>Play around by changing the current environment name in the <strong>public/env.js</strong> file.  The
            possible values are: <strong>{config.environment.all.reduce((p, c) => {
                return p + ', ' + c;
            })}</strong>.  These values are themselves defined in <strong>src/config.js</strong>.  Feel free to
            play with those by creating new possible environments or deleting existing ones.</p>
        <p>You can also find the current environment's assigned traits in <strong>public/env.js</strong>.  It is a
            value calculated from the traits definition found in <strong>src/env-traits.js</strong>.  You may also
            play around with these by adding new traits and creating data sources conditioned to these new traits.</p>
        <table className="data config">
            <thead>
                <tr>
                    <th colSpan={2}>Current Environment</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Name</td>
                    <td>{config.environment.current.name}</td>
                </tr>
                <tr>
                    <td>Traits</td>
                    <td>{envTraits.toString(config.environment.current.traits)} (value: {config.environment.current.traits})</td>
                </tr>
            </tbody>
        </table>
    </React.Fragment>
}

export default ConfigValues;
