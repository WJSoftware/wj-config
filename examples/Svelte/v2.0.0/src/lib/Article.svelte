<script>
    export let title = "";
</script>

<article>
    <h2>{title}</h2>
    <div>
        <slot />
    </div>
</article>

<style>
    article {
        margin-top: 2em;
        padding: 0em 2em 2em 2em;
        border-radius: 1em;
        border: 0.2em solid var(--masterBgColor);
        box-shadow: 1em 1em rgba(0, 0, 0, 0.1);
    }
    article > h2 {
        display: inline-block;
        padding: 0 1.5em;
        position: relative;
        top: -1.7em;
        left: -0.5em;
        border: 0.2em solid var(--masterBgColor);
        border-radius: 0.5em;
        background-color: var(--masterBgColor);
        color: var(--masterColor);
    }
    article > div {
        margin-top: -2em;
    }
</style>
