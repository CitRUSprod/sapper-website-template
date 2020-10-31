<script lang="ts" context="module">
    import type common from "@sapper/common"

    type Preload = common.Preload

    export const preload: Preload = async function (this, page) {
        const { token } = page.params
        return { token }
    }
</script>

<script lang="ts">
    import axios from "@/assets/scripts/axios"
    import { onMount } from "svelte"
    import { goto } from "@sapper/app"
    import {
        showSuccessMessage,
        showErrorMessage
    } from "@/assets/scripts/message"

    export let token: string

    onMount(async () => {
        try {
            await axios.post("/api/auth/verify-email", { token })
            showSuccessMessage("Email verified successfully")
        } catch (err) {
            showErrorMessage(err.response.data.message ?? err.message)
        }
        goto("/")
    })
</script>
