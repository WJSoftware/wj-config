<script lang="ts">
import { PropType } from 'vue';


export type PillItem = { id: string | number, text: string, selected: boolean };

export default {
    props: {
        selected: Boolean,
        item: {
            type: Object as PropType<PillItem>,
            required: true
        },
        disabled: {
            type: Boolean,
            default: false
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
    <div :class="{ selected: selected, disabled: disabled }">
        <button @click="buttonClicked" :disabled="disabled">
            {{ item.text }}
        </button>
    </div>
</template>
