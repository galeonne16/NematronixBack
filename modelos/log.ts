import { Schema, model } from 'mongoose';

export const logSchema: Schema = new Schema ({
    tipo: { type: String, required: true },
    url: { type: String, required: true },
    usuario: { type: String, required: true },
    email: { type: String, required: true },
    ip: { type: String, required: true },
    fecha: { type: String, required: true },
    hora: { type: String, required: true },
    descripcion: { type: String, required: true }
});

export const Log = model("Log", logSchema)