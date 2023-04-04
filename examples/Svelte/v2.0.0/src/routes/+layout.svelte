<script>
    import config from "$src/config";
</script>

<div class="header">
    <img class="svelte" src="/favicon.png" alt="Svelte" />
    <h1>{config.appSettings.title}</h1>
</div>
<nav>
    <a href="/consoledemo">Console Logs Demo</a>
    <a href="/insideconfig">Inside the Configuration Object</a>
    <a href="/datafetching">Fetching Data</a>
</nav>
<main>
    <slot />
</main>

<style>
    div.header {
        background-color: var(--masterBgColor);
        color: var(--masterColor);
        padding: 2em;
        display: flex;
        flex-flow: column;
        align-items: center;
        border-radius: 0.5em 0.5em 0 0;
    }
    div.header > h1 {
        text-align: center;
    }
    div.header img.svelte {
        width: 6em;
    }
    nav {
        padding: 1em;
        display: flex;
        justify-content: center;
        border-radius: 0 0 0.5em 0.5em;
        background-color: rgb(201, 208, 211);
    }
    nav a {
        text-decoration: none;
        font-weight: bold;
        color: goldenrod;
        background-color: var(--masterBgColor);
        padding: 0.3em 1em;
        border-radius: 0.5em;
        margin-right: 1em;
    }
    nav a:hover {
        color: gold;
    }
</style>
