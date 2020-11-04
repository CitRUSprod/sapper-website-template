import fastify from "fastify"
import auth from "fastify-auth"
import jwt from "fastify-jwt"
import cookie from "fastify-cookie"
import Database from "@/db"
import { authRoute } from "@/routes"

const port = 6702

const app = fastify()

const mongoPort = process.env.MONGO_PORT ?? "27017"
const mongoHost = process.env.MONGO_HOST ?? "localhost"
const mongoDbName = process.env.MONGO_DB_NAME as string
const localClientSecret = process.env.LOCAL_CLIENT_SECRET as string

app.register(jwt, { secret: localClientSecret }).register(cookie).register(auth)

app.register(authRoute, { prefix: "/auth" })

Database.connect(mongoHost, parseInt(mongoPort), mongoDbName)
    .then(() => {
        app.listen(port, "0.0.0.0", err => {
            if (err) throw err
            console.log(`Running on http://localhost:${port}`)
        })
    })
    .catch(err => {
        console.error(err)
    })
