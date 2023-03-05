<script setup lang="ts">
import config from '../config';
import { usePeopleStore } from '../stores/PeopleStore';
import { PillItem } from './Pill.vue';
import PillSelector from './PillSelector.vue';

const peopleStore = usePeopleStore();
const items: PillItem[] = [
    {
        id: '100',
        name: '100'
    },
    {
        id: '200',
        name: '200'
    },
    {
        id: '300',
        name: '300'
    },
];

function pillSelectionChanged(item: PillItem) {
    console.debug(`Selected item changed: id: ${item.id}, name: ${item.name}`);
    changePeopleCount(parseInt(item.id as string));
}

function changePeopleCount(newValue: number) {
    peopleStore.$patch({
        peopleCount: newValue
    });
}

function minBdayHandler(ev: Event) {
    console.debug('Date picker value: %s', (ev.target as any).value);
    peopleStore.minBday = (ev.target as any).value;
}

function calculateInitialSelectionIndex() {
    for (let i = 0; i < items.length; ++i) {
        if (parseInt(items[i].id as string) === peopleStore.peopleCount) {
            return i;
        }
    }
    return null;
}
</script>

<template>
    <div className="control">
        <PillSelector title="People Count" :items="items" :initial-sel-index="calculateInitialSelectionIndex()"
            @selectionChanged="pillSelectionChanged">
            <label>Other: <input type="number" min="10" :max="config.personApi.maxPeopleCount"
                    v-model="peopleStore.peopleCount" :step="config.personApi.peopleCountStep" size="3" /></label>
        </PillSelector>
        <div className="section">
            <label>
                <h5>Minimum Birth Date</h5>
                <input type="date" min={config.personApi.defaultMinBday} @change="minBdayHandler" />
            </label>
        </div>
    </div>
</template>