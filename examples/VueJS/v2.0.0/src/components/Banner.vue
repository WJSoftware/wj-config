<template>
    <div class="banner-container">
        <div :class="{ banner: true, inline: inline }">
            <h4><font-awesome-icon :icon="typeIcon" /> {{ typeText }}</h4>
            <slot></slot>
        </div>
    </div>
</template>

<script lang="ts">
export const bannerTypes = Object.freeze({
    Tip: 1,
    Collab: 2
});
</script>
  
<script setup lang="ts">
import { computed } from "vue";

const props = defineProps({
    type: {
        type: Number,
        required: true,
    },
    inline: {
        type: Boolean,
        default: false,
    },
});
const typeText = computed(() => {
    switch (props.type) {
        case bannerTypes.Tip:
            return "Tip";
        case bannerTypes.Collab:
            return "Collaboration Wanted";
    }
    return null;
});
const typeIcon = computed(() => {
    switch (props.type) {
        case bannerTypes.Tip:
            return 'fa-solid fa-award';
        case bannerTypes.Collab:
            return 'fa-solid fa-hands-helping'
    }
});
</script>

<style scoped>
div.banner-container {
    display: flex;
    justify-content: center;
}

div.banner {
    display: inline-block;
    font-size: smaller;
    margin-left: auto;
    margin-right: auto;
    margin-bottom: 1em;
    max-width: 80%;
    border: 0.2em rgb(199, 13, 246) solid;
    background-color: rgb(250, 233, 255);
    border-radius: 10px;
    padding: 0.5em 2em;
}

div.banner.inline>h4 {
    display: inline;
    margin-right: 1em;
}
</style>