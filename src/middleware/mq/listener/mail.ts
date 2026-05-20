import { sendMail } from "../../mail";
import {
    CAPTCHA_MAIL_QUEUE,
    CAPTCHA_MAIL_ROUTING_KEY,
    MAIL_EXCHANGE,
    mq,
} from "../index";

export const startMailListener = async () => {
    await mq.configure({
        exchanges: [{
            name: MAIL_EXCHANGE,
            type: "direct",
            durable: true,
        }],
        queues: [{
            name: CAPTCHA_MAIL_QUEUE,
            durable: true,
            bindTo: [{
                exchange: MAIL_EXCHANGE,
                routingKey: CAPTCHA_MAIL_ROUTING_KEY,
            }]
        }]
    })

    for await (const message of mq.listen(CAPTCHA_MAIL_QUEUE, {
        routingKeys: [CAPTCHA_MAIL_ROUTING_KEY]
    })) {
        const payload = message.data

        if (
            !payload
            || typeof payload.to !== "string"
            || typeof payload.subject !== "string"
            || typeof payload.html !== "string"
            || typeof payload.expiresAt !== "number"
        ) {
            mq.ack(message)
            continue
        }

        if (payload.expiresAt <= Date.now()) {
            mq.ack(message)
            continue
        }

        try {
            await sendMail(payload.to, payload.subject, payload.html)
            mq.ack(message)
        } catch {
            mq.nack(message)
        }
    }
}
