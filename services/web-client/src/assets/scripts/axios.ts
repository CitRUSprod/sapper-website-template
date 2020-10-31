import axios from "axios"
import Cookies from "js-cookie"

const token = Cookies.get("token")

if (token) {
    axios.defaults.headers.authorization = `Bearer ${token}`
}

export default axios
