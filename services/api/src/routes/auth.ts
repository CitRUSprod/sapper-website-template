import { FastifyInstance, FastifyRequest, FastifyPluginOptions } from "fastify"
import { FastifyAuthFunction } from "fastify-auth"

interface User {
    username: string
    password: string
}

interface UserPayload {
    username: string
}

const users: Array<User> = []

export default (
    app: FastifyInstance,
    opts: FastifyPluginOptions,
    done: Function
) => {
    const verifyJwt: FastifyAuthFunction = async (
        req: FastifyRequest & { body: any }
    ) => {
        if (!req.raw.headers.authorization) {
            throw new Error("Missing token header")
        }

        const tokenNotValid = new Error("Token not valid")

        const headerParts = req.raw.headers.authorization.split(" ")

        if (headerParts[0] !== "Bearer") {
            throw tokenNotValid
        }

        const token = headerParts[1]

        try {
            const user = await app.jwt.verify<UserPayload>(token)
            req.user = user
        } catch (err) {
            throw tokenNotValid
        }
    }

    app.post("/register", {
        schema: {
            body: {
                type: "object",
                properties: {
                    username: { type: "string" },
                    password: { type: "string" }
                },
                required: ["username", "password"]
            }
        },
        async handler(req: FastifyRequest & { body: any }, reply) {
            try {
                const { username, password } = req.body
                const user = { username, password }

                users.push(user)

                reply.send()
            } catch (err) {
                reply.send(err)
            }
        }
    })

    app.post("/login", {
        schema: {
            body: {
                type: "object",
                properties: {
                    username: { type: "string" },
                    password: { type: "string" }
                },
                required: ["username", "password"]
            }
        },
        async handler(req: FastifyRequest & { body: any }, reply) {
            const { username, password } = req.body

            const user = users.find(u => u.username === username)

            if (user) {
                if (user.password === password) {
                    const payload: UserPayload = {
                        username: user.username
                    }
                    const token = await app.jwt.sign(payload)
                    reply.send({ token })
                } else {
                    reply.code(400).send(new Error("Incorrect password"))
                }
            } else {
                reply.code(400).send(new Error("User not found"))
            }
        }
    })

    app.get("/user", {
        preHandler: app.auth([verifyJwt]),
        async handler(req: FastifyRequest & { user: any }, reply) {
            const user: UserPayload = req.user
            reply.send({ ...user })
        }
    })

    done()
}
