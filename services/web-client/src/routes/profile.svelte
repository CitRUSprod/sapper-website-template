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
    import { stores } from "@sapper/app"

    const { session } = stores()
</script>

<div class="d-flex justify-center align-center fill-height">
    <div>
        <h4><b>Email:</b> {$session.user.email}</h4>
        <h4><b>Username:</b> {$session.user.username}</h4>
    </div>
</div>
