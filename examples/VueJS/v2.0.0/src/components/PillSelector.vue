<script setup lang="ts">
import { PropType } from 'vue';
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
    <div className="pill-selector">
        <h5 v-if="title">{{ title }}</h5><br v-if="title" />
        <Pill v-for="it in items" :key="it.id" :item="it" @click="pillClicked" :selected="it.selected" />
        <slot></slot>
    </div>
</template>

<style>
div.pill-selector {
    --main-color: #1b4b58;
    --text-color: white;
    border: solid 0.15em var(--main-color);
    padding: 0.1em 0.5em;
    overflow: auto;
    white-space: nowrap;
    max-width: calc(100% - 3em);
    border-radius: 0.75em;
    display: inline-block;
}

div.pill-selector>h5 {
    display: inline-block;
    margin: 0.5em 1.5em;
    font-size: smaller;
    background-color: var(--main-color);
    color: var(--text-color);
    padding: 0.2em 1em;
    border-radius: 0.5em;
}

div.pill-selector label {
    border: solid 0.1em var(--main-color);
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
    color: var(--text-color);
}

div.pill-selector>div.accented {
    border-color: var(--main-color);
    border-width: 0.22em;
    border-style: dotted solid solid dashed
}

div.pill-selector>div.selected {
    font-weight: 900;
    color: #f3ff00;
}

div.pill-selector>div>button {
    background-color: var(--main-color);
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