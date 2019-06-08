"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var authentication_1 = require("../middlewares/authentication");
exports.conectarUsuario = function (cliente, io) {
    console.log(cliente.id);
};
exports.desconectarUsuario = function (cliente, io) {
    cliente.on('disconnect', function () {
        console.log('Usuario ' + cliente.id + ' desconectado');
    });
};
exports.identificarUsuario = function (cliente, io) {
    cliente.on('datos-usuario', function (payload, callback) {
        var token = payload;
        console.log(token);
        authentication_1.verificaWS(token, function (data) {
            if (data.ok !== true) {
                io.to(cliente.id).emit('desconectar');
            }
            console.log(data);
        });
    });
};
