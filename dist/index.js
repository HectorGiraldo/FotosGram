"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = __importDefault(require("./classes/server"));
const mongoose_1 = __importDefault(require("mongoose"));
const body_parser_1 = __importDefault(require("body-parser"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const cors_1 = __importDefault(require("cors"));
const post_1 = __importDefault(require("./routes/post"));
const usuario_1 = __importDefault(require("./routes/usuario"));
const server = new server_1.default();
// Body parse
server.app.use(body_parser_1.default.urlencoded({ extended: true }));
server.app.use(body_parser_1.default.json());
// FileUpload
server.app.use(express_fileupload_1.default());
// Configuracion CORS
server.app.use(cors_1.default({ origin: true, credentials: true }));
// Ruutas de mi app
server.app.use('/user', usuario_1.default);
server.app.use('/post', post_1.default);
// Conectar DB
mongoose_1.default.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/fotosgram', { useNewUrlParser: true, useCreateIndex: true }, (err) => {
    if (err)
        throw err;
    console.log('base de datos ONLINE');
});
// Levantar Express
server.start(() => {
    console.log(`Servidor corriendo en puerto ${server.port}`);
});
