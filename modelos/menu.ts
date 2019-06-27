import { Schema, model } from 'mongoose';

export const menuSchema: Schema = new Schema({
    role: { type: String, required: [true, 'El role para menu es necesario'] },
    titulo: { type: String, required: [ true, 'El titulo de menu es necesario'] },
    icono: { type: String, required: [ true, 'El icono del menu es necesario'] },
    submenu: { type: Array, default:[] }
});

export const Menu = model('Menu', menuSchema )