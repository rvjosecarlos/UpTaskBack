import { ObjectId } from "mongoose";
type TGenerateJWT = {
    id: ObjectId;
};
export declare const generateJWT: (payload: TGenerateJWT) => string;
export {};
