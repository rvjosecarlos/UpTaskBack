"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ProjectController_1 = require("../controller/ProjectController");
const express_validator_1 = require("express-validator");
const validacionGeneralRequest_1 = require("../midlewares/validacionGeneralRequest");
const TaskController_1 = require("../controller/TaskController");
const validaProyecto_1 = require("../midlewares/validaProyecto");
const validaTarea_1 = require("../midlewares/validaTarea");
const auth_1 = require("../midlewares/auth");
const TeamMemberController_1 = require("../controller/TeamMemberController");
const NoteController_1 = require("../controller/NoteController");
const router = (0, express_1.Router)();
router.use(auth_1.authentication);
/* ### Endpoint para la colección de proyectos ### */
// Endpoint para crear un proyecto
router.post('/', (0, express_validator_1.body)("projectName")
    .notEmpty()
    .withMessage('El nombre del proyecto no debe estar vacío'), (0, express_validator_1.body)("clientName")
    .notEmpty()
    .withMessage('El nombre del cliente no debe estar vacío'), (0, express_validator_1.body)("description")
    .notEmpty()
    .withMessage('La descripción no debe estar vacía'), validacionGeneralRequest_1.handleInputErrors, ProjectController_1.ProjectController.createProject);
// Endpoint para obtener todos los proyectos
router.get('/', ProjectController_1.ProjectController.getAllProjects);
// Endpoint para obtener un proyecto por ID
router.get('/:id', (0, express_validator_1.param)("id")
    .isMongoId().withMessage('ID no válido'), validacionGeneralRequest_1.handleInputErrors, ProjectController_1.ProjectController.getProjectById);
// Validar que el proyecto exita
router.param('projectId', validaProyecto_1.validateProjectExist);
// Endpoint para actualizar un proyecto
router.put('/:projectId', (0, express_validator_1.param)("projectId")
    .isMongoId().withMessage('ID no válido'), (0, express_validator_1.body)("projectName")
    .notEmpty()
    .withMessage('El nombre del proyecto no debe estar vacío'), (0, express_validator_1.body)("clientName")
    .notEmpty()
    .withMessage('El nombre del cliente no debe estar vacío'), (0, express_validator_1.body)("description")
    .notEmpty()
    .withMessage('La descripción no debe estar vacía'), validaTarea_1.hasAuthorization, validacionGeneralRequest_1.handleInputErrors, ProjectController_1.ProjectController.updateProject);
// Endpoint para eliminar un proyecto por ID
router.delete('/:projectId', (0, express_validator_1.param)("projectId")
    .isMongoId().withMessage('ID no válido'), validaTarea_1.hasAuthorization, validacionGeneralRequest_1.handleInputErrors, ProjectController_1.ProjectController.deleteProject);
/* ### Endpoint para la colección de Tareas ### */
// Valida que el parametro exista antes de ejecutar algún verbo
router.param('projectId', (0, express_validator_1.param)('projectId').isMongoId().withMessage('projectId no válido'));
router.param('projectId', validacionGeneralRequest_1.handleInputErrors);
// Endpoint para crear una tarea
router.post('/:projectId/task', validaTarea_1.hasAuthorization, (0, express_validator_1.body)("name")
    .notEmpty()
    .withMessage('El nombre del tarea no debe estar vacío'), (0, express_validator_1.body)("description")
    .notEmpty()
    .withMessage('La descripción no debe estar vacía'), validacionGeneralRequest_1.handleInputErrors, TaskController_1.TaskController.createTask);
// Endpoint para obtener todas las tareas de un proyecto
router.get('/:projectId/tasks', TaskController_1.TaskController.getTasks);
// Valida que la tarea exista
router.param('taskId', (0, express_validator_1.param)('taskId').isMongoId().withMessage('taskId no válido'));
router.param('taskId', validacionGeneralRequest_1.handleInputErrors);
router.param('taskId', validaTarea_1.validateTaskExist);
router.param('taskId', validaTarea_1.taskBelongsToProject);
// Endpoint para obtener una tarea por medio del ID
router.get('/:projectId/tasks/:taskId', TaskController_1.TaskController.getTaskById);
// Endpoint para actualizar una tarea
router.put('/:projectId/tasks/:taskId', validaTarea_1.hasAuthorization, (0, express_validator_1.body)('name')
    .notEmpty().withMessage('El nombre de la tarea es obligatorio'), (0, express_validator_1.body)('description')
    .notEmpty().withMessage('La descripción de la tarea es obligatoria'), validacionGeneralRequest_1.handleInputErrors, TaskController_1.TaskController.updateTask);
// Endpoint para eliminar una tarea
router.delete('/:projectId/tasks/:taskId', validaTarea_1.hasAuthorization, TaskController_1.TaskController.deleteTask);
// Endpoint para actualizar el estado de la tarea
router.patch('/:projectId/tasks/:taskId', (0, express_validator_1.body)('taskStatus')
    .notEmpty().withMessage('El taskStatus es obligatorio'), TaskController_1.TaskController.updateTaskStatus);
/* ### Endpoint para los colaboradores ### */
// Endpoint para buscar colaborador por email
router.post('/:projectId/team/find', (0, express_validator_1.body)('email')
    .isEmail().toLowerCase().withMessage('E-mail no válido'), validacionGeneralRequest_1.handleInputErrors, TeamMemberController_1.TeamMemberController.findMemberByEmail);
// Endpoint para agregar colaboradores
router.post('/:projectId/team', (0, express_validator_1.body)('id')
    .isMongoId().withMessage('Id no válido'), validacionGeneralRequest_1.handleInputErrors, TeamMemberController_1.TeamMemberController.addMember);
// Endpoint para eliminar colaboradores
router.delete('/:projectId/team/:userId', (0, express_validator_1.param)('userId')
    .isMongoId().withMessage('Id no válido'), validacionGeneralRequest_1.handleInputErrors, TeamMemberController_1.TeamMemberController.removeMemberById);
// Endpoint para obtener todos los colaborares
router.get('/:projectId/team', TeamMemberController_1.TeamMemberController.getTeam);
/* ### Rutas para las Notas ### */
// Endpoint para obtener las notas
router.get('/:projectId/tasks/:taskId/notes', NoteController_1.NoteController.getNotes);
// Endpoint para crear notas
router.post('/:projectId/tasks/:taskId/notes', (0, express_validator_1.body)('content').notEmpty().withMessage('Debe especificar una descripción'), validacionGeneralRequest_1.handleInputErrors, NoteController_1.NoteController.addNote);
// Endpoint para eliminar notas
router.delete('/:projectId/tasks/:taskId/notes/:noteId', (0, express_validator_1.param)('noteId').notEmpty().withMessage('Debe especifircar el id de la nota'), validacionGeneralRequest_1.handleInputErrors, NoteController_1.NoteController.deleteNote);
exports.default = router;
//# sourceMappingURL=routerProjects.js.map