<script setup lang="ts">
const props = defineProps({
    title: {
        type: String,
        required: false
    }
})
</script>

<template>
    <div class="control-group">
        <h5 v-if="title">{{ title }}</h5>
        <slot></slot>
    </div>
</template>

<style scoped>
div.control-group {
    border: solid 0.15em var(--masterBgColor);
    padding: 0.1em 0.5em;
    overflow: auto;
    white-space: nowrap;
    max-width: calc(100% - 3em);
    border-radius: 0.75em;
    display: inline-block;
}

div.control-group>h5 {
    display: inline-block;
    margin: 0.5em 1.5em;
    font-size: smaller;
    background-color: var(--masterBgColor);
    color: var(--masterColor);
    padding: 0.2em 1em;
    border-radius: 0.5em;
}
</style>