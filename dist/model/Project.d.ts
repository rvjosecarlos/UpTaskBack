import mongoose, { Document, PopulatedDoc } from "mongoose";
import { ITask } from "./task";
import { IUser } from "./User";
interface IProject extends Document {
    projectName: string;
    clientName: string;
    description: string;
    tasks: PopulatedDoc<ITask & Document>[];
    manager: PopulatedDoc<IUser & Document>;
    team: PopulatedDoc<IUser & Document>[];
}
declare const Proyecto: mongoose.Model<IProject, {}, {}, {}, mongoose.Document<unknown, {}, IProject> & IProject & Required<{
    _id: unknown;
}>, any>;
export { Proyecto, IProject };
