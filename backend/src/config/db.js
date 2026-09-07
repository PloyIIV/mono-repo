import mongoose from "mongoose";

export async function connectDB() {
    const uri = process.env.MONGO_URI

    if(!uri) {
        throw new Error("Missing MONGO_URI")
    }
    await mongoose.connect(uri, {
        dbName: 'test'
    })

    console.log("MongoDB connected ✅")
}