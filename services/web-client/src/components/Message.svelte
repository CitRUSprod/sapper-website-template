<script lang="ts">
    import { Snackbar, Button, Icon } from "svelte-materialify/src"
    import { message } from "@/store"

    const { text, type, visible } = message
</script>

<Snackbar
    class="{`${$type}-color justify-space-between`}"
    bind:active="{$visible}"
    timeout="{3000}"
    center
    bottom
>
    <span>{$text}</span>
    <Button
        size="small"
        icon
        on:click="{() => {
            visible.set(false)
        }}"
    >
        <Icon class="mdi mdi-close" />
    </Button>
</Snackbar>
