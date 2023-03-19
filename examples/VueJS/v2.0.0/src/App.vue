<script setup lang="ts">
import ConsoleLogsDemo from './components/ConsoleLogsDemo.vue';
import InsideConfig from './components/InsideConfig.vue';
import QueryData from './components/QueryData.vue';
import config from './config';
import loggerFactory from './logger-factory';

const logger = loggerFactory('App');
logger.verbose('This is a log entry in the verbose level.  It should only appear with configurations with the Verbose trait assigned.');
logger.info('This is an informational log entry.');
logger.warn('This is a warning log entry.');
</script>

<template>
    <header>
        <a href="https://vitejs.dev" target="_blank">
            <img src="/vite.svg" class="logo" alt="Vite logo" />
        </a>
        <a href="https://vuejs.org/" target="_blank">
            <img src="./assets/vue.svg" class="logo vue" alt="Vue logo" />
        </a>
        <h1>{{ config.appSettings.title }}</h1>
    </header>
    <main>
        <ConsoleLogsDemo />
        <InsideConfig />
        <QueryData />
    </main>
</template>

<style scoped>
.logo {
    height: 6em;
    padding: 1.5em;
    will-change: filter;
}

.logo:hover {
    filter: drop-shadow(0 0 2em #cfd0e4aa);
}

.logo.vue:hover {
    filter: drop-shadow(0 0 2em #91c4adaa);
}

header {
    background-color: var(--masterBgColor);
    color: var(--masterColor);
    padding: 2rem;
}

article {
    box-shadow: 0.5em 0.5em 0.2em rgba(0, 0, 0, 0.1);
    border-radius: 1em;
    border: 0.2em solid var(--masterBgColor);
    margin-bottom: 1em;
    padding: 2em;
    text-align: justify;
}
</style>
