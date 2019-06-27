"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var jsonwebtoken_1 = require("jsonwebtoken");
var environment_1 = require("../global/environment");
function verificaToken(req, res, next) {
    var token = req.headers.authorization;
    jsonwebtoken_1.verify(token, environment_1.SEED, function (err, decoded) {
        if (err) {
            return res.status(401).json({
                ok: false,
                mensaje: 'Token incorrecto'
            });
        }
        if (decoded.usuario.status !== 'activo') {
            return res.status(401).json({
                ok: false,
                mensaje: 'Su usuario se encuentra desactivado, contacte a un administrador'
            });
        }
        req.body.usuario = decoded.usuario;
        next();
    });
}
exports.verificaToken = verificaToken;
function verificaWS(token, callback) {
    jsonwebtoken_1.verify(token, environment_1.SEED, function (err, decoded) {
        if (err) {
            return callback({ ok: false, mensaje: 'Token incorrecto' });
        }
        if (decoded.usuario.status !== 'activo') {
            return callback({ ok: false, mensaje: 'Usuario inactivo' });
        }
        callback({ ok: true, usuario: decoded.usuario });
    });
}
exports.verificaWS = verificaWS;
