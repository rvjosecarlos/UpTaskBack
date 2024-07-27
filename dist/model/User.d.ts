import mongoose, { Document } from "mongoose";
interface IUser extends Document {
    name: string;
    password: string;
    email: string;
    confirmed: boolean;
}
declare const User: mongoose.Model<IUser, {}, {}, {}, mongoose.Document<unknown, {}, IUser> & IUser & Required<{
    _id: unknown;
}>, any>;
export { IUser, User };
