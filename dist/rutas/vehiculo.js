"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var vehiculo_1 = require("../modelos/vehiculo");
var server_1 = __importDefault(require("../clases/server"));
var authentication_1 = require("../middlewares/authentication");
var globales_1 = require("../funciones/globales");
var userRole = 'USER_ROLE';
var adminRole = 'ADMIN_ROLE';
var sudoRole = 'SUDO_ROLE';
var server = server_1.default.instance;
var vehRoutes = express_1.Router();
//===================================================================
// Crear vehiculo
//===================================================================
vehRoutes.post('/', authentication_1.verificaToken, function (req, res) {
    var body = req.body;
    var user = req.body.usuario;
    if (user.role !== 'ADMIN_ROLE') {
        return res.status(500).json({
            ok: false,
            mensaje: 'Necesitas permisos de administrador para registrar vehiculos'
        });
    }
    var vehiculo = new vehiculo_1.Vehiculo({
        tipo: body.tipo,
        siglas: body.siglas,
        sitio: body.sitio,
        ubicacion: body.ubicacion
    });
    vehiculo.save(function (err, vehGuardado) {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al registrar vehiculo',
                err: err
            });
        }
        globales_1.guardarLog(req.method, req.originalUrl, user._id, user.email, req.ip, 'Registro de vehiculo nuevo').then(function (resultado) {
            console.log(resultado);
            server.io.emit('nuevoVehiculo', vehGuardado);
            res.status(200).json({
                ok: true,
                mensaje: 'Vehiculo guardado',
                vehiculo: vehGuardado
            });
        });
    });
});
//===================================================================
// Ver vehiculos
//===================================================================
vehRoutes.get('/', authentication_1.verificaToken, function (req, res) {
    vehiculo_1.Vehiculo.find({})
        .exec(function (err, vehiculos) {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar vehiculos',
                err: err
            });
        }
        res.status(200).json({
            ok: true,
            vehiculos: vehiculos
        });
    });
});
//===================================================================
// Modificar vehiculo
//===================================================================
vehRoutes.put('/:id', authentication_1.verificaToken, function (req, res) {
    var id = req.params.id;
    var body = req.body;
    var usuario = req.body.usuario;
    if (usuario.role !== 'ADMIN_ROLE') {
        return res.status(500).json({
            ok: false,
            mensaje: 'Necesitas permisos de administrador para registrar vehiculos'
        });
    }
    vehiculo_1.Vehiculo.findByIdAndUpdate(id, body, { new: true }, function (err, vehActualizado) {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error en base de datos al actualizar vehiculo'
            });
        }
        res.status(200).json({
            ok: true,
            mensaje: 'Vehiculo actualizado correctamente',
            vehiculo: vehActualizado
        });
    });
});
//===================================================================
// Eliminar vehiculo
//===================================================================
vehRoutes.delete('/', authentication_1.verificaToken, function (req, res) {
});
//===================================================================
// Buscar vehiculo por id
//===================================================================
vehRoutes.get('/buscar/:id', authentication_1.verificaToken, function (req, res) {
    var id = req.params.id;
    vehiculo_1.Vehiculo.findById(id, function (err, vehiculo) {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar vehiculo',
                err: err
            });
        }
        res.status(200).json({
            ok: true,
            mensaje: 'Vehiculo encontrado',
            vehiculo: vehiculo
        });
    });
});
//===================================================================
// Buscar vehiculo por id
//===================================================================
vehRoutes.post('/buscar', authentication_1.verificaToken, function (req, res) {
    var termino = req.body.termino;
    var regex = new RegExp(termino, 'i');
    vehiculo_1.Vehiculo.find({ $or: [{ tipo: regex }, { siglas: regex }, { sitio: regex }, { ubicacion: regex }] }).exec(function (err, vehEncontrado) {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error en base de datos',
                err: err
            });
        }
        if (vehEncontrado.length === 0) {
            return res.status(404).json({
                ok: false,
                mensaje: 'No hay resultados para esta busqueda'
            });
        }
        res.status(200).json({
            ok: true,
            resultados: vehEncontrado
        });
    });
});
exports.default = vehRoutes;
