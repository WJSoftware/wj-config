<template>
    <table ref="self">
        <caption v-if="(showLevel && level > 1) || (showPath && path)"><span><span>{{ showPath ? path : '&nbsp;'
        }}</span><span v-if="showLevel && level > 1">Level: {{ level }}</span></span></caption>
        <thead>
            <tr>
                <th v-for="col in columns" :key="col.name">{{ col.title }}</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="item in scalarItems" :key="item.id">
                <td v-for="col in columns" :key="`${item.id}-${col.name}`">{{ item[col.name] }}</td>
            </tr>
            <tr v-if="objectItems?.length" v-for="item in objectItems" :key="item.id">
                <td :colspan="columns.length">
                    <details>
                        <summary>{{ item.name }}</summary>
                        <HierarchicalTable :columns="columns" :items="(item.subItems as Item[])" :class="cascadedClasses"
                            :cascaded-classes="cascadedClasses" :show-level="showLevel" :level="level + 1"
                            :show-path="showPath" :path="calculateChildPath(item.name)" />
                    </details>
                </td>
            </tr>
        </tbody>
    </table>
</template>

<script setup lang="ts">
import { computed, PropType } from 'vue';

export type Column = { name: string, title: string };
export type Item = { id: string | number, name: string, subItems?: Item[] | undefined, [x: string]: any };

const props = defineProps({
    columns: {
        type: Object as PropType<Column[]>,
        required: true
    },
    items: {
        type: Object as PropType<Item[]>,
        required: true
    },
    cascadedClasses: {
        type: String,
        required: false
    },
    showLevel: {
        type: Boolean,
        default: false
    },
    level: {
        type: Number,
        required: false,
        default: 1
    },
    showPath: {
        type: Boolean,
        default: false
    },
    path: {
        type: String,
        default: ''
    },
    pathSeparator: {
        type: String,
        default: '.'
    }
});
const scalarItems = computed(() => props.items.filter(i => !i.subItems));
const objectItems = computed(() => props.items.filter(i => i.subItems));

function calculateChildPath(childSegment: string) {
    return `${props.path}${(props.path.length ? props.pathSeparator : '')}${childSegment}`;
}
</script>

<style scoped>
caption>span {
    display: inline-flex;
    width: 100%;
    justify-content: space-between;
}

caption>span>span {
    display: inline-block;
}
</style>