<script setup lang="ts">
import ScaleLoader from 'vue-spinner/src/ScaleLoader.vue';

defineProps<{
    block: Boolean,
    text: string
}>();
</script>

<template>
<span :class="{ spinner: true, 'spinner-inline': !block, 'spinner-block': block }">
    <ScaleLoader :color="block ? 'yellow' : 'white'" :class="{ inline: !block }" :height="block ? '1.5em' : '1em'" :width="block ? '4px' : '2px'" /><span v-if="!block">&nbsp;</span>{{ text }}
</span>
</template>

<style scoped>
.inline {
    display: inline;
    font-size: 1em;
}

.color {
    color: inherit
}

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