"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var mongoose_unique_validator_1 = __importDefault(require("mongoose-unique-validator"));
var globales_1 = require("../funciones/globales");
var rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE', 'SUDO_ROLE'],
    message: '{VALUE} no es un rol permitido'
};
exports.usuarioSchema = new mongoose_1.Schema({
    nombre: { type: String, required: [true, 'El nombre es requerido'], uppercase: true },
    apellidoP: { type: String, required: [true, 'El apellido es requerido'], uppercase: true },
    apellidoM: { type: String, required: [true, 'El apellido materno es requerido'], uppercase: true },
    email: { type: String, unique: true, required: [true, 'El email es requerido'], lowercase: true },
    password: { type: String, required: [true, 'El password es requerido'] },
    role: { type: String, enum: rolesValidos, default: 'USER_ROLE' },
    status: { type: String, default: 'inactivo', required: true },
    fcreate: { type: String, default: globales_1.fechaActual() },
    img: { type: String, required: false }
}, { collection: 'usuarios' });
exports.usuarioSchema.plugin(mongoose_unique_validator_1.default, { message: '{PATH} debe de ser unico' });
exports.Usuario = mongoose_1.model("Usuario", exports.usuarioSchema);
