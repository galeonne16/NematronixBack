import { Document, Schema, Model, model } from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';
import { IUsuario }from '../interfaces/usuario';
import { fechaActual } from '../funciones/globales';

export interface IUsuarioModel extends IUsuario, Document {
    fcreate: Date
}

const rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol permitido'
}

export const usuarioSchema: Schema = new Schema ({
    nombre: {type: String, required: [true, 'El nombre es requerido'], uppercase: true },
    apellidoP: { type: String, required: [true, 'El apellido es requerido'], uppercase: true },
    apellidoM: { type: String, required: [true, 'El apellido materno es requerido'], uppercase: true },
    email: { type: String, unique: true,required: [true, 'El email es requerido'], lowercase: true },
    password: { type: String, required: [true, 'El password es requerido'] },
    role: { type: String, enum: rolesValidos, default: 'USER_ROLE' },
    status: { type: String, default: 'inactivo', required: true },
    fcreate: { type: String, default: fechaActual() },
    img: { type: String, required: false }
}, { collection: 'usuarios'} );

usuarioSchema.plugin(uniqueValidator, { message: '{PATH} debe de ser unico' });

export const Usuario: Model<IUsuarioModel> = model<IUsuarioModel>("Usuario", usuarioSchema);
