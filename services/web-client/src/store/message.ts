import { writable } from "svelte/store"

type MessageType = "success" | "error" | "warning" | "info"

export const text = writable("")
export const type = writable<MessageType>("success")
export const visible = writable(false)
