import 'dotenv/config';
import nodemailer from 'nodemailer';

export const mailer = nodemailer.createTransport({
    host: process.env.MAIL_HOST!,
    port: Number(process.env.MAIL_PORT),
    secure: process.env.MAIL_SECURE === 'true',
    auth: {
        user: process.env.MAIL_USER!,
        pass: process.env.MAIL_PASS!,
    },
});

export const sendMail = (to: string, subject: string, html: string) =>
    mailer.sendMail({
        from: process.env.MAIL_FROM!,
        to,
        subject,
        html,
    });
