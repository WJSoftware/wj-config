<template>
    <article>
        <h2>Check Out the Console Logs</h2>
        <p>This example uses the <strong>serilogger</strong> NPM package. It produces structured log entries and, among
            its many features, it can be told the level of severity a message has to be in order to appear in the console.
        </p>
        <p>This is a typical setting that varies per environment. Usually, environments "below" pre-production will log all
            messages, including debugging messages, while pre-production and "above" will only show messages with a severity
            level of <em>Information</em> or "above".</p>
        <p>Play around with the configuration traits in this example. You can enable verbose logging by simply adding the
            "Verbose" environment trait in <strong>public/env.js</strong>.</p>
        <p>The App component has 3 logging lines:</p>
        <ul>
            <li><code>logger.verbose('This is a log entry in the verbose level. It ...');</code></li>
            <li><code>logger.info('This is an informational log entry.');</code></li>
            <li><code>logger.warn('This is a warning log entry.');</code></li>
        </ul>
        <p>Go open the browser's console and see which ones you got.</p>
    </article>
</template>