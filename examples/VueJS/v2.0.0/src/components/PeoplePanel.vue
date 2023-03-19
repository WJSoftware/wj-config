<script setup lang="ts">
import { debounce, Debouncer } from '@/helpers';
import { reactive, ref, watch } from 'vue';
import config from '../config';
import { PillItem } from './Pill.vue';
import PillSelector from './PillSelector.vue';
import { usePeopleStore } from '@/stores/PeopleStore';
import { storeToRefs } from 'pinia';
import ControlGroup from './ControlGroup.vue';
import loggerFactory from '@/logger-factory';

type DebouncerRef = { instance?: Debouncer };

const logger = loggerFactory('PeoplePanel');
const props = defineProps({
    pplCount: {
        type: Number,
        required: true
    },
    minBday: {
        type: String,
        required: false
    }
});
const { fetchInProgress: disabled } = storeToRefs(usePeopleStore());

logger.verbose('Setup!');
const emit = defineEmits(['update:pplCount', 'update:minBday']);
const items = reactive(config.personApi.pills.map(x => ({
    id: x.toString(),
    text: x.toString(),
    selected: false
})));
const pCount = ref(props.pplCount);
const minBd = ref(props.minBday);
syncSelection();
watch(() => props.pplCount, newValue => {
    logger.verbose(`props.pplCount changed: ${newValue}`);
    pCount.value = newValue;
});
watch(pCount, newPplCount => {
    logger.verbose(`pCount changed: ${newPplCount}`);
    syncSelection();
    setDebouncer(pplCountDebouncer, () => changePeopleCount(newPplCount));
});
watch(minBd, newMinBd => {
    logger.verbose(`minBd  changed: ${newMinBd}`);
    setDebouncer(minBdayDebouncer, () => changeMinBday(newMinBd));
})
let pplCountDebouncer: DebouncerRef = {};
let minBdayDebouncer: DebouncerRef = {};

function setDebouncer(debouncer: DebouncerRef, fn: TimerHandler) {
    debouncer.instance?.cancel();
    debouncer.instance = debounce(fn, config.appSettings.inputDelay);
}

function pillSelectionChanged(item: PillItem) {
    logger.verbose(`Selected item changed: id: ${item.id}, name: ${item.text}`);
    setDebouncer(pplCountDebouncer, () => changePeopleCount(parseInt(item.id as string)));
}

function changePeopleCount(newValue: number) {
    emit('update:pplCount', newValue);
}

function changeMinBday(newValue?: string) {
    emit('update:minBday', newValue);
}

function syncSelection() {
    logger.verbose(`syncSelection: ${pCount.value}`);
    items.forEach(i => i.selected = parseInt(i.id as string) === pCount.value);
}
</script>

<template>
    <div className="control">
        <PillSelector mode="radio" title="People Count" :items="items" @selectionChanged="pillSelectionChanged"
            :disabled="disabled">
            <label>
                Other: <input type="range" min="10" :max="config.personApi.maxPeopleCount" v-model.number="pCount"
                    :step="config.personApi.peopleCountStep" size="6" :disabled="disabled" />
                <span class="count">{{ pCount }}</span>
            </label>
        </PillSelector>
        <ControlGroup title="Minimum Birth Date">
            <input type="date" min={config.personApi.defaultMinBday} :disabled="disabled" v-model="minBd" />
        </ControlGroup>
    </div>
</template>

<style scoped>
div.control {
    margin-top: 2em;
    display: flex;
    justify-content: space-evenly;
    flex-wrap: wrap;
}

span.count {
    font-weight: bold;
    padding: 0.3em;
    background-color: var(--masterBgColor);
    color: var(--masterColor);
    border-radius: 0.5em;
    border: 0.1em solid var(--masterColor);
}
</style>