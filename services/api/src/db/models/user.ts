import { prop, modelOptions, getModelForClass } from "@typegoose/typegoose"

@modelOptions({ options: { customName: "User" } })
class User {
    @prop({ required: true })
    username!: string

    @prop({ required: true })
    email!: string

    @prop({ required: true })
    password!: string
}

export const UserModel = getModelForClass(User)
