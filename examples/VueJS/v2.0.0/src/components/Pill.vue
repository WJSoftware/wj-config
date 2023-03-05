<script lang="ts">
import { PropType } from 'vue';


export type PillItem = { id: string | number, name: string };

export default {
    props: {
        selected: Boolean,
        item: {
            type: Object as PropType<PillItem>,
            required: true
        }
    },
    methods: {
        buttonClicked() {
            this.$emit('click', this.item);
        },
    },
    emits: ['click']
}
</script>

<template>
    <div :class="{ selected: selected }">
        <button @click="buttonClicked">
            {{ item.name }}
        </button>
    </div>
</template>
