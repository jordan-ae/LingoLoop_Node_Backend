import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import path = require('path');

const rootDir = path.join(__dirname, '../../../');

dotenv.config({
    path: path.join(rootDir, '.env'),
});

const mailTransporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    secure: false,
    auth: {
        user: process.env.EMAIL_HOST_USER,
        pass: process.env.EMAIL_HOST_PASSWORD,
    },
    tls: {
        rejectUnauthorized: false
    }
});

export default mailTransporter;