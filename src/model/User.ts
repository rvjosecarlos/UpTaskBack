import mongoose, { Schema, Document } from "mongoose";

interface IUser extends Document {
    name: string,
    password: string,
    email: string,
    confirmed: boolean
};

const UserSchema: Schema = new Schema({
    name: {
        type: String,
        require: true,
        trim: true
    },
    password: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true,
        unique: true,
        trim: true
    },
    confirmed: {
        type: Boolean,
        require: true,
        default: false
    }
});

const User = mongoose.model<IUser>('User', UserSchema);
export { IUser, User };