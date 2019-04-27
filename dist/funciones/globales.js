"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var log_1 = require("../modelos/log");
function addZero(i) {
    if (i < 10) {
        i = '0' + i;
    }
    return i;
}
function horaActual() {
    var h = new Date();
    var hora = h.getHours();
    var minuto = h.getMinutes();
    var segundo = h.getSeconds();
    var horaA = addZero(hora) + ':' + addZero(minuto) + ':' + addZero(segundo);
    return horaA;
}
exports.horaActual = horaActual;
function fechaActual() {
    var f = new Date();
    var dia = f.getDate();
    var mes = f.getMonth() + 1;
    var anio = f.getFullYear();
    var fecha = addZero(dia) + '/' + addZero(mes) + '/' + anio;
    return fecha;
}
exports.fechaActual = fechaActual;
function guardarLog(tipo, url, usuario, email, ip, descripcion) {
    var promesa = new Promise(function (resolve, reject) {
        var log = new log_1.Log({
            tipo: tipo,
            url: url,
            usuario: usuario,
            email: email,
            ip: ip,
            fecha: fechaActual(),
            hora: horaActual(),
            descripcion: descripcion
        });
        log.save(function (err, logGuardado) {
            if (err) {
                throw err;
                reject();
            }
            console.log('Log actualizado');
        });
        resolve();
    });
    return promesa;
}
exports.guardarLog = guardarLog;
