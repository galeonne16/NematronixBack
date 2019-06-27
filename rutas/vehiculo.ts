import { Request, Response, Router } from 'express';
import { Vehiculo } from '../modelos/vehiculo';
import Server from '../clases/server';
import { verificaToken } from '../middlewares/authentication';
import { guardarLog } from '../funciones/globales';


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
        adscripcion: body.adscripcion
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
vehRoutes.put('/', verificaToken, (req: Request, res: Response) => {

});

//===================================================================
// Eliminar vehiculo
//===================================================================
vehRoutes.delete('/', verificaToken, (req: Request, res: Response) => {

});
