import { Schema, model } from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

export const vehiculoSchema: Schema = new Schema({
    tipo: { type: String, required:[true, 'El tipo de vehiculo es obligatorio'] },
    siglas: { type: String, unique: true, required:[ true, 'Las placas o siglas son obligatorias'] },
    sitio: { type: String, required: true },
    ubicacion: { type: String, required: true }
});

vehiculoSchema.plugin(uniqueValidator, { message: '{PATH} debe de ser unico' });

export const Vehiculo = model('Vehiculo', vehiculoSchema )