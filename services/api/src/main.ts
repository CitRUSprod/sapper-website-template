import fastify from "fastify"
import auth from "fastify-auth"
import jwt from "fastify-jwt"
import Database from "@/db"
import { authRoute } from "@/routes"

const port = 6702

const app = fastify()

const localClientSecret = process.env.LOCAL_CLIENT_SECRET as string

app.register(jwt, { secret: localClientSecret }).register(auth)

app.register(authRoute, { prefix: "/auth" })

Database.connect("localhost", 27017, "db")
    .then(() => {
        app.listen(port, "0.0.0.0", err => {
            if (err) throw err
            console.log(`Running on http://localhost:${port}`)
        })
    })
    .catch(err => {
        console.error(err)
    })
