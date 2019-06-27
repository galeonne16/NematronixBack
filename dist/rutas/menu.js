"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var authentication_1 = require("../middlewares/authentication");
var menu_1 = require("../modelos/menu");
var globales_1 = require("../funciones/globales");
var server_1 = __importDefault(require("../clases/server"));
var menuRoutes = express_1.Router();
var userRole = 'USER_ROLE';
var adminRole = 'ADMIN_ROLE';
var sudoRole = 'SUDO_ROLE';
var server = server_1.default.instance;
//===================================================================
// Crear ruta de menu
//===================================================================
menuRoutes.post('/', authentication_1.verificaToken, function (req, res) {
    var body = req.body;
    var sudo = req.body.usuario;
    if (sudo.role !== adminRole) {
        return res.status(401).json({
            ok: false,
            mensaje: 'No tienes permisos para crear menus'
        });
    }
    var menu = new menu_1.Menu({
        role: body.role,
        titulo: body.titulo,
        icono: body.icono
    });
    menu.save(function (err, menuGuardado) {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Ocurrio un error al guardar el menu',
                err: err
            });
        }
        globales_1.guardarLog(req.method, req.originalUrl, sudo._id, sudo.email, req.ip, 'Creacion de menu').then(function (resultado) {
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
menuRoutes.post('/submenu', authentication_1.verificaToken, function (req, res) {
    var body = req.body;
    var sudo = req.body.usuario;
    if (sudo.role !== adminRole) {
        return res.status(401).json({
            ok: false,
            mensaje: 'Necesitas ser Super Usuario para crear submenus'
        });
    }
    if (!body.menu) {
        return res.status(500).json({
            ok: false,
            mensaje: 'Necesitas el id del menu a relacionar'
        });
    }
    menu_1.Menu.findByIdAndUpdate(body.menu, { $push: { submenu: body.submenu } }, function (err, menuUpdate) {
        if (err) {
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
menuRoutes.get('/', function (req, res) {
    menu_1.Menu.find({}, function (err, menus) {
        if (err) {
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
exports.default = menuRoutes;
