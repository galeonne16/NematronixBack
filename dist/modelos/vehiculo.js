"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var mongoose_unique_validator_1 = __importDefault(require("mongoose-unique-validator"));
exports.vehiculoSchema = new mongoose_1.Schema({
    tipo: { type: String, required: [true, 'El tipo de vehiculo es obligatorio'] },
    siglas: { type: String, unique: true, required: [true, 'Las placas o siglas son obligatorias'] },
    adscripcion: { type: String, required: false }
});
exports.vehiculoSchema.plugin(mongoose_unique_validator_1.default, { message: '{PATH} debe de ser unico' });
exports.Vehiculo = mongoose_1.model('Vehiculo', exports.vehiculoSchema);
