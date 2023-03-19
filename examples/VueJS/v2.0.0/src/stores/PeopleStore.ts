import { useStorage } from '@vueuse/core';
import { defineStore } from 'pinia';
import config from '../config';

export const usePeopleStore = defineStore('people', {
    state: () => ({
        peopleCount: useStorage('peopleCount', config.personApi.initialPeopleCount),
        minBday: useStorage('minBday', config.personApi.defaultMinBday),
        fetchInProgress: false,
        people: null as (any[] | null),
        countries: null as (any[] | null)
    }),
    getters: {
        peopleUrl: (state) => {
            let qs: { min_bday: string } | undefined = undefined;
            if (state.minBday) {
                const minBday = state.minBday.substring(5, 7) + '/' + state.minBday.substring(8, 10) + '/' + state.minBday.substring(0, 4);
                qs = {
                    min_bday: minBday
                };
                console.log('Received min bday: %s', minBday);
                console.log('Refactored min bday: %s', minBday);
            }
            return config.api.mockaroo.person.all({ numRecords: state.peopleCount }, qs);
        }
    }
});
