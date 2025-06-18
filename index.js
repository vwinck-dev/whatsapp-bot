const fs = require('fs');
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const { handleMessage } = require('./services/messageHandler');
const { logMessage } = require('./services/logger');
const { rateLimiter } = require('./services/rateLimiter');
const { cleanSessions } = require('./services/sessions'); // Import session cleanup

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: true,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--no-first-run',
            '--no-zygote',
            '--single-process',
            '--disable-gpu'
        ]
    }
});

// Generate QR Code in terminal
client.on('qr', qr => qrcode.generate(qr, { small: true }));

// Bot is ready
client.on('ready', () => {
    console.log('Bot connected!');
    // Start periodic cleanup of inactive sessions
    setInterval(cleanSessions, 3600000); // Every hour
});

// Event for received messages
client.on('message', async message => {
    const { from, body } = message;

    // Improved check for group messages
    if (from.endsWith('@g.us')) {
        return;
    }

    // Check rate limiting
    if (!rateLimiter.isAllowed(from)) return;

    // Log the message
    logMessage(from, body);

    // Add human-like delays before processing
    await humanLikeDelay();

    // Process the message
    try {
        await handleMessage(message);
    } catch (error) {
        console.error('Error processing message:', error);
    }
});

// Automatically leave new groups (anti-ban behavior)
client.on('group_join', async (notification) => {
    const { id, recipientIds } = notification;
    
    // Add random delay before leaving (2-10 seconds)
    await randomDelay(2000, 10000);
    
    if (recipientIds.includes(client.info.wid._serialized)) {
        console.log(`Leaving group: ${id}`);
        await client.groupLeave(id);
    }
});

// Initialize the client
client.initialize();

// Human-like behavior functions
async function humanLikeDelay() {
    await randomDelay(1000, 5000); // Base delay
    if (Math.random() > 0.7) {
        await randomDelay(500, 1500); // Additional delay 30% of the time
    }
}

function randomDelay(min = 500, max = 3000) {
    const delay = Math.floor(Math.random() * (max - min + 1)) + min;
    return new Promise(resolve => setTimeout(resolve, delay));
}