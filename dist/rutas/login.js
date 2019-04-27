"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var usuario_1 = require("../modelos/usuario");
var environment_1 = require("../global/environment");
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var bcrypt_1 = __importDefault(require("bcrypt"));
var globales_1 = require("../funciones/globales");
var loginRoutes = express_1.Router();
//===================================================================
// login de usuario
//===================================================================
loginRoutes.post('/', function (req, res) {
    var body = req.body;
    usuario_1.Usuario.findOne({ email: body.email }, function (err, usuarioDB) {
        if (err) {
            globales_1.guardarLog(req.method, req.originalUrl, 'Sin ID', body.email, req.ip, 'Error en base de datos al loguear usuario');
            return res.status(500).json({
                ok: false,
                mensaje: 'Error en la base de datos al intentar loguearse',
                err: err
            });
        }
        if (!usuarioDB) {
            globales_1.guardarLog(req.method, req.originalUrl, 'Sin ID', body.email, req.ip, 'Error en email');
            return res.status(404).json({
                ok: false,
                mensaje: 'Usuario o contraseña invalidos'
            });
        }
        if (usuarioDB.status !== 'activo') {
            return res.status(401).json({
                ok: false,
                mensaje: 'Usuario desactivado'
            });
        }
        if (!bcrypt_1.default.compareSync(body.password, usuarioDB.password)) {
            globales_1.guardarLog(req.method, req.originalUrl, 'Sin ID', body.email, req.ip, 'Error en contraseña');
            return res.status(401).json({
                ok: false,
                mensaje: 'Usuario o contraseña invalidos'
            });
        }
        var token = jsonwebtoken_1.default.sign({ usuario: usuarioDB }, environment_1.SEED, { expiresIn: 14400 });
        usuarioDB.password = 'XD';
        globales_1.guardarLog(req.method, req.originalUrl, usuarioDB._id, usuarioDB.email, req.ip, 'Logueo de usuario exitoso');
        res.status(200).json({
            ok: true,
            id: usuarioDB._id,
            token: token,
            usuario: usuarioDB
        });
    });
});
exports.default = loginRoutes;
