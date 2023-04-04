<script lang="ts">
    import Article from "$lib/Article.svelte";
    import HierarchicalTable from "$lib/HierarchicalTable.svelte";
    import Banner, { bannerTypes } from "$lib/Banner.svelte";
    import config from "$src/config";
    import envTraits from "$src/env-traits";
    import type { IDataSourceInfo } from "wj-config";
    import type { Item, Column } from "$lib/HierarchicalTable.svelte";
    import { isArray, isFunction, isObject } from "$src/helpers";

    function sourceValue(traceInfo: IDataSourceInfo) {
        return `${traceInfo.name}, Index ${traceInfo.index}`;
    }

    function createItems(obj: any, traceObj: any): Item[] {
        const configItems: Item[] = [];
        for (const [k, v] of Object.entries(obj)) {
            const item: Item = {
                id: k,
                name: k,
            };
            if (!traceObj[k]) {
                continue;
            }
            if (isArray(v)) {
                item.value =
                    "[" + v.reduce((prev, cur) => prev + ", " + cur) + "]";
                item.source = sourceValue(traceObj[k]);
            } else if (isFunction(v)) {
                item.value = "[function]";
                item.source = sourceValue(traceObj[k]);
            } else if (isObject(v)) {
                item.subItems = createItems(v, traceObj[k]);
            } else {
                item.value = v;
                item.source = sourceValue(traceObj[k]);
            }
            configItems.push(item);
        }
        return configItems;
    }

    function sortItems(items: Item[]) {
        items.sort((a: Item, b: Item) => a.name.localeCompare(b.name));
        items
            .filter((x) => x.subItems)
            .forEach((i) => sortItems(i.subItems as Item[]));
    }

    let items: Item[] | undefined = undefined;
    if (config._trace) {
        items = createItems(config, config._trace);
        sortItems(items);
    }
    const columns: Column[] = [
        {
            name: "name",
            title: "Name",
        },
        {
            name: "value",
            title: "Value",
        },
        {
            name: "source",
            title: "Source",
        },
    ];
</script>

<svelte:head>
    <title>Inside the Configuration Object - {config.appSettings.title}</title>
</svelte:head>
<Article title="Peeking Inside the Configuration Object">
    <p>
        The following table shows the complete list of values found in the <strong
            >wj-config</strong
        >-built configuration object. They are the result of merging the various
        configuration sources in the order they were specified.
    </p>
    {#if config._trace}
        <HierarchicalTable
            {columns}
            {items}
            class="data"
            cascadedClasses="data"
            showLevel={true}
            showPath={true}
        />
    {/if}
    <p>
        The <strong>Source</strong> column comes from the ability of the
        configuration package to trace which data source last set a given
        configuration value. <em>Tracing</em> is a great tool to easily debug
        configuration or understand the mechanics provided by
        <strong>wj-config</strong>. The <strong>Index</strong> part of the source
        shows the index of the data source. It is zero-based, so the first configuration
        source added to the builder is index 0.
    </p>
    <h3>Qualified Data Sources</h3>
    <p>
        <em>Tracing</em> also includes the <strong>_qualifiedDs</strong> property
        in the root of the configuration object. This is an array of all data sources
        that actually qualified for inclusion. If you haven't read this in the package's
        documentation, data sources can be conditioned by using a predicate function.
        The final list of data sources depend on the result of the evaluation of
        said predicate.
    </p>
    <table class="data config">
        <thead>
            <tr>
                <th>Qualified Data Source</th>
                <th>Index</th>
            </tr>
        </thead>
        <tbody>
            {#each config._qualifiedDs as ds}
                <tr>
                    <td>{ds.name}</td>
                    <td>{ds.index}</td>
                </tr>
            {/each}
        </tbody>
    </table>
    <p>
        Only the above <strong>{config._qualifiedDs?.length ?? 0}</strong> data source(s)
        qualified, so only those were used to build the configuration object.
    </p>
    <Banner type={bannerTypes.Tip} inline={true}>
        Qualified data sources are only present when data tracing is enabled.
    </Banner>
    <hr />
    <p>
        Play around by changing the current environment name in the <strong
            >static/env.js</strong
        >
        file. The possible values are:
        <strong>{config.environment.all.reduce((p, c) => p + ", " + c)}</strong
        >. These values are themselves defined in
        <strong>src/config.ts</strong>. Feel free to play with those by creating
        new possible environments or deleting existing ones.
    </p>
    <p>
        You can also find the current environment's assigned traits in <strong
            >static/env.js</strong
        >. It is a value calculated from the traits definition found in
        <strong>src/env-traits.ts</strong>. You may also play around with these
        by adding new traits and creating data sources conditioned to these new
        traits.
    </p>
    <table class="data config">
        <thead>
            <tr>
                <th colSpan="2">Current Environment</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>Name</td>
                <td>{config.environment.current.name}</td>
            </tr>
            <tr>
                <td>Traits</td>
                <td>
                    {envTraits.toString(config.environment.current.traits)} (value:
                    {config.environment.current.traits})
                </td>
            </tr>
        </tbody>
    </table>
</Article>
