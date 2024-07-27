import mongoose from "mongoose";
import colors from "colors";
import { exit } from "node:process";

const connectDB = async () => {
    try{
        const { connection } = await mongoose.connect(process.env.DATABASE_URL);
        const urlConnection = `MongoDB conectado: ${connection.host}:${connection.port}`;
        console.log(colors.magenta.bold(urlConnection));
    }
    catch(error){
        console.log(colors.red.bold('Error al conectar con MongoDB'));
        console.error(error.message);
        exit(1);
    }
};

export { connectDB };