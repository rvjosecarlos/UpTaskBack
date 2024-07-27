import mongoose, { Document, Types } from "mongoose";
interface IToken extends Document {
    token: string;
    user: Types.ObjectId;
    createAt: Date;
}
declare const Token: mongoose.Model<IToken, {}, {}, {}, mongoose.Document<unknown, {}, IToken> & IToken & Required<{
    _id: unknown;
}>, any>;
export { Token, IToken };
