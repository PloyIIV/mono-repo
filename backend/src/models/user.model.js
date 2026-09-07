import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema(
    {
        username: { type: String },
        email: String,
        password: {String, required: true}
    },
    {
        timestamps: true
    }
)
export const User = mongoose.model('User', userSchema)