import { Router, Request, Response } from "express";
import { Usuario } from '../models/usuario.model';
import bcrypt from "bcrypt";
import Token from "../classes/token";
import { verificaToken } from "../middlewares/autenticacion";



const userRoutes = Router();

// login
userRoutes.post('/login', ( req: Request, res: Response) => {
    
    const body = req.body;
    Usuario.findOne({ email: body.email}, (err, userDB)=> {
        if (err) throw err;
        if (!userDB) {
            return res.status(400).json({
                ok: false,
                message: 'Usuario o contraseña no son correctos'
            });
        }

        if ( userDB.compararPassword(body.password)) {

            const tokenUser = Token.getJwtToken({
                _id: userDB._id,
                nombre: userDB.nombre,
                email: userDB.email,
                avatar: userDB.avatar
            });

            res.json({
                ok: true,
                token: tokenUser
            });
        } else {
            return res.status(400).json({
                ok: false,
                message: 'Usuario o contraseña no son correctos ****'
            });
        }

    });
});


// Crear un usuario
userRoutes.post('/create', ( req: Request, res: Response)=> {   

    const user = {
        nombre    : req.body.nombre,
        email     : req.body.email,
        password  : bcrypt.hashSync(req.body.password, 10),
        avatar    : req.body.avatar
    }
    
    Usuario.create( user ).then( userDB => {
        
        const tokenUser = Token.getJwtToken({
                _id: userDB._id,
                nombre: userDB.nombre,
                email: userDB.email,
                avatar: userDB.avatar
            });

            res.json({
                ok: true,
                token: tokenUser
            });  
        }).catch( err => {
            res.status(409).json({
                ok: false,
                err
            });
        });
});


    // Actualizar usuario

    userRoutes.put('/update', verificaToken, ( req: any, res: Response)=> {

        const body = req.body;

        const user = {
            nombre: body.nombre || req.usuario.nombre,
            email: body.email || req.usuario.email,
            avatar: body.avatar || req.usuario.avatar
        }

        Usuario.findByIdAndUpdate( req.usuario._id, user, { new: true }, (err, userDB) => {
            if ( err ) throw err;

            if( !userDB ) {
                return res.status(400).json({
                    ok: false,
                    message: 'No existe un usuario con ese ID'
                });
            }

            const tokenUser = Token.getJwtToken({
                _id: userDB._id,
                nombre: userDB.nombre,
                email: userDB.email,
                avatar: userDB.avatar
            });

            res.json({
                ok: true,
                token: tokenUser
            }); 
        });

        
    });

userRoutes.get('/', verificaToken, (req: any, res: Response) => {
    const usuario = req.usuario

    res.json({
        ok: true,
        usuario
    });
});

   



export default userRoutes;