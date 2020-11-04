import axios from "axios"
import sirv from "sirv"
import polka from "polka"
import compression from "compression"
import cookieParser from "cookie-parser"
import * as sapper from "@sapper/server"

const dev = process.env.NODE_ENV === "development"
const webHost = process.env.WEB_HOST ?? "localhost"
const webPort = process.env.WEB_PORT

polka()
    .use(
        compression({ threshold: 0 }),
        sirv("src/static", { dev }),
        cookieParser(),
        async (req, res, next) => {
            const { token } = req.cookies

            let user

            try {
                const { data } = await axios.get(
                    `http://${webHost}:${webPort}/api/auth/user`,
                    {
                        headers: {
                            authorization: `Bearer ${token}`
                        }
                    }
                )
                user = data
            } catch (err) {
                user = null
            }

            return sapper.middleware({
                session() {
                    return {
                        loggedIn: !!user,
                        user
                    }
                }
            })(req, res, next)
        }
    )
    .listen(process.env.PORT, (err: any) => {
        if (err) console.log("error", err)
    })
