import nodemailer from 'nodemailer';
import { emailHost, emailPort, emailUser, emailPass } from '../global/environment';
// Funcion para enviar email
function sendEmail( para: string, asunto: string, texto: string, html?: string ) {
    let transporter = nodemailer.createTransport({
        host: emailHost,
        port: emailPort,
        secure: false,
        auth: {
            user: emailUser,
            pass: emailPass
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    transporter.verify((err: any, success) => {
        if ( err ) {
            console.log(err);
        }else{
            console.log('Listo para enviar email');
        }
    })

    let mailOptions = {
        from: 'gmedina@nematronix.com',
        to: para,
        subject: asunto,
        text: texto,
        html: html
    };

    transporter.sendMail(mailOptions, (err: any, info) => {
        if ( err ) {
            console.log(err);
        } else {
            console.log(info.response);
        }
    });
}

export default sendEmail;