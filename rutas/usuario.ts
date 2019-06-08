import { Router, Request, Response } from 'express';
import { IUsuario } from '../interfaces/usuario';
import { Usuario } from '../modelos/usuario';
import bcrypt from 'bcrypt';
import sendEmail from '../funciones/mail';
import { verificaToken } from '../middlewares/authentication';
import { guardarLog } from '../funciones/globales';

const usuarioRoutes = Router();

//===================================================================
// Crear usuario
//===================================================================

usuarioRoutes.post('/', verificaToken, (req: Request, res: Response) => {
    const body: IUsuario = req.body;
    const admin = req.body.usuario;

    if ( admin.role !== 'ADMIN_ROLE' ) {
        return res.status(401).json({
            ok: false,
            mensaje: 'Necesitas ser administrador para crear usuarios'
        });
    }

    const usuario = new Usuario({
        nombre: body.nombre,
        apellidoP: body.apellidoP,
        apellidoM: body.apellidoM,
        email: body.email,
        password: bcrypt.hashSync( body.password, 10)
    });

    usuario.save((err, usuarioSave) => {
        if ( err ) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al guardar usuario',
                err: err
            });
        }

        Usuario.find( { role: 'ADMIN_ROLE'}, (err: any, admins) => {
            if ( err ) {
                console.log(err);
            }

            if ( admins.length === 0 ) {
                console.log('No hay administradores para enviar Email');
            }

            for( let i = 0; i < admins.length; i++ ) {
                sendEmail(admins[i].email, 'Nuevo usuario registrado', 
                'El usuario con email ' + body.email + ' se ha registrado, acceda al panel de control para activarlo');
            }
        });

        guardarLog(req.method, req.originalUrl, admin._id, admin.email, req.ip , 'Registro de usuario nuevo').then((resultado) => {
            console.log(resultado);
        });

        res.status(200).json({
            ok: true,
            mensaje: 'Usuario guardado',
            usuario: usuarioSave
        });
    });
});

//===================================================================
// Modificar usuario
//===================================================================

usuarioRoutes.put('/', verificaToken, (req: Request, res: Response) => {
    const id = req.headers.id;
    const body: IUsuario = req.body;
    const usuario = req.body.usuario;

    if ( usuario._id !== id ) {
        if ( usuario.role !== "ADMIN_ROLE" ){
            return res.status(401).json({
                ok: false,
                mensaje: 'No puedes modificar datos que no son tuyos',
                usuario: usuario
            });
        }
    }

    Usuario.findByIdAndUpdate(id, (err: any, usuarioDB: any) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al actualizar usuario',
                err: err
            });
        }

        if (!usuarioDB) {
            return res.status(401).json({
                ok: false,
                mensaje: 'El usuario no existe'
            });
        }

        usuarioDB.nombre = body.nombre;
        usuarioDB.apellidoP = body.apellidoP;
        usuarioDB.apellidoM = body.apellidoM;

        usuarioDB.save((err: any, usuarioActualizado: any) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al actualizar usuario',
                    err: err
                });
            }

            guardarLog(req.method, req.originalUrl, usuario._id, usuario.email, req.ip, 'Usuario actualizado');

            res.status(200).json({
                ok: true,
                mensaje: 'Usuario actualizado',
                usuario: usuarioActualizado
            });
        });
    });
});

//===================================================================
// Obtener usuarios
//===================================================================

usuarioRoutes.get('/', verificaToken, (req: Request, res: Response) => {
    const admin = req.body.usuario;

    if ( admin.role !== 'ADMIN_ROLE' ) {
        return res.status(401).json({
            ok: false,
            mensaje: 'Necesitas ser administrador para acceder a esta seccion'
        });
    }

    Usuario.find({}, 'nombre apellidoP apellidoM email fcreate')
            .exec( (err: any, usuariosDB) => {
                if ( err ) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error al recuperar usuarios de la base de datos',
                        err: err
                    });
                }

                if ( usuariosDB.length === 0 ) {
                    return res.status(404).json({
                        ok: false,
                        mensaje: 'No existen usuarios activos'
                    });
                }

                guardarLog(req.method, req.originalUrl, admin._id, admin.email, req.ip, 'Busqueda de usuarios');

                res.status(200).json({
                    ok: true,
                    usuarios: usuariosDB,
                    total: usuariosDB.length
                });
            });
});

//===================================================================
// Buscar usuarios
//===================================================================

usuarioRoutes.post('/buscar', verificaToken, (req: Request, res: Response) => {
    const admin = req.body.usuario;

    if ( admin.role !== 'ADMIN_ROLE' ) {
        return res.status(401).json({
            ok: false,
            mensaje: 'Necesitas ser administrador para acceder a esta sección'
        });
    }

    const termino: any = req.headers.termino;
    let regex = new RegExp( termino, 'i' );

    Usuario.find(
        { $or: [ {nombre: regex}, {apellidoP: regex}, {apellidoM: regex}, {email: regex} ] },
        'id nombre apellidoP apellidoM email fcreate')
        .exec((err: any, usuarioEnc) => {
            if ( err ) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error en base de datos al buscar usuario',
                    err: err
                });
            }

            if ( usuarioEnc.length === 0 ) {
                return res.status(404).json({
                    mensaje: 'No hay resutaldos para esta busqueda'
                });
            } 

            res.status(200).json({
                ok: true,
                resultados: usuarioEnc,
                total: usuarioEnc.length
            });
        });
});

//===================================================================
// Eliminar usuario
//===================================================================

usuarioRoutes.delete('/', verificaToken,(req: Request, res: Response) => {
    const id = req.headers.id;
    const admin = req.body.usuario;

    if ( admin.role !== 'ADMIN_ROLE' ) {
        return res.status(401).json({
            ok: false,
            mensaje: 'Necesitas ser administrador para eliminar usuarios'
        });
    }

    if ( admin._id === id ) {
        return res.status(400).json({
            ok: false,
            mensaje: 'No puedes eliminarte a ti mismo'
        });
    }

    Usuario.findByIdAndDelete(id, (err: any, usuarioEliminado) => {
        if ( err ) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Ocurrio un error al intentar eliminar usuario',
                err: err
            });
        }

        if (!usuarioEliminado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El usuario con el id: ' + id + ' no existe'
            });
        }

        guardarLog(req.method, req.originalUrl, admin._id, admin.email, req.ip, 'Usuario elimado');

        res.status(200).json({
            ok: true,
            mensaje: 'Usuario eliminado con exito',
            usuario: usuarioEliminado
        });
    });
});

//===================================================================
// Activar usuario
//===================================================================

usuarioRoutes.put('/activate', verificaToken, (req: Request, res: Response) => {
    const id = req.headers.id;
    const admin = req.body.usuario;

    if ( admin.role !== 'ADMIN_ROLE' ) {
        return res.status(401).json({
            ok: false,
            mensaje: 'Necesitas permiso de administrador para activar usuarios'
        });
    }

    Usuario.findById(id, (err: any, usuarioDB) => {
        if ( err ) {
            guardarLog(req.method, req.originalUrl, admin._id, admin.email, req.ip, 'Error al activar usuario');
            
            return res.status(500).json({
                ok: false,
                mensaje: 'Error en base de datos',
                err: err
            });
        }

        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No hay usuarios con ese ID'
            });
        }

        usuarioDB.status = 'activo';

        usuarioDB.save((err: any, usuarioActivado) => {
            if ( err ) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al activar usuario',
                    err: err
                });
            }

            res.status(200).json({
                ok: true,
                mensaje: 'Usuario actualizado',
                usuario: usuarioActivado
            });
        });
    });
});

export default usuarioRoutes;