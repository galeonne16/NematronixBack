import { Log } from '../modelos/log';
import fs from 'fs';

function addZero( i: any ) {
    if ( i < 10 ) {
        i = '0' + i;
    }

    return i;
}

export function horaActual() {
    let h = new Date();
    let hora = h.getHours();
    let minuto = h.getMinutes();
    let segundo = h.getSeconds();

    let horaA = addZero(hora) + ':' + addZero(minuto) + ':' + addZero(segundo);

    return horaA;
}

export function fechaActual() {
    let f = new Date();
    let dia = f.getDate();
    let mes = f.getMonth() + 1;
    let anio = f.getFullYear();

    let fecha = addZero(dia) + '/' + addZero(mes) + '/' + anio;

    return fecha;
}

export function guardarLog(tipo: string, url: string, usuario: any, email: any, ip: any, descripcion: string) {
    let promesa = new Promise( ( resolve, reject ) => {
        let log = new Log({
            tipo: tipo,
            url: url,
            usuario: usuario,
            email: email,
            ip: ip,
            fecha: fechaActual(),
            hora: horaActual(),
            descripcion: descripcion
        });

        log.save((err: any, logGuardado) => {
            if ( err ) {
                throw err;
                reject();
            }

            console.log('Log actualizado');
        });

        resolve();
    });

    return promesa;
}

export function crearDirectorio(ruta: string) {
    let promise = new Promise((resolve, reject) => {
        fs.mkdir(ruta, ( err:any ) => {
            if ( err ) {
                console.log(err);
                reject(err);
            }

            resolve();
        });
    });

    return promise;
}