<script setup lang="ts">
import config from '../config';
import countryService from '../services/country-service';
import sleep from '../utils/sleep';
import LoadingSpinner from './LoadingSpinner.vue';
import { usePeopleStore } from '../stores/PeopleStore';
import { ref, watch } from 'vue';
import { useFetch } from "@vueuse/core";

const peopleStore = usePeopleStore();
const url = ref(peopleStore.peopleUrl);
const { isFetching, data, error } = useFetch(url, {
    headers: {
        "x-api-key": (config as any).api.options.mockaroo.key
    }
}, {
    refetch: true
}).json();
watch(data, () => {
    peopleStore.people = data.value as (any[] | null);
    peopleStore.fetchInProgress = false;
    if (peopleStore.people && peopleStore.people.length) {
        fetchCountries();
    }
}, {
    flush: 'post'
});
watch([() => peopleStore.peopleCount, () => peopleStore.minBday], () => {
    console.debug('New URL: %s', peopleStore.peopleUrl);
    peopleStore.fetchInProgress = true;
    url.value = peopleStore.peopleUrl;
    peopleStore.countries = null;
});

function flagsUrl(...args: any[]) {
    const p = config.api.flags;
    return p.flag.call(p, ...arguments);
}

async function fetchCountries() {
    console.group('fetchCountries');
    const countryCodes: any[] = [];
    peopleStore.people?.forEach(p => {
        if (!countryCodes.includes(p.country_code)) {
            countryCodes.push(p.country_code);
        }
    });
    await sleep((config as any).appSettings.dramaticPause);
    peopleStore.countries = await countryService(countryCodes);
    console.debug('fetchCountries finished.');
    console.groupEnd();
}

async function fetchPeople() {
    console.group('fetchPeople');
    const peopleUrl = config.api.mockaroo.person.all({ numRecords: peopleStore.peopleCount });
    console.debug("People URL: %s", peopleUrl);
    const response = await fetch(peopleUrl, {
        headers: {
            "x-api-key": (config as any).api.options.mockaroo.key
        }
    });
    const data = await response.json();
    await sleep((config as any).appSettings.dramaticPause);
    peopleStore.people = Array.isArray(data) ? data : [data];
    console.debug('fetchPeople finished.');
    console.groupEnd();
}
</script>

<template>
    <div class="people">
        <pre v-if="error">
                    {{ error }}
                </pre>
        <LoadingSpinner text="Loading people..." :block="true" v-if="isFetching" />
        <table v-else class="data people">
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
                <tr v-for="p in peopleStore.people">
                    <td>{{ p.id }}</td>
                    <td>{{ p.first_name }}</td>
                    <td>{{ p.last_name }}</td>
                    <td>{{ p.email }}</td>
                    <td>{{ p.birth_date }}</td>
                    <td>
                        <img :src="flagsUrl(() => config.flagsApi.lowerCaseCodes ? p.country_code.toLowerCase() : p.country_code)"
                            :alt="p.country_code" :crossorigin="config.flagsApi.anonymousCrossOrigin ? 'anonymous' : ''"
                            class="flag" />&nbsp;
                        <span v-if="peopleStore.countries">{{ peopleStore.countries[p.country_code] }} ({{ p.country_code
                        }})</span>
                        <LoadingSpinner v-else text="Loading countries..." :block="false" />
                    </td>
                </tr>
            </tbody>
        </table>
        <div class="flags-info">
            Flags courtesy of <a :href="config.flagsApi.backLink" target="_blank">{{ config.flagsApi.name }}</a>
        </div>
    </div>
</template>

<style scoped>
img.flag {
    max-height: 1em;
}

div.people {
    margin-top: 2em;
    text-align: center;
}

div.people>table {
    margin-left: auto;
    margin-right: auto;
}

div.people>table>tbody>tr>td {
    text-align: left;
}

div.people>table>tbody>tr>td:first-child {
    text-align: center;
    background-color: var(--masterBgColor);
    color: var(--masterColor);
    font-weight: bold;
    border-radius: 7px;
    padding-left: 5px;
    padding-right: 5px;
}

div.people>table>tbody>tr>td:last-child {
    background-color: rgb(227, 227, 227);
}

div.people>table img.flag {
    width: 2em;
}

span.loader {
    display: inline-block;
    margin-left: auto;
    margin-right: auto;
    background-color: var(--masterBgColor);
    color: var(--masterColor);
    font-weight: bold;
    padding: 2px 12px;
    border-radius: 7px;
}

span.loader-inline {
    font-size: smaller;
}

span.loader-large {
    margin: 2em 2em;
    color: yellow;
    font-size: x-large;
    padding: 1em 2em;
}

div.flags-info {
    margin-top: 1em;
    font-size: smaller;
    font-weight: bold;
    text-align: right;
}
</style>