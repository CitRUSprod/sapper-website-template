<script lang="ts">
    import { MaterialApp } from "svelte-materialify/src"
    import Header from "@/components/Header.svelte"
    import Message from "@/components/Message.svelte"
</script>

<svelte:head>
    <title>Website Template</title>
</svelte:head>

<MaterialApp>
    <Header />
    <main class="fill-height">
        <slot />
    </main>
    <Message />
</MaterialApp>

<style lang="scss">
    :global(#sapper) {
        height: 100%;
    }

    :global(.s-app) {
        display: flex;
        flex-direction: column;
        height: 100%;
    }

    :global(.fill-height) {
        height: 100% !important;
    }

    :global(.fill-width) {
        width: 100% !important;
    }

    :global(.spacer) {
        flex-grow: 1 !important;
    }
</style>
