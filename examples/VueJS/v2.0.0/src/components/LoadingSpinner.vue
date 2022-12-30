<script setup lang="ts">
const props = defineProps<{
    block: Boolean,
    text: string
}>();
</script>

<template>
    <span :class="{ spinner: true, 'spinner-inline': !block, 'spinner-block': block }">{{ text }}</span>
</template>

<style scoped>
span.spinner {
    display: inline-block;
    margin-left: auto;
    margin-right: auto;
    background-color: var(--masterBgColor);
    color: var(--masterColor);
    font-weight: bold;
    padding: 2px 12px;
    border-radius: 7px;
}

span.spinner-inline {
    font-size: smaller;
}

span.spinner-block {
    margin: 2em 2em;
    color: yellow;
    font-size: x-large;
    padding: 1em 2em;
}
</style>