import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';

//Enviar email
const sendEmail = async (to: string, replacements:  Record<string, any>) => {
    try {
        // Leer el archivo HTML
        const filePath = path.resolve('templates', 'premiado.html');
        let html = fs.readFileSync(filePath, 'utf-8');

        // Reemplazar los marcadores en el HTML (por ejemplo, {{name}})
        Object.keys(replacements).forEach(key => {
            const regex = new RegExp(`{{${key}}}`, 'g'); // Crear una expresión regular global
            html = html.replace(regex, replacements[key]);
        });

        const transporter = nodemailer.createTransport({
            service: "Gmail",
            secure: true,
            host: process.env.MAIL_HOST,
            port: Number(process.env.MAIL_PORT),
            auth: {
              user: process.env.MAIL_USER,
              pass: process.env.MAIL_PASSWORD
            }
          } as nodemailer.TransportOptions); 

        const mailOptions = {
            from: `Lotería" <${process.env.MAIL_USER}>`,
            to: to,
            subject: '¡Enhorabuena! Premio de la lotería',
            html: html
        };

        await transporter.sendMail(mailOptions);
        
    } catch (error) {
        throw new Error('Error al enviar el email');
    }
};

export {
    sendEmail
};