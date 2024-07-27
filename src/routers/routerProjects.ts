import { Router } from "express";
import { ProjectController } from "../controller/ProjectController";
import { body, param } from "express-validator";
import { handleInputErrors } from "../midlewares/validacionGeneralRequest";
import { TaskController } from "../controller/TaskController";
import { validateProjectExist } from "../midlewares/validaProyecto";
import { hasAuthorization, taskBelongsToProject, validateTaskExist } from "../midlewares/validaTarea";
import { authentication } from "../midlewares/auth";
import { TeamMemberController } from "../controller/TeamMemberController";
import { NoteController } from "../controller/NoteController";

const router = Router();

router.use(authentication);

/* ### Endpoint para la colección de proyectos ### */
// Endpoint para crear un proyecto
router.post('/', 
    body("projectName")
        .notEmpty()
        .withMessage('El nombre del proyecto no debe estar vacío'),
    body("clientName")
        .notEmpty()
        .withMessage('El nombre del cliente no debe estar vacío'),
    body("description")
        .notEmpty()
        .withMessage('La descripción no debe estar vacía'),
    handleInputErrors,
    ProjectController.createProject
);

// Endpoint para obtener todos los proyectos
router.get('/', ProjectController.getAllProjects);

// Endpoint para obtener un proyecto por ID
router.get('/:id', 
    param("id")
        .isMongoId().withMessage('ID no válido'),
    handleInputErrors,
    ProjectController.getProjectById
);

// Validar que el proyecto exita
router.param('projectId', validateProjectExist);

// Endpoint para actualizar un proyecto
router.put('/:projectId', 
    param("projectId")
        .isMongoId().withMessage('ID no válido'),
    body("projectName")
        .notEmpty()
        .withMessage('El nombre del proyecto no debe estar vacío'),
    body("clientName")
        .notEmpty()
        .withMessage('El nombre del cliente no debe estar vacío'),
    body("description")
        .notEmpty()
        .withMessage('La descripción no debe estar vacía'),
    hasAuthorization,
    handleInputErrors,
    ProjectController.updateProject
);

// Endpoint para eliminar un proyecto por ID
router.delete('/:projectId', 
    param("projectId")
        .isMongoId().withMessage('ID no válido'),
    hasAuthorization,
    handleInputErrors,
    ProjectController.deleteProject
);

/* ### Endpoint para la colección de Tareas ### */
// Valida que el parametro exista antes de ejecutar algún verbo
router.param('projectId', param('projectId').isMongoId().withMessage('projectId no válido'));
router.param('projectId', handleInputErrors);

// Endpoint para crear una tarea
router.post('/:projectId/task',
    hasAuthorization,
    body("name")
        .notEmpty()
        .withMessage('El nombre del tarea no debe estar vacío'),
    body("description")
        .notEmpty()
        .withMessage('La descripción no debe estar vacía'),
    handleInputErrors,    
    TaskController.createTask
);

// Endpoint para obtener todas las tareas de un proyecto
router.get('/:projectId/tasks', TaskController.getTasks);

// Valida que la tarea exista
router.param('taskId', param('taskId').isMongoId().withMessage('taskId no válido'));
router.param('taskId', handleInputErrors);
router.param('taskId', validateTaskExist);
router.param('taskId', taskBelongsToProject);

// Endpoint para obtener una tarea por medio del ID
router.get('/:projectId/tasks/:taskId', TaskController.getTaskById );

// Endpoint para actualizar una tarea
router.put('/:projectId/tasks/:taskId',
    hasAuthorization,
    body('name')
        .notEmpty().withMessage('El nombre de la tarea es obligatorio'),
    body('description')
        .notEmpty().withMessage('La descripción de la tarea es obligatoria'),
    handleInputErrors,
    TaskController.updateTask
);

// Endpoint para eliminar una tarea
router.delete('/:projectId/tasks/:taskId', 
    hasAuthorization,
    TaskController.deleteTask
);

// Endpoint para actualizar el estado de la tarea
router.patch('/:projectId/tasks/:taskId', 
    body('taskStatus')
        .notEmpty().withMessage('El taskStatus es obligatorio'),
    TaskController.updateTaskStatus
);

/* ### Endpoint para los colaboradores ### */
// Endpoint para buscar colaborador por email
router.post('/:projectId/team/find',
    body('email')
        .isEmail().toLowerCase().withMessage('E-mail no válido'),
    handleInputErrors,
    TeamMemberController.findMemberByEmail
);

// Endpoint para agregar colaboradores
router.post('/:projectId/team',
    body('id')
        .isMongoId().withMessage('Id no válido'),
    handleInputErrors,
    TeamMemberController.addMember
);

// Endpoint para eliminar colaboradores
router.delete('/:projectId/team/:userId', 
    param('userId')
        .isMongoId().withMessage('Id no válido'),
    handleInputErrors,
    TeamMemberController.removeMemberById
);

// Endpoint para obtener todos los colaborares
router.get('/:projectId/team',
    TeamMemberController.getTeam
);

/* ### Rutas para las Notas ### */
// Endpoint para obtener las notas
router.get('/:projectId/tasks/:taskId/notes',
    NoteController.getNotes
);

// Endpoint para crear notas
router.post('/:projectId/tasks/:taskId/notes',
    body('content').notEmpty().withMessage('Debe especificar una descripción'),
    handleInputErrors,
    NoteController.addNote
);

// Endpoint para eliminar notas
router.delete('/:projectId/tasks/:taskId/notes/:noteId',
    param('noteId').notEmpty().withMessage('Debe especifircar el id de la nota'),
    handleInputErrors,
    NoteController.deleteNote
);

export default router;