<script setup lang="ts">
import PeoplePanel from './components/PeoplePanel.vue';
import PeopleTable from './components/PeopleTable.vue';
import config from './config';
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
        <PeoplePanel />
    <PeopleTable />
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
</style>
