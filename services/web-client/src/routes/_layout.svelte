<script lang="ts" context="module">
    export const preload = () => {}
</script>

<svelte:head>
    <title>Website Template</title>
</svelte:head>
<slot />

<style lang="scss">
    :global(#sapper) {
        height: 100%;
    }

    :global(.fill-height) {
        height: 100%;
    }

    :global(.fill-width) {
        height: 100%;
    }
</style>
