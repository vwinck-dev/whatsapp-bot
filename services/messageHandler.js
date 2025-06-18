// services/messageHandler.js
const states = require('../config.js');
const actions = require('./actions');
const { getSession, setStep, resetSession } = require('./sessions');

const resetCommands = ['exit', 'reset', 'menu'];

const handleMessage = async (message) => {
    const text = message.body.trim().toLowerCase();
    const from = message.from;

    try {
        const session = await getSession(from);
        await simulateTyping(message);

        if (resetCommands.includes(text)) {
            await resetAndReply(message, from, "Returning to the main menu...");
            return;
        }

        const currentState = states[session.step] || states.start;

        if (currentState.options && text in currentState.options) {
            const option = currentState.options[text];

            if (option.action) {
                // Calls the action defined in actions.js
                if (actions[option.action]) {
                    await actions[option.action](message, option);
                    await resetSession(from);
                    await message.reply("Session ended. Send 'menu' to restart.");
                } else {
                    await message.reply("Action not implemented.");
                }
            } else if (option.nextState) {
                await setStep(from, option.nextState);
                await message.reply(states[option.nextState].text);
            }
        } else {
            await handleInvalidOption(message, from, currentState);
        }
    } catch (err) {
        console.error(err);
    }
};

async function handleInvalidOption(message, from, currentState) {
    if (currentState.options) {
        await message.reply(`Invalid option. Please try again:\n\n${currentState.text}`);
    } else {
        await message.reply("Session ended. Send 'menu' to restart.");
        await resetSession(from);
    }
}

async function resetAndReply(message, from, replyText) {
    await message.reply(replyText);
    await resetSession(from);
    await message.reply(states.start.text);
}

async function simulateTyping(message) {
    const chat = await message.getChat();
    await chat.sendStateTyping();
    await new Promise(r => setTimeout(r, 1000 + Math.random() * 2000));
    await chat.clearState();
}

module.exports = { handleMessage };
