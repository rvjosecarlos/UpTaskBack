import { Request, Response } from "express";
import colors from "colors";
import { INote, Note } from "../model/note";

export class NoteController {

    static getNotes = async ( req: Request, res: Response ) => {
        try{
            const notes = await Note.find({ task: req.task.id });
            res.status(200).json(notes);
        }
        catch(error){
            console.log(colors.red.bold(error.message));
            return res.status(500).json({ error: 'Error en el servidor' });
        }
    };

    static addNote = async ( req: Request<{},{},INote>, res: Response ) => {
        try{
            const newNote = new Note();
            newNote.content = req.body.content;
            newNote.createdBy = req.user.id;
            newNote.task = req.task.id;

            req.task.notes.push(newNote.id);

            await Promise.allSettled([ newNote.save(), req.task.save() ]);

            res.send('Nota creada');
        }
        catch(error){
            console.log(colors.red.bold(error.message));
            return res.status(500).json({ error: 'Error en el servidor' });
        }
    };

    static deleteNote = async ( req: Request, res: Response ) => {
        try{
            const oldNote = await Note.findById(req.params.noteId);

            if( !oldNote ){
                const error = new Error('Nota no encontrada');
                return res.status(404).json({ error: error.message });
            };

            if( req.user.id.toString() !== oldNote.createdBy.toString() ){
                const error = new Error('Acción no válida');
                return res.status(401).json({ error: error.message });
            };

            req.task.notes = req.task.notes.filter( note => note.toString() !== oldNote.id.toString() );

            await Promise.allSettled([ oldNote.deleteOne(), req.task.save() ]);

            res.send('Nota eliminada');
        }
        catch(error){
            console.log(colors.red.bold(error.message));
            return res.status(500).json({ error: 'Error en el servidor' });
        }
    };  
}