"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeamMemberController = void 0;
const colors_1 = __importDefault(require("colors"));
const User_1 = require("../model/User");
const Project_1 = require("../model/Project");
class TeamMemberController {
    static findMemberByEmail = async (req, res) => {
        try {
            const userMember = await User_1.User.findOne({ email: req.body.email }).select('id email name');
            if (!userMember) {
                const error = new Error('Usuario no encontrado');
                return res.status(404).json({ error: error.message });
            }
            ;
            res.status(200).json(userMember);
        }
        catch (error) {
            console.log(colors_1.default.red.bold(error.message));
            return res.status(500).json({ error: 'Error en el servidor' });
        }
    };
    static addMember = async (req, res) => {
        try {
            const userMember = await User_1.User.findById(req.body.id).select('id');
            if (!userMember) {
                const error = new Error('Usuario no encontrado');
                return res.status(404).json({ error: error.message });
            }
            ;
            if (userMember.id.toString() === req.project.manager.toString()) {
                const error = new Error('El creador del proyecto ya es colaborador');
                return res.status(409).json({ error: error.message });
            }
            ;
            if (req.project.team.some(member => member.toString() === userMember.id.toString())) {
                const error = new Error('El usuario ya existe en el proyecto');
                return res.status(409).json({ error: error.message });
            }
            ;
            req.project.team.push(userMember.id);
            await req.project.save();
            res.send('Usuario agregado');
        }
        catch (error) {
            console.log(colors_1.default.red.bold(error.message));
            return res.status(500).json({ error: 'Error en el servidor' });
        }
    };
    static removeMemberById = async (req, res) => {
        try {
            const userMember = await User_1.User.findById(req.params.userId);
            if (!userMember) {
                const error = new Error('Usuario no encontrado');
                return res.status(404).json({ error: error.message });
            }
            ;
            if (!req.project.team.some(member => member.toString() === userMember.id.toString())) {
                const error = new Error('Usuario no existe en el proyecto');
                return res.status(404).json({ error: error.message });
            }
            ;
            req.project.team = req.project.team.filter(member => member.toString() !== userMember.id.toString());
            await req.project.save();
            res.send('Usuario quitado del proyecto');
        }
        catch (error) {
            console.log(colors_1.default.red.bold(error.message));
            return res.status(500).json({ error: 'Error en el servidor' });
        }
    };
    static getTeam = async (req, res) => {
        try {
            const project = await Project_1.Proyecto.findById(req.project.id).populate({
                path: 'team',
                select: 'id email name'
            });
            if (!project) {
                const error = new Error('Proyecto no encontrado');
                return res.status(404).json({ error: error.message });
            }
            res.status(200).json(project.team);
        }
        catch (error) {
            console.log(colors_1.default.red.bold(error.message));
            return res.status(500).json({ error: 'Error en el servidor' });
        }
    };
}
exports.TeamMemberController = TeamMemberController;
//# sourceMappingURL=TeamMemberController.js.map