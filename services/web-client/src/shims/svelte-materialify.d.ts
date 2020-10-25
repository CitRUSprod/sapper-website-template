declare module "svelte-materialify/src" {
    export * from "svelte-materialify"

    import { SvelteComponent } from "svelte-materialify/@types/shared"

    export class TextField extends SvelteComponent {}
    export class Snackbar extends SvelteComponent {}
}
