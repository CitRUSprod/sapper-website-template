<script lang="ts">
    import { AppBar, Button } from "svelte-materialify/src"
    import { stores } from "@sapper/app"
    import { logout } from "@/assets/scripts/auth"

    const { session } = stores()

    function doLogout() {
        logout()
        location.reload()
    }
</script>

<AppBar class="primary-color white-text">
    <span slot="title" class="mr-8">Website Template</span>
    <a class="text-decoration-none white-text" href="/">
        <Button text>Home</Button>
    </a>
    {#if $session.loggedIn}
        <a class="text-decoration-none white-text" href="/profile">
            <Button text>Profile</Button>
        </a>
    {/if}
    <div class="spacer"></div>
    {#if $session.loggedIn}
        <Button text on:click="{doLogout}">Logout</Button>
    {:else}
        <a class="text-decoration-none white-text" href="/auth/login">
            <Button text>Login</Button>
        </a>
    {/if}
</AppBar>
