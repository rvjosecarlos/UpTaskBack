"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NoteController = void 0;
const colors_1 = __importDefault(require("colors"));
const note_1 = require("../model/note");
class NoteController {
    static getNotes = async (req, res) => {
        try {
            const notes = await note_1.Note.find({ task: req.task.id });
            res.status(200).json(notes);
        }
        catch (error) {
            console.log(colors_1.default.red.bold(error.message));
            return res.status(500).json({ error: 'Error en el servidor' });
        }
    };
    static addNote = async (req, res) => {
        try {
            const newNote = new note_1.Note();
            newNote.content = req.body.content;
            newNote.createdBy = req.user.id;
            newNote.task = req.task.id;
            req.task.notes.push(newNote.id);
            await Promise.allSettled([newNote.save(), req.task.save()]);
            res.send('Nota creada');
        }
        catch (error) {
            console.log(colors_1.default.red.bold(error.message));
            return res.status(500).json({ error: 'Error en el servidor' });
        }
    };
    static deleteNote = async (req, res) => {
        try {
            const oldNote = await note_1.Note.findById(req.params.noteId);
            if (!oldNote) {
                const error = new Error('Nota no encontrada');
                return res.status(404).json({ error: error.message });
            }
            ;
            if (req.user.id.toString() !== oldNote.createdBy.toString()) {
                const error = new Error('Acción no válida');
                return res.status(401).json({ error: error.message });
            }
            ;
            req.task.notes = req.task.notes.filter(note => note.toString() !== oldNote.id.toString());
            await Promise.allSettled([oldNote.deleteOne(), req.task.save()]);
            res.send('Nota eliminada');
        }
        catch (error) {
            console.log(colors_1.default.red.bold(error.message));
            return res.status(500).json({ error: 'Error en el servidor' });
        }
    };
}
exports.NoteController = NoteController;
//# sourceMappingURL=NoteController.js.map