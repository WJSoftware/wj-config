<script setup lang="ts">
import PeoplePanel from './PeoplePanel.vue';
import PeopleTable from './PeopleTable.vue';
import { usePeopleStore } from '@/stores/PeopleStore';

const peopleStore = usePeopleStore();
</script>

<template>
    <article>
        <h2>Querying Data</h2>
        <p>Below is a list of (ficticious) people from around the world. It is fetched data. The URL's needed to fetch are
            defined inside the <strong>api</strong> section of the configuration object. The configuration section
            <strong>personApi</strong> limits the values that are possible from the controls below. Premium customers may
            query up to 1000 people; basic customers may query up to 100 people.
        </p>
        <PeoplePanel v-model:ppl-count="peopleStore.peopleCount" v-model:min-bday="peopleStore.minBday" />
        <PeopleTable />
    </article>
</template>