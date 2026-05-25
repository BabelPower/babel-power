import 'dotenv/config';
import Redis from 'ioredis';
import { logger } from '../logger';

export const redis = new Redis(process.env.REDIS_URL!, {
    lazyConnect: true,
});

redis.on('error', (err) => {
    logger.error({ err }, '[redis] connection error');
});

await redis.connect();
logger.info('[redis] connected');
