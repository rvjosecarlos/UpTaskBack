"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const db_1 = require("./config/db");
const dotenv_1 = __importDefault(require("dotenv"));
const routerAuth_1 = __importDefault(require("./routers/routerAuth"));
const routerProjects_1 = __importDefault(require("./routers/routerProjects"));
const cors_1 = __importDefault(require("cors"));
const corsOptions_1 = require("./config/corsOptions");
const morgan_1 = __importDefault(require("morgan"));
// Habilita las variables de entorno
dotenv_1.default.config();
// Conectar a MongoDB
(0, db_1.connectDB)();
const app = (0, express_1.default)();
// Habilita los logs de peticiones
app.use((0, morgan_1.default)('dev'));
// Habilita cors
app.use((0, cors_1.default)(corsOptions_1.corsOptions));
// Aceptar datos en formato JSON
app.use(express_1.default.json());
// Definir el router de proyectos y autenticación
app.use('/api/auth', routerAuth_1.default);
app.use('/api/projects', routerProjects_1.default);
exports.default = app;
//# sourceMappingURL=server.js.map