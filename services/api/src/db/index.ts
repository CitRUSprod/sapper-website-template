import mongoose from "mongoose"
import * as models from "./models"

export default class Database {
    static readonly models = models

    static connect(host: string, port: number, name: string) {
        return mongoose.connect(`mongodb://${host}:${port}/${name}`, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
    }

    static close() {
        return mongoose.connection.close()
    }
}
