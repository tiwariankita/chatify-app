import mongoose from 'mongoose';
import { ENV } from './env.js'

export const connectDB = async () => {
    try {
        const conn = await mongoose.connect(ENV.MONGO_URI);
        console.log("MONGODB connected:", conn.connection.host);
    } catch (error) {
        console.error("Error connecting to MONGODB", error);
        process.exit(1) // error code is 1, success - 0
    } 
}