"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
exports.logSchema = new mongoose_1.Schema({
    tipo: { type: String, required: true },
    url: { type: String, required: true },
    usuario: { type: String, required: true },
    email: { type: String, required: true },
    ip: { type: String, required: true },
    fecha: { type: String, required: true },
    hora: { type: String, required: true },
    descripcion: { type: String, required: true }
});
exports.Log = mongoose_1.model("Log", exports.logSchema);
