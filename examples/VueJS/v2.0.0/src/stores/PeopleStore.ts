import { useStorage } from '@vueuse/core';
import { defineStore } from 'pinia';
import config from '../config';

export const usePeopleStore = defineStore('people', {
    state: () => ({
        peopleCount: useStorage('peopleCount', config.personApi.initialPeopleCount),
        minBday: useStorage('minBday', config.personApi.defaultMinBday),
        people: null as (any[] | null),
        countries: null as (any[] | null)
    }),
    getters: {
        peopleUrl: (state) => config.api.mockaroo.person.all({ numRecords: state.peopleCount })
    }
});
