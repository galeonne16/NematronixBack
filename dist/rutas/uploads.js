"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var express_fileupload_1 = __importDefault(require("express-fileupload"));
var uploadRoutes = express_1.Router();
uploadRoutes.use(express_fileupload_1.default());
uploadRoutes.post('/', function (req, res) {
    var id = req.headers.id;
    if (!req.files) {
        return res.status(400).json({
            ok: false,
            mensaje: 'No subiste ningun archivo'
        });
    }
    var archivo = req.files.archivo;
    var arrayArchivo = archivo.name.split('.');
    var extension = arrayArchivo[arrayArchivo.length - 1];
    var extImagenes = ['png', 'jpg', 'img', 'gif', 'jpeg', 'bmp'];
    if (extImagenes.indexOf(extension) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Te mamaste pendejo',
            err: { message: 'La extesión no es valida solo se aceptan: ' + extImagenes.join(', ') }
        });
    }
    // Crear un nombre de archivo personalizado
    var narchivoP = id + "-" + new Date().getMilliseconds() + "." + extension;
    // res.status(200).json({
    //     ok: true,
    //     nombre: narchivoP
    // });
    // Mover archivo
    var path = "./dist/uploads/usuarios/" + narchivoP;
    archivo.mv(path, function (err) {
        if (err) {
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
exports.default = uploadRoutes;
