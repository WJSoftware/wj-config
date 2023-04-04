<script lang="ts" context="module">
    import { library } from "@fortawesome/fontawesome-svg-core";
    import { faAward, faHandsHelping } from "@fortawesome/free-solid-svg-icons";

    library.add(faAward);
    library.add(faHandsHelping);

    export const bannerTypes = Object.freeze({
        Tip: 1,
        Collab: 2,
    });
</script>

<script lang="ts">
    import { FontAwesomeIcon, type WithPrefix } from "@fortawesome/svelte-fontawesome";
    export let type: number;
    export let inline = false;
    let typeText = "";
    let typeIcon: WithPrefix<'solid'>;

    $: {
        switch (type) {
            case bannerTypes.Tip:
                typeText = "Tip";
                typeIcon = "fa-solid fa-award";
                break;
            case bannerTypes.Collab:
                typeText = "Collaboration Wanted";
                typeIcon = "fa-solid fa-hands-helping";
                break;
        }
    }
</script>

<div class="banner-container">
    <div class="banner" class:inline>
        <h4><FontAwesomeIcon icon={typeIcon} /> { typeText }</h4>
        <slot />
    </div>
</div>

<style>
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
        border: 0.2em rgb(0, 174, 41) solid;
        background-color: rgb(233, 255, 239);
        border-radius: 10px;
        padding: 0.5em 2em;
    }

    div.banner.inline > h4 {
        display: inline;
        margin-right: 1em;
    }
</style>
