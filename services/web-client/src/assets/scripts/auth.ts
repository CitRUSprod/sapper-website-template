import axios from "./axios"
import Cookes from "js-cookie"

export async function register(
    email: string,
    username: string,
    password: string
) {
    await axios.post("/api/auth/register", {
        email,
        username,
        password
    })
}

export async function login(email: string, password: string) {
    await axios.post("/api/auth/login", {
        email,
        password
    })
}

export function logout() {
    Cookes.remove("token")
}
