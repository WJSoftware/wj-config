<script setup lang="ts">
import { PropType } from 'vue';
import ControlGroup from './ControlGroup.vue';
import Pill, { PillItem } from './Pill.vue';

const props = defineProps({
    title: String,
    items: {
        type: Object as PropType<PillItem[]>,
        required: true
    },
    initialSelIndex: {
        type: [Number, Object],
        required: false
    },
    mode: {
        type: String as PropType<'radio' | 'check'>,
        required: true
    },
    disabled: {
        type: Boolean,
        default: false
    }
});
const emit = defineEmits(['selectionChanged']);

function pillClicked(item: PillItem) {
    changeSelection(item);
    emit('selectionChanged', item);
}

function changeSelection(item: PillItem) {
    if (props.mode == 'radio') {
        props.items.forEach(i => {
            i.selected = i.id === item.id
        });
        return;
    }
    item.selected = !item.selected;
}
</script>

<template>
    <ControlGroup class="pill-selector" :title="title">
        <Pill v-for="it in items" :key="it.id" :item="it" @click="pillClicked" :selected="it.selected"
            :disabled="disabled" />
        <slot></slot>
    </ControlGroup>
</template>

<style>
div.pill-selector label {
    border: solid 0.1em var(--masterBgColor);
    border-radius: 0.5em;
    padding: 0.7em 0.5em;
    color: var(--main-color);
    font-size: smaller;
}

div.pill-selector>div {
    display: inline-block;
    padding: 0.05em 0.15em;
    font-size: 12pt;
    margin: 2px 0px;
    border-radius: 1.5em;
    color: var(--masterColor);
}

div.pill-selector>div.accented {
    border-color: var(--masterBgColor);
    border-width: 0.22em;
    border-style: dotted solid solid dashed
}

div.pill-selector>div.selected {
    font-weight: 900;
    color: #f3ff00;
}

div.pill-selector>div>button {
    background-color: var(--masterBgColor);
    border: none;
    padding: 0.4em 0.9em;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    margin: 4px 2px;
    cursor: pointer;
    border-radius: inherit;
    color: inherit;
    font-weight: inherit;
    min-width: 3em;
}

div.pill-selector>div.disabled>button {
    background-color: lightgray;
    color: black;
    border: solid 0.15em #eee;
    cursor: not-allowed;
}
</style>