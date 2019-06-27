"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var mongoose_unique_validator_1 = __importDefault(require("mongoose-unique-validator"));
exports.radioSchema = new mongoose_1.Schema({
    serie: { type: String, required: [true, 'La serie es obligatoria'] },
    tipo: { type: String, required: [true, 'El tipo de equipo es obligatorio'] },
    fijo: { type: Boolean },
    vehiculo: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Vehiculo' },
    id: { type: Number }
});
exports.radioSchema.plugin(mongoose_unique_validator_1.default, { message: '{PATH} debe de ser unico' });
exports.Radio = mongoose_1.model('Radio', exports.radioSchema);
