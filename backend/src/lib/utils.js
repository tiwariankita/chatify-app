import jwt from "jsonwebtoken";
import { ENV } from "./env.js";

export const generateToken = (userId, res) => {
    const token = jwt.sign(  // sign(payload, secretkey, options) -> function def
        {userId: userId},
        ENV.JWT_SECRET,
        {
           expiresIn: "7d"
        }
    );

    // res.cookie(name, value, options)
    res.cookie("jwt", token, {
        maxAge: 7 * 24 * 60 * 60 * 1000, // in ms
        httpOnly: true, // prevent XSS attacks: cross-site scripting, token available only via http
        sameSite: "strict", // CSRF attacks
        secure: ENV.NODE_ENV === "development" ? false : true, // https
      });
    
}