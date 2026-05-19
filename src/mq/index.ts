import 'dotenv/config';
import coniglio from 'coniglio';

export const mq = await coniglio(process.env.RABBITMQ_URL!);
