import Server from "./classes/server";
import mongoose from 'mongoose';
import bodyParser  from "body-parser";
import fileUpload from "express-fileupload";
import cors from "cors"

import postRoutes from "./routes/post";
import userRoutes from "./routes/usuario";


const server = new Server();

// Body parse
server.app.use( bodyParser.urlencoded({ extended: true}));
server.app.use( bodyParser.json() );

// FileUpload
server.app.use( fileUpload());

// Configuracion CORS
server.app.use( cors({ origin: true, credentials: true}));

// Ruutas de mi app
server.app.use('/user', userRoutes);
server.app.use('/post', postRoutes);


// Conectar DB
mongoose.connect( process.env.MONGO_URI || 'mongodb://localhost:27017/fotosgram', {useNewUrlParser: true, useCreateIndex: true}, (err) => {
    if (err) throw err;
    console.log('base de datos ONLINE');
    
});

// Levantar Express
server.start(()=>{
    console.log(`Servidor corriendo en puerto ${server.port}`);
    
});