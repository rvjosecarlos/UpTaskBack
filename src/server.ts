import express from "express";
import { connectDB } from "./config/db";
import dotenv from "dotenv";
import authRouter from "./routers/routerAuth";
import projectRouter from "./routers/routerProjects";
import cors from "cors";
import { corsOptions } from "./config/corsOptions";
import morgan from "morgan";

// Habilita las variables de entorno
dotenv.config();

// Conectar a MongoDB
connectDB();

const app = express();

// Habilita los logs de peticiones
app.use(morgan('dev'));

// Habilita cors
app.use(cors(corsOptions));

// Aceptar datos en formato JSON
app.use(express.json());

// Definir el router de proyectos y autenticación
app.use('/api/auth', authRouter);
app.use('/api/projects', projectRouter);

export default app;