import { FastifyInstance, FastifyRequest, FastifyPluginOptions } from "fastify"
import { FastifyAuthFunction } from "fastify-auth"
import argon2 from "argon2"
import validator from "validator"
import Database from "@/db"

const { UserModel } = Database.models

interface LoginData {
    email: string
    password: string
}

interface RegisterData {
    email: string
    username: string
    password: string
}

interface UserPayload {
    id: string
}

function isGoodEmail(email: string) {
    return validator.isEmail(email) && validator.matches(email, /^[a-z\d@.]+$/)
}

export default (
    app: FastifyInstance,
    opts: FastifyPluginOptions,
    done: Function
) => {
    const verifyJwt: FastifyAuthFunction = async (req: FastifyRequest) => {
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
                    email: { type: "string", minLength: 6 },
                    username: { type: "string", minLength: 3, maxLength: 20 },
                    password: { type: "string", minLength: 8 }
                },
                required: ["email", "username", "password"]
            }
        },
        async handler(req: FastifyRequest & { body: any }, reply) {
            try {
                const { email, username, password }: RegisterData = req.body

                const trimmedEmail = email.trim().toLowerCase()
                const trimmedUsername = username.trim()

                if (!isGoodEmail(trimmedEmail)) {
                    reply.code(400).send(new Error("Email is not valid"))
                    return
                }

                if (!validator.matches(trimmedUsername, /^\w+$/)) {
                    reply.code(400).send(new Error("Username is not valid"))
                    return
                }

                const userByUsername = await UserModel.findOne({
                    username: {
                        $regex: new RegExp(username, "i")
                    }
                })

                if (userByUsername) {
                    reply
                        .code(400)
                        .send(
                            new Error(
                                "A user with this username already exists"
                            )
                        )
                } else {
                    const userByEmail = await UserModel.findOne({
                        email: trimmedEmail
                    })

                    if (userByEmail) {
                        reply
                            .code(400)
                            .send(
                                new Error(
                                    "A user with this email already exists"
                                )
                            )
                    } else {
                        const passwordHash = await argon2.hash(password)
                        await UserModel.create({
                            email: trimmedEmail,
                            username: trimmedUsername,
                            password: passwordHash
                        })
                        reply.send()
                    }
                }
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
                    email: { type: "string", minLength: 6 },
                    password: { type: "string", minLength: 8 }
                },
                required: ["email", "password"]
            }
        },
        async handler(req: FastifyRequest & { body: any }, reply) {
            const { email, password }: LoginData = req.body

            const trimmedEmail = email.trim().toLowerCase()

            if (!isGoodEmail(trimmedEmail)) {
                reply.code(400).send(new Error("Email is not valid"))
                return
            }

            const user = await UserModel.findOne({ email: trimmedEmail })

            if (user) {
                const isCorrect = await argon2.verify(user.password, password)

                if (isCorrect) {
                    const payload: UserPayload = {
                        id: user.id
                    }
                    const time = 14 * 24 * 60 * 60
                    const token = await app.jwt.sign(payload, {
                        expiresIn: time
                    })
                    reply
                        .setCookie("token", token, {
                            path: "/",
                            expires: new Date(Date.now() + time * 1000)
                        })
                        .send({ token })
                } else {
                    reply.code(400).send(new Error("Incorrect password"))
                }
            } else {
                reply
                    .code(400)
                    .send(new Error("User with such email was not found"))
            }
        }
    })

    app.get("/user", {
        preHandler: app.auth([verifyJwt]),
        async handler(req: FastifyRequest & { user: any }, reply) {
            const { id }: UserPayload = req.user

            const user = await UserModel.findById(id)

            if (user) {
                const userInfo = {
                    email: user.email,
                    username: user.username
                }
                reply.send(userInfo)
            } else {
                reply.send(new Error("User not found"))
            }
        }
    })

    done()
}
