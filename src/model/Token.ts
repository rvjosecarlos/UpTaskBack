import mongoose, { Schema, Document, Types, mongo } from "mongoose";

interface IToken extends Document {
    token: string,
    user: Types.ObjectId,
    createAt: Date
};

const TokenSchema: Schema = new Schema({
    token: {
        type: String,
        required: true
    },
    user: {
        type: Types.ObjectId,
        ref: 'User',
        required: true
    },
    createAt: {
        type: Date,
        required: true,
        default: Date.now,
        expires: "10m"
    }
});

const Token = mongoose.model<IToken>('Token', TokenSchema);
export {Token, IToken};