<script setup lang="ts">
import { debounce, Debouncer } from '@/helpers';
import { reactive, ref, watch } from 'vue';
import config from '../config';
import { usePeopleStore } from '../stores/PeopleStore';
import { PillItem } from './Pill.vue';
import PillSelector from './PillSelector.vue';

const peopleStore = usePeopleStore();
const pplCount = ref(peopleStore.peopleCount);
const items = reactive(config.personApi.pills.map(x => ({
    id: x.toString(),
    text: x.toString(),
    selected: false
})));
let pplCountDebouncer: Debouncer | undefined = undefined;

watch(pplCount, newPplCount => {
    setPplCount(() => {
        peopleStore.peopleCount = newPplCount;
        syncSelection();
    });
});
syncSelection();

function setPplCount(fn: TimerHandler) {
    pplCountDebouncer?.cancel();
    pplCountDebouncer = debounce(fn, config.appSettings.inputDelay);
}

function pillSelectionChanged(item: PillItem) {
    console.debug(`Selected item changed: id: ${item.id}, name: ${item.text}`);
    setPplCount(() => changePeopleCount(parseInt(item.id as string)));
}

function changePeopleCount(newValue: number) {
    peopleStore.peopleCount = newValue;
    pplCount.value = newValue;
}

function minBdayHandler(ev: Event) {
    console.debug('Date picker value: %s', (ev.target as any).value);
    peopleStore.minBday = (ev.target as any).value;
}

function syncSelection() {
    items.forEach(i => i.selected = parseInt(i.id as string) === peopleStore.peopleCount);
}
</script>

<template>
    <div className="control">
        <PillSelector mode="radio" title="People Count" :items="items" @selectionChanged="pillSelectionChanged">
            <label>
                Other: <input type="range" min="10" :max="config.personApi.maxPeopleCount" v-model.number="pplCount"
                    :step="config.personApi.peopleCountStep" size="6" />
                <span class="count">{{ pplCount }}</span>
            </label>
        </PillSelector>
        <div className="section">
            <label>
                <h5>Minimum Birth Date</h5>
                <input type="date" min={config.personApi.defaultMinBday} @change="minBdayHandler" />
            </label>
        </div>
    </div>
</template>

<style scoped>
span.count {
    font-weight: bold;
    padding: 0.3em;
    background-color: var(--masterBgColor);
    color: var(--masterColor);
    border-radius: 0.5em;
    border: 0.1em solid var(--masterColor);
}
</style>