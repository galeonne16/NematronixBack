"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
exports.submenuSchema = new mongoose_1.Schema({
    role: { type: String, required: [true, 'El role para menu es necesario'] },
    menu: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Menu' },
    titulo: { type: String, required: [true, 'El titulo de menu es necesario'] },
    url: { type: String, required: [true, 'La url del submenu es necesaria'] }
});
exports.SubMenu = mongoose_1.model('SubMenu', exports.submenuSchema);
