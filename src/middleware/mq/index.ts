import 'dotenv/config';
import coniglio from 'coniglio';

export const MAIL_EXCHANGE = "auth.mail";
export const CAPTCHA_MAIL_QUEUE = "auth.mail.captcha";
export const CAPTCHA_MAIL_ROUTING_KEY = "auth.mail.captcha.send";
export const CAPTCHA_TTL_SECONDS = 180;
export const CAPTCHA_TTL_MS = CAPTCHA_TTL_SECONDS * 1000;

export type CaptchaMailMessage = {
    to: string;
    subject: string;
    html: string;
    expiresAt: number;
};

type MqRoutingMap = {
    [CAPTCHA_MAIL_ROUTING_KEY]: CaptchaMailMessage;
};

export const mq = await coniglio<MqRoutingMap>(process.env.RABBITMQ_URL!);

export const publishCaptchaMail = (message: CaptchaMailMessage) =>
    mq.publish(MAIL_EXCHANGE, CAPTCHA_MAIL_ROUTING_KEY, message);
