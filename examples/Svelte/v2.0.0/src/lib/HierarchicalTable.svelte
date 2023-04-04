<script context="module" lang="ts">
    export type Column = { name: string; title: string };
    export type Item = {
        id: string | number;
        name: string;
        subItems?: Item[] | undefined;
        [x: string]: any;
    };
</script>

<script lang="ts">
    export let columns: Column[];
    export let items: Item[];
    export let cascadedClasses: string | undefined = undefined;
    export let showLevel = false;
    export let level = 1;
    export let showPath = false;
    export let path = "";
    export let pathSeparator = ".";

    let self;

    $: scalarItems = items.filter((i) => !i.subItems);
    $: objectItems = items.filter((i) => i.subItems);

    function calculateChildPath(childSegment: string) {
        return `${path}${path.length ? pathSeparator : ""}${childSegment}`;
    }
</script>

<table class={$$restProps.class ?? ""} bind:this={self}>
    {#if (showLevel && level > 1) || (showPath && path)}
        <caption>
            <span>
                <span>{showPath ? path : "&nbsp;"}</span>
                {#if showLevel && level > 1}
                    <span>Level: {level}</span>
                {/if}
            </span>
        </caption>
    {/if}
    <thead>
        <tr>
            {#each columns as col}
                <th>{col.title}</th>
            {/each}
        </tr>
    </thead>
    <tbody>
        {#each scalarItems as item}
            <tr>
                {#each columns as col}
                    <td>{item[col.name]}</td>
                {/each}
            </tr>
        {/each}
        {#if objectItems?.length}
            {#each objectItems as item (item.id)}
                <tr>
                    <td colspan={columns.length}>
                        <details>
                            <summary>{item.name}</summary>
                            <svelte:self
                                {columns}
                                items={item.subItems}
                                class={cascadedClasses}
                                {cascadedClasses}
                                {showLevel}
                                level={level + 1}
                                {showPath}
                                path={calculateChildPath(item.name)}
                            />
                        </details>
                    </td>
                </tr>
            {/each}
        {/if}
    </tbody>
</table>

<style>
    caption > span {
        display: inline-flex;
        width: 100%;
        justify-content: space-between;
    }

    caption > span > span {
        display: inline-block;
    }
</style>
