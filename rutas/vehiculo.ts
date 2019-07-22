import { Request, Response, Router } from 'express';
import { Vehiculo } from '../modelos/vehiculo';
import Server from '../clases/server';
import { verificaToken } from '../middlewares/authentication';
import { guardarLog } from '../funciones/globales';
import { request } from 'http';


const userRole = 'USER_ROLE';
const adminRole = 'ADMIN_ROLE';
const sudoRole = 'SUDO_ROLE';

const server = Server.instance;

const vehRoutes = Router();

//===================================================================
// Crear vehiculo
//===================================================================
vehRoutes.post('/', verificaToken, (req: Request, res: Response) => {
    const body = req.body;
    const user = req.body.usuario;

    if ( user.role !== 'ADMIN_ROLE' ) {
        return res.status(500).json({
            ok: false,
            mensaje: 'Necesitas permisos de administrador para registrar vehiculos'
        });
    }

    const vehiculo = new Vehiculo({
        tipo: body.tipo,
        siglas: body.siglas,
        sitio: body.sitio,
        ubicacion: body.ubicacion
    });

    vehiculo.save((err: any, vehGuardado) => {
        if ( err ) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al registrar vehiculo',
                err: err
            });
        }

        guardarLog(req.method, req.originalUrl, user._id, user.email, req.ip , 'Registro de vehiculo nuevo').then((resultado) => {
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
vehRoutes.get('/', verificaToken, (req: Request, res: Response) => {
    Vehiculo.find({})
        .exec((err: any, vehiculos) => {
            if ( err ) {
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
vehRoutes.put('/:id', verificaToken, (req: Request, res: Response) => {
    const id = req.params.id;
    const body = req.body;
    const usuario = req.body.usuario;

    if ( usuario.role !== 'ADMIN_ROLE' ) {
        return res.status(500).json({
            ok: false,
            mensaje: 'Necesitas permisos de administrador para registrar vehiculos'
        });
    }

    Vehiculo.findByIdAndUpdate(id, body, { new: true },(err: any, vehActualizado) => {
        if ( err ) {
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
vehRoutes.delete('/', verificaToken, (req: Request, res: Response) => {

});

//===================================================================
// Buscar vehiculo por id
//===================================================================
vehRoutes.get('/buscar/:id', verificaToken, (req: Request, res: Response) => {
    const id = req.params.id;

    Vehiculo.findById(id, (err: any, vehiculo) => {
        if ( err ) {
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
vehRoutes.post('/buscar', verificaToken, (req: Request, res: Response) => {
    const termino: any = req.body.termino;
    let regex = new RegExp( termino, 'i');
    
    Vehiculo.find(
        { $or: [ { tipo: regex}, { siglas: regex }, { sitio: regex }, {ubicacion: regex } ] }
    ).exec((err: any, vehEncontrado) => {
        if ( err ) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error en base de datos',
                err: err
            });
        }

        if ( vehEncontrado.length === 0 ) {
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


export default vehRoutes;