import socketIO from 'socket.io';
import { Socket } from 'socket.io';
import { Usuario } from '../modelos/usuario';
import { verificaWS } from '../middlewares/authentication';

export const conectarUsuario = ( cliente: Socket, io: socketIO.Server ) => {
    console.log(cliente.id);
}

export const desconectarUsuario = ( cliente: Socket, io: socketIO.Server ) => {
    cliente.on('disconnect', () => {
        console.log('Usuario ' + cliente.id + ' desconectado');
    });
}

export const pingAlive = ( cliente: Socket, io: socketIO.Server ) => {
    setInterval(() => {
        io.emit('prueba', 1);
    },1000);
}

export const identificarUsuario = ( cliente: Socket, io: socketIO.Server ) => {
    cliente.on('datos-usuario', ( payload, callback: Function ) => {
        let token = payload;

        console.log(token);

        verificaWS(token, ( data: any ) => {
            if ( data.ok !== true ) {
                io.to(cliente.id).emit('desconectar');
            }

            console.log(data);
        });
    });
}
