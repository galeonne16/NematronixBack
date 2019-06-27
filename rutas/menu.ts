import { Request, Response, Router } from 'express';
import { IMenu } from '../interfaces/menu';
import { verificaToken } from '../middlewares/authentication';
import { Menu } from '../modelos/menu';
import { guardarLog } from '../funciones/globales';
import Server from '../clases/server';

const menuRoutes = Router();

const userRole = 'USER_ROLE';
const adminRole = 'ADMIN_ROLE';
const sudoRole = 'SUDO_ROLE';
const server = Server.instance;

//===================================================================
// Crear ruta de menu
//===================================================================

menuRoutes.post('/', verificaToken, (req: Request, res: Response) => {
    const body: IMenu = req.body;
    const sudo = req.body.usuario;

    if ( sudo.role !== adminRole ) {
        return res.status(401).json({
            ok: false,
            mensaje: 'No tienes permisos para crear menus'
        });
    }

    const menu = new Menu({
        role: body.role,
        titulo: body.titulo,
        icono: body.icono
    });

    menu.save((err: any, menuGuardado) => {
        if ( err ) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Ocurrio un error al guardar el menu',
                err: err
            });
        }

        guardarLog(req.method, req.originalUrl, sudo._id, sudo.email, req.ip , 'Creacion de menu').then((resultado) => {
            console.log(resultado);
        });

        res.status(200).json({
            ok: true,
            mensaje: 'Nuevo menu creado con exito',
            menu: menuGuardado
        });

    });
});

//===================================================================
// Crear ruta de submenu
//===================================================================

menuRoutes.post('/submenu', verificaToken, (req: Request, res: Response) => {
    const body = req.body;
    const sudo = req.body.usuario;

    if ( sudo.role !== adminRole ) {
        return res.status(401).json({
            ok: false,
            mensaje: 'Necesitas ser Super Usuario para crear submenus'
        });
    }

    if ( !body.menu ) {
        return res.status(500).json({
            ok: false,
            mensaje: 'Necesitas el id del menu a relacionar'
        });
    }

    Menu.findByIdAndUpdate(body.menu, {$push: {submenu: body.submenu}},
        (err: any, menuUpdate) => {
            if ( err ) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al integrar submenu',
                    err: err
                });
            }

            res.status(200).json({
                ok: true,
                mensaje: 'Submenu insertado con exito',
                submenu: menuUpdate
            });
        });
});
//===================================================================
// Crear ruta de menu
//===================================================================

menuRoutes.get('/', (req: Request, res: Response) => {
    Menu.find({}, (err: any, menus) => {
        if ( err ) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al recuperar menus',
                err: err
            });
        }

        res.status(200).json({
            ok: true,
            menus: menus
        });
    });
});

export default menuRoutes;