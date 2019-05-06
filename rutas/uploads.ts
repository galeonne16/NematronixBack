import { Router, Request, Response, NextFunction } from 'express';
import fileUpload from 'express-fileupload';
import fs, { existsSync } from 'fs';
import { crearDirectorio } from '../funciones/globales';

const uploadRoutes = Router();

uploadRoutes.use( fileUpload() );

uploadRoutes.post('/', (req: Request, res: Response) => {
    const id = req.headers.id;
    

    if ( !req.files ) {
        return res.status(400).json({
            ok: false,
            mensaje: 'No subiste ningun archivo'
        });
    }

    const archivo: any = req.files.archivo;

    const arrayArchivo: string = archivo.name.split('.');
    const extension: string = arrayArchivo[arrayArchivo.length -1 ];

    const extImagenes = [ 'png', 'jpg', 'img', 'gif', 'jpeg', 'bmp' ];

    if( extImagenes.indexOf(extension) < 0 ) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Te mamaste pendejo',
            err: { message: 'La extesión no es valida solo se aceptan: ' + extImagenes.join(', ') }
        });
    }

    // Crear un nombre de archivo personalizado

    const narchivoP = `${ id }-${ new Date().getMilliseconds()}.${extension}`;

    // res.status(200).json({
    //     ok: true,
    //     nombre: narchivoP
    // });

    // Mover archivo

    const path = `./dist/uploads/usuarios/${ narchivoP }`;

    archivo.mv(path, ( err: any ) => {
        if ( err ) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al mover archivo',
                err: err
            });
        }

        res.status(200).json({
            ok: true,
            mensaje: 'Imagen actualizada'
        });
    });

});

export default uploadRoutes;

