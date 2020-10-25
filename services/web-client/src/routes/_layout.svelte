<script lang="ts" context="module">
    export const preload = () => {}
</script>

<script lang="ts">
    import { MaterialApp } from "svelte-materialify/src"
    import Message from "@/components/Message.svelte"
</script>

<svelte:head>
    <title>Website Template</title>
</svelte:head>

<MaterialApp>
    <slot />
    <Message />
</MaterialApp>

<style lang="scss">
    :global(#sapper, .s-app) {
        height: 100%;
    }

    :global(.fill-height) {
        height: 100% !important;
    }

    :global(.fill-width) {
        width: 100% !important;
    }
</style>
