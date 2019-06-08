"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var usuario_1 = require("../modelos/usuario");
var bcrypt_1 = __importDefault(require("bcrypt"));
var mail_1 = __importDefault(require("../funciones/mail"));
var authentication_1 = require("../middlewares/authentication");
var globales_1 = require("../funciones/globales");
var usuarioRoutes = express_1.Router();
//===================================================================
// Crear usuario
//===================================================================
usuarioRoutes.post('/', authentication_1.verificaToken, function (req, res) {
    var body = req.body;
    var admin = req.body.usuario;
    if (admin.role !== 'ADMIN_ROLE') {
        return res.status(401).json({
            ok: false,
            mensaje: 'Necesitas ser administrador para crear usuarios'
        });
    }
    var usuario = new usuario_1.Usuario({
        nombre: body.nombre,
        apellidoP: body.apellidoP,
        apellidoM: body.apellidoM,
        email: body.email,
        password: bcrypt_1.default.hashSync(body.password, 10)
    });
    usuario.save(function (err, usuarioSave) {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al guardar usuario',
                err: err
            });
        }
        usuario_1.Usuario.find({ role: 'ADMIN_ROLE' }, function (err, admins) {
            if (err) {
                console.log(err);
            }
            if (admins.length === 0) {
                console.log('No hay administradores para enviar Email');
            }
            for (var i = 0; i < admins.length; i++) {
                mail_1.default(admins[i].email, 'Nuevo usuario registrado', 'El usuario con email ' + body.email + ' se ha registrado, acceda al panel de control para activarlo');
            }
        });
        globales_1.guardarLog(req.method, req.originalUrl, admin._id, admin.email, req.ip, 'Registro de usuario nuevo').then(function (resultado) {
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
usuarioRoutes.put('/', authentication_1.verificaToken, function (req, res) {
    var id = req.headers.id;
    var body = req.body;
    var usuario = req.body.usuario;
    if (usuario._id !== id) {
        if (usuario.role !== "ADMIN_ROLE") {
            return res.status(401).json({
                ok: false,
                mensaje: 'No puedes modificar datos que no son tuyos',
                usuario: usuario
            });
        }
    }
    usuario_1.Usuario.findByIdAndUpdate(id, function (err, usuarioDB) {
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
        usuarioDB.save(function (err, usuarioActualizado) {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al actualizar usuario',
                    err: err
                });
            }
            globales_1.guardarLog(req.method, req.originalUrl, usuario._id, usuario.email, req.ip, 'Usuario actualizado');
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
usuarioRoutes.get('/', authentication_1.verificaToken, function (req, res) {
    var admin = req.body.usuario;
    if (admin.role !== 'ADMIN_ROLE') {
        return res.status(401).json({
            ok: false,
            mensaje: 'Necesitas ser administrador para acceder a esta seccion'
        });
    }
    usuario_1.Usuario.find({}, 'nombre apellidoP apellidoM email fcreate')
        .exec(function (err, usuariosDB) {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al recuperar usuarios de la base de datos',
                err: err
            });
        }
        if (usuariosDB.length === 0) {
            return res.status(404).json({
                ok: false,
                mensaje: 'No existen usuarios activos'
            });
        }
        globales_1.guardarLog(req.method, req.originalUrl, admin._id, admin.email, req.ip, 'Busqueda de usuarios');
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
usuarioRoutes.post('/buscar', authentication_1.verificaToken, function (req, res) {
    var admin = req.body.usuario;
    if (admin.role !== 'ADMIN_ROLE') {
        return res.status(401).json({
            ok: false,
            mensaje: 'Necesitas ser administrador para acceder a esta sección'
        });
    }
    var termino = req.headers.termino;
    var regex = new RegExp(termino, 'i');
    usuario_1.Usuario.find({ $or: [{ nombre: regex }, { apellidoP: regex }, { apellidoM: regex }, { email: regex }] }, 'id nombre apellidoP apellidoM email fcreate')
        .exec(function (err, usuarioEnc) {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error en base de datos al buscar usuario',
                err: err
            });
        }
        if (usuarioEnc.length === 0) {
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
usuarioRoutes.delete('/', authentication_1.verificaToken, function (req, res) {
    var id = req.headers.id;
    var admin = req.body.usuario;
    if (admin.role !== 'ADMIN_ROLE') {
        return res.status(401).json({
            ok: false,
            mensaje: 'Necesitas ser administrador para eliminar usuarios'
        });
    }
    if (admin._id === id) {
        return res.status(400).json({
            ok: false,
            mensaje: 'No puedes eliminarte a ti mismo'
        });
    }
    usuario_1.Usuario.findByIdAndDelete(id, function (err, usuarioEliminado) {
        if (err) {
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
        globales_1.guardarLog(req.method, req.originalUrl, admin._id, admin.email, req.ip, 'Usuario elimado');
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
usuarioRoutes.put('/activate', authentication_1.verificaToken, function (req, res) {
    var id = req.headers.id;
    var admin = req.body.usuario;
    if (admin.role !== 'ADMIN_ROLE') {
        return res.status(401).json({
            ok: false,
            mensaje: 'Necesitas permiso de administrador para activar usuarios'
        });
    }
    usuario_1.Usuario.findById(id, function (err, usuarioDB) {
        if (err) {
            globales_1.guardarLog(req.method, req.originalUrl, admin._id, admin.email, req.ip, 'Error al activar usuario');
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
        usuarioDB.save(function (err, usuarioActivado) {
            if (err) {
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
exports.default = usuarioRoutes;
