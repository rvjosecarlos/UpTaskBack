import { Request, Response } from "express";
import colors from "colors";
import { User } from "../model/User";
import { Proyecto } from "../model/Project";

export class TeamMemberController {
    static findMemberByEmail = async ( req: Request, res: Response ) => {
        try{
            const userMember = await User.findOne({ email: req.body.email }).select('id email name');
            if( !userMember ){
                const error =  new Error('Usuario no encontrado');
                return res.status(404).json({ error: error.message });
            };

            res.status(200).json(userMember);
        }
        catch(error){
            console.log(colors.red.bold(error.message));
            return res.status(500).json({ error: 'Error en el servidor' });
        }
    };

    static addMember = async ( req: Request, res: Response ) => {
        try{    
            const userMember = await User.findById(req.body.id).select('id');
            if( !userMember ){
                const error =  new Error('Usuario no encontrado');
                return res.status(404).json({ error: error.message });
            };

            if( userMember.id.toString() === req.project.manager.toString() ){
                const error = new Error('El creador del proyecto ya es colaborador');
                return res.status(409).json({ error: error.message });
            };

            if( req.project.team.some( member => member.toString() === userMember.id.toString() ) ){
                const error = new Error('El usuario ya existe en el proyecto');
                return res.status(409).json({ error: error.message });
            };

            req.project.team.push(userMember.id);
            await req.project.save();

            res.send('Usuario agregado');
        }
        catch( error ){
            console.log(colors.red.bold(error.message));
            return res.status(500).json({ error: 'Error en el servidor' });
        }
    };

    static removeMemberById = async ( req: Request, res: Response ) => {
        try{
            const userMember = await User.findById(req.params.userId);
            if( !userMember ){
                const error = new Error('Usuario no encontrado');
                return res.status(404).json({ error: error.message });
            };

            if( !req.project.team.some( member => member.toString() === userMember.id.toString()) ){
                const error = new Error('Usuario no existe en el proyecto');
                return res.status(404).json({ error: error.message });
            };

            req.project.team = req.project.team.filter( member => member.toString() !== userMember.id.toString() );
            await req.project.save();

            res.send('Usuario quitado del proyecto');
        }
        catch(error){
            console.log(colors.red.bold(error.message));
            return res.status(500).json({ error: 'Error en el servidor' });
        }
    };

    static getTeam = async ( req: Request, res: Response ) => {
        try{
            const project = await Proyecto.findById(req.project.id).populate({
                path: 'team',
                select: 'id email name'
            });
            if( !project ){
                const error = new Error('Proyecto no encontrado');
                return res.status(404).json({ error: error.message });
            }
            res.status(200).json(project.team);
        }
        catch(error){
            console.log(colors.red.bold(error.message));
            return res.status(500).json({ error: 'Error en el servidor' });
        }
    };
}