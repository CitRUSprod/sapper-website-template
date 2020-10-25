import { message } from "@/store"

export function showSuccessMessage(text: string) {
    message.type.set("success")
    message.text.set(text)
    message.visible.set(true)
}

export function showErrorMessage(text: string) {
    message.type.set("error")
    message.text.set(text)
    message.visible.set(true)
}

export function showWarningMessage(text: string) {
    message.type.set("warning")
    message.text.set(text)
    message.visible.set(true)
}

export function showInfoMessage(text: string) {
    message.type.set("info")
    message.text.set(text)
    message.visible.set(true)
}
