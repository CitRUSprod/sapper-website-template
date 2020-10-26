<script lang="ts" context="module">
    import type common from "@sapper/common"

    type Preload = common.Preload

    export const preload: Preload = async function (this, _page, session) {
        if (session.loggedIn) {
            this.redirect(302, "/")
        }
    }
</script>

<script lang="ts">
    import {
        Card,
        CardTitle,
        CardText,
        CardActions,
        TextField,
        Button
    } from "svelte-materialify/src"
    import { goto } from "@sapper/app"
    import { register } from "@/assets/scripts/auth"
    import {
        showSuccessMessage,
        showErrorMessage
    } from "@/assets/scripts/message"

    let email = ""
    let username = ""
    let password = ""

    async function doRegister() {
        try {
            await register(email, username, password)
            showSuccessMessage("You are successfully registered")
            goto("/auth/login")
        } catch (err) {
            showErrorMessage(err.response.data.message ?? err.message)
        }
    }
</script>

<div class="d-flex justify-center align-center fill-height">
    <Card style="width: 500px">
        <CardTitle>Register</CardTitle>
        <CardText>
            <div>
                <TextField filled bind:value="{email}">Email</TextField>
            </div>
            <div>
                <TextField filled bind:value="{username}">Username</TextField>
            </div>
            <div>
                <TextField type="password" filled bind:value="{password}">
                    Password
                </TextField>
            </div>
        </CardText>
        <CardActions class="justify-space-between">
            <a class="text-decoration-none black-text" href="/auth/login">
                <Button text>Login</Button>
            </a>
            <Button class="primary-color" depressed on:click="{doRegister}">
                Register
            </Button>
        </CardActions>
    </Card>
</div>
