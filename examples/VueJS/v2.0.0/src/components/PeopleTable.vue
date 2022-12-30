<script setup lang="ts">
import config from '../config';
import countryService from '../services/country-service';
import sleep from '../utils/sleep';
import LoadingSpinner from './LoadingSpinner.vue';
</script>

<script lang="ts">
export default {
    data() {
        return {
            people: (null as unknown as any[]),
            countries: (null as unknown as any[])
        };
    },
    watch: {
        people() {
            this.fetchCountries();
        }
    },
    created() {
        this.$watch(() => null, () => {
            this.fetchPeople();
        }, {
            immediate: true
        });
    },
    methods: {
        async fetchCountries() {
            console.group('fetchCountries started.');
            const countryCodes: any[] = [];
            this.people.forEach(p => {
                if (!countryCodes.includes(p.country_code)) {
                    countryCodes.push(p.country_code);
                }
            });
            await sleep((config as any).appSettings.dramaticPause);
            this.countries = await countryService(countryCodes);
            console.groupEnd();
            console.debug('fetchCountries finished.');
        },
        async fetchPeople() {
            console.group('fetchPeople started.');
            const peopleUrl = (config as any).api.mockaroo.person.all({ numRecords: 100 });
            console.log("People URL: %s", peopleUrl);
            const response = await fetch(peopleUrl, {
                headers: {
                    "x-api-key": (config as any).api.options.mockaroo.key
                }
            });
            const data = await response.json();
            await sleep((config as any).appSettings.dramaticPause);
            this.people = Array.isArray(data) ? data : [data];
            console.groupEnd();
            console.debug('fetchPeople finished.');
        }
    },
    components: { LoadingSpinner }
}
</script>

<template>
    <table v-if="people" class="data people">
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
            <tr v-for="p in people">
                <td>{{ p.id }}</td>
                <td>{{ p.first_name }}</td>
                <td>{{ p.last_name }}</td>
                <td>{{ p.email }}</td>
                <td>{{ p.birth_date }}</td>
                <td><img :src="(config as any).api.flags.flag({ countryCode: p.country_code })" :alt="p.country_code"
                        crossorigin="anonymous" class="flag" />&nbsp;
                    <span v-if="countries">{{ countries[p.country_code] }} ({{ p.country_code }})</span>
                    <LoadingSpinner v-else text="Loading countries..." :block="false" />
                </td>
            </tr>
        </tbody>
    </table>
    <LoadingSpinner text="Loading people..." :block="true" v-else />
</template>

<style scoped>
img.flag {
    max-height: 1em;
}

table.people {
    margin-top: 2em;
    margin-left: auto;
    margin-right: auto;
}

table.people>tbody>tr>td {
    text-align: left;
}

table.people>tbody>tr>td:first-child {
    text-align: center;
    background-color: var(--masterBgColor);
    color: var(--masterColor);
    font-weight: bold;
    border-radius: 7px;
    padding-left: 5px;
    padding-right: 5px;
}

table.people>tbody>tr>td:last-child {
    background-color: rgb(227, 227, 227);
}

table.people img.flag {
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
</style>