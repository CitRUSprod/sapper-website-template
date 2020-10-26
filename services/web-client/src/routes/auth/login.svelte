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
    import { login } from "@/assets/scripts/auth"
    import { showErrorMessage } from "@/assets/scripts/message"

    let email = ""
    let password = ""

    async function doLogin() {
        try {
            await login(email, password)
            location.href = "/"
        } catch (err) {
            showErrorMessage(err.response.data.message ?? err.message)
        }
    }
</script>

<div class="d-flex justify-center align-center fill-height">
    <Card style="width: 500px">
        <CardTitle>Login</CardTitle>
        <CardText>
            <div>
                <TextField filled bind:value="{email}">Email</TextField>
            </div>
            <div>
                <TextField type="password" filled bind:value="{password}">
                    Password
                </TextField>
            </div>
        </CardText>
        <CardActions class="justify-space-between">
            <a class="text-decoration-none black-text" href="/auth/register">
                <Button text>Register</Button>
            </a>
            <Button class="primary-color" depressed on:click="{doLogin}">
                Login
            </Button>
        </CardActions>
    </Card>
</div>
