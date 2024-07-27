import jwt from "jsonwebtoken";
import { ObjectId } from "mongoose";

type TGenerateJWT = {
    id: ObjectId
};

export const generateJWT = ( payload : TGenerateJWT) => {
    const jwToken = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "180d"
    });
    return jwToken;
};