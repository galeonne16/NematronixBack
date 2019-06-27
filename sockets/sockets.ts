import socketIO from 'socket.io';
import { Socket } from 'socket.io';
import { verificaWS } from '../middlewares/authentication';

export const conectarUsuario = ( cliente: Socket, io: socketIO.Server ) => {
    // console.log(cliente.id);
}

export const desconectarUsuario = ( cliente: Socket, io: socketIO.Server ) => {
    cliente.on('disconnect', () => {
        console.log('Usuario ' + cliente.id + ' desconectado');
    });
}

export const pingAlive = ( cliente: Socket, io: socketIO.Server ) => {
    setInterval(() => {
        io.to('ADMIN_ROLE').emit('mensaje', 'Estas en el grupo admin');
        io.to('USER_ROLE').emit('mensaje', 'Estas en el grupo de usuarios');
    },1000);
}

export const identificarUsuario = ( cliente: Socket, io: socketIO.Server ) => {
    cliente.on('datos-usuario', ( payload, callback: Function ) => {
        let token = payload;

        verificaWS(token, ( data: any ) => {
            if ( data.ok !== true ) {
                io.to(cliente.id).emit('desconectar');
            }

            if ( data.usuario.role == 'ADMIN_ROLE' ) {
                cliente.join('USER_ROLE');
                cliente.join('ADMIN_ROLE');
            } else {
                
                cliente.join(data.usuario.role);

            }

            console.log(data);
        });
    });
}
