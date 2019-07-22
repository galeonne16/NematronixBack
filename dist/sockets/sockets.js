"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var authentication_1 = require("../middlewares/authentication");
exports.conectarUsuario = function (cliente, io) {
    // console.log(cliente.id);
};
exports.desconectarUsuario = function (cliente, io) {
    cliente.on('disconnect', function () {
        console.log('Usuario ' + cliente.id + ' desconectado');
    });
};
exports.pingAlive = function (cliente, io) {
    setInterval(function () {
        io.to('ADMIN_ROLE').emit('mensaje', 'Estas en el grupo admin');
        io.to('USER_ROLE').emit('mensaje', 'Estas en el grupo de usuarios');
    }, 1000);
};
exports.identificarUsuario = function (cliente, io) {
    cliente.on('datos-usuario', function (payload, callback) {
        var token = payload;
        if (!payload) {
            console.log('Sin datos');
            return;
        }
        authentication_1.verificaWS(token, function (data) {
            if (!data) {
                console.log('sin datos');
            }
            if (!data.usuario) {
                io.to(cliente.id).emit('desconectar');
            }
            else {
                if (data.usuario.role == 'ADMIN_ROLE') {
                    cliente.join('USER_ROLE');
                    cliente.join('ADMIN_ROLE');
                }
                else {
                    cliente.join(data.usuario.role);
                }
            }
            if (data.ok !== true) {
                io.to(cliente.id).emit('desconectar');
            }
            console.log(data);
        });
    });
};
