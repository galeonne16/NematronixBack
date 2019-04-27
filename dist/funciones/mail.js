"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var nodemailer_1 = __importDefault(require("nodemailer"));
var environment_1 = require("../global/environment");
// Funcion para enviar email
function sendEmail(para, asunto, texto, html) {
    var transporter = nodemailer_1.default.createTransport({
        host: environment_1.emailHost,
        port: environment_1.emailPort,
        secure: false,
        auth: {
            user: environment_1.emailUser,
            pass: environment_1.emailPass
        },
        tls: {
            rejectUnauthorized: false
        }
    });
    transporter.verify(function (err, success) {
        if (err) {
            console.log(err);
        }
        else {
            console.log('Listo para enviar email');
        }
    });
    var mailOptions = {
        from: 'gmedina@nematronix.com',
        to: para,
        subject: asunto,
        text: texto,
        html: html
    };
    transporter.sendMail(mailOptions, function (err, info) {
        if (err) {
            console.log(err);
        }
        else {
            console.log(info.response);
        }
    });
}
exports.default = sendEmail;
