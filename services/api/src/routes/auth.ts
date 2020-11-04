import _ from "lodash"
import { FastifyInstance, FastifyRequest, FastifyPluginOptions } from "fastify"
import { FastifyAuthFunction } from "fastify-auth"
import argon2 from "argon2"
import nodemailer from "nodemailer"
import validator from "validator"
import Database from "@/db"

interface LoginData {
    email: string
    password: string
}

interface RegisterData {
    email: string
    username: string
    password: string
}

interface VerifyEmailData {
    token: string
}

interface UserPayload {
    id: string
}

interface EmailVerificationToken {
    email: string
    token: string
    timeout: NodeJS.Timeout
}

const { UserModel } = Database.models

const webPort = process.env.WEB_PORT as string

const gmail = {
    username: process.env.GMAIL_USERNAME as string,
    password: process.env.GMAIL_PASSWORD as string,
    name: process.env.GMAIL_NAME as string
}

const transporter = nodemailer.createTransport(
    {
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: `${gmail.username}@gmail.com`,
            pass: gmail.password
        }
    },
    {
        from: `${gmail.name} <${gmail.username}@gmail.com>`
    }
)

function sendMail(to: string, subject: string, message: string) {
    return new Promise((resolve, reject) => {
        transporter.sendMail({ to, subject, html: message }, (err, info) => {
            if (err) {
                reject(err)
            } else {
                resolve(info)
            }
        })
    })
}

function generateToken(length = 8) {
    const symbols =
        "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"

    let token = ""

    for (let i = 0; i < length; i++) {
        const symbol = _.random(0, symbols.length - 1)
        token += symbols[symbol]
    }

    return token
}

const emailVerificationTokens: Array<EmailVerificationToken> = []

function generateUniqToken(length = 8): string {
    const token = generateToken(length)
    const found = _.find(emailVerificationTokens, { token })

    return found ? generateUniqToken(length) : token
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
                        $regex: new RegExp(`^${username}$`, "i")
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
                    username: user.username,
                    verified: user.verified
                }
                reply.send(userInfo)
            } else {
                reply.send(new Error("User not found"))
            }
        }
    })

    app.post("/send-email-verification", {
        preHandler: app.auth([verifyJwt]),
        async handler(req: FastifyRequest & { user: any }, reply) {
            const { id }: UserPayload = req.user

            const user = await UserModel.findById(id)

            if (user) {
                if (user.verified) {
                    reply.code(400).send(new Error("Email is already verified"))
                    return
                }

                const { email, username } = user
                const token = generateUniqToken()
                emailVerificationTokens.push({
                    email,
                    token,
                    timeout: setTimeout(() => {
                        _.remove(emailVerificationTokens, t => {
                            return t.email === email
                        })
                    }, 24 * 60 * 60 * 1000)
                })

                const subject = "Email confirmation"
                const message = `<h3>Dear ${username}</h3>\n<div><a href="http://127.0.0.1:${webPort}/auth/verify-email-${token}">Confirm Email</a></div>`
                await sendMail(email, subject, message)

                reply.send()
            } else {
                reply.send(new Error("User not found"))
            }
        }
    })

    app.post("/verify-email", {
        schema: {
            body: {
                type: "object",
                properties: {
                    token: { type: "string" }
                },
                required: ["token"]
            }
        },
        async handler(req: FastifyRequest & { body: any }, reply) {
            const { token }: VerifyEmailData = req.body

            const found = _.find(emailVerificationTokens, { token })

            if (found) {
                const user = await UserModel.findOne({ email: found.email })

                if (user) {
                    user.verified = true
                    await user.save()
                    _.remove(emailVerificationTokens, t => {
                        return t.token === token
                    })
                    reply.send()
                } else {
                    reply.send(new Error("User not found"))
                }
            } else {
                reply.send(new Error("Invalid or expired token"))
            }
        }
    })

    done()
}
