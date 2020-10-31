<script lang="ts" context="module">
    import type common from "@sapper/common"

    type Preload = common.Preload

    export const preload: Preload = async function (this, _page, session) {
        if (!session.loggedIn) {
            this.redirect(302, "/")
        }
    }
</script>

<script lang="ts">
    import { Button } from "svelte-materialify/src"
    import { stores } from "@sapper/app"
    import axios from "@/assets/scripts/axios"
    import {
        showSuccessMessage,
        showErrorMessage
    } from "@/assets/scripts/message"

    const { session } = stores()

    async function sendVerificationMail() {
        try {
            await axios.post("/api/auth/send-email-verification")
            showSuccessMessage("Check your email")
        } catch (err) {
            showErrorMessage(err.response.data.message ?? err.message)
        }
    }
</script>

<div class="d-flex justify-center align-center fill-height">
    <div>
        <h4><b>Email:</b> {$session.user.email}</h4>
        <h4><b>Username:</b> {$session.user.username}</h4>
        <h4><b>Verified email:</b> {$session.user.verified ? 'yes' : 'no'}</h4>
        {#if !$session.user.verified}
            <div class="d-flex justify-center mt-4">
                <Button
                    class="success-color"
                    depressed
                    on:click="{sendVerificationMail}"
                >
                    Verify email
                </Button>
            </div>
        {/if}
    </div>
</div>
