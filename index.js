require('dotenv').load();
const Nexmo = require('nexmo');
const Hapi = require('hapi');
const Axios = require('axios');
const crypto = require('crypto');

const API_KEY = process.env.NEXMO_API_KEY;
const API_SECRET = process.env.NEXMO_API_SECRET;
const NEXMO_NUMBER = process.env.NEXMO_NUMBER;
const NOTIFICATION_NUMBER = process.env.NOTIFICATION_NUMBER;
const REPOSITORIES = process.env.REPOSITORIES.split(',');
const TRAVIS_CONFIG_URL = process.env.TRAVIS_CONFIG_URL;

const nexmo = new Nexmo({
    apiKey: API_KEY,
    apiSecret: API_SECRET
});

const server = Hapi.Server({
    port: process.env.PORT || 3000
});

server.route({
    method: 'POST',
    path: '/notifications',
    handler: async (request, h) => {
        const details = JSON.parse(request.payload.payload);
        const verified = await verifyRequest(request);

        if (verified && isValidRepository(details)) {
            await sendNotification(NEXMO_NUMBER, NOTIFICATION_NUMBER, buildMessage(details));
        }

        return h.response().code(204);
    }
});

async function verifyRequest(request) {
    const response = await Axios.get(TRAVIS_CONFIG_URL);

    const travisPublicKey = response.data.config.notifications.webhook.public_key;
    const travisSignature = Buffer.from(request.headers.signature, 'base64');

    const verifier = crypto.createVerify('sha1');
    verifier.update(request.payload.payload);

    return verifier.verify(travisPublicKey, travisSignature);
}

async function sendNotification(from, to, message) {
    nexmo.message.sendSms(from, to, message);
}

function buildMessage(details) {
    const status = `${details.status_message}`;
    const repository = `${details.repository.owner_name}/${details.repository.name}`;
    const blame = `${details.author_name} (${details.author_email})`;

    return `Build #${details.number} ${status} [${repository} ${details.branch}] Last committed by: ${blame}.`;
}

function isValidRepository(details) {
    return REPOSITORIES.includes(`${details.repository.owner_name}/${details.repository.name}`)
}

async function init() {
    await server.start();
    console.log("Server Started. Listening for requests from Travis CI for the following repositories:")
    REPOSITORIES.forEach((repo) => console.log(repo));
}

init();