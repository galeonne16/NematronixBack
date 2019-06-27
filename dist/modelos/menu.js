"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
exports.menuSchema = new mongoose_1.Schema({
    role: { type: String, required: [true, 'El role para menu es necesario'] },
    titulo: { type: String, required: [true, 'El titulo de menu es necesario'] },
    icono: { type: String, required: [true, 'El icono del menu es necesario'] },
    submenu: { type: Array, default: [] }
});
exports.Menu = mongoose_1.model('Menu', exports.menuSchema);
