import { Schema, model } from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

export const radioSchema: Schema = new Schema({
    serie: { type: String, required:[true, 'La serie es obligatoria'] },
    tipo: { type: String, required:[true, 'El tipo de equipo es obligatorio'] },
    fijo: { type: Boolean },
    ubicacion: { type: String },
    instalado: { type: String },
    vehiculo: { type: Schema.Types.ObjectId, ref: 'Vehiculo' },
    id: { type: Number }
    
});

radioSchema.plugin(uniqueValidator, { message: '{PATH} debe de ser unico' });

export const Radio = model('Radio', radioSchema )