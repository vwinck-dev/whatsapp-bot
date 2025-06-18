const fs = require('fs');
const path = require('path');

/**
 * Logs a message to a user-specific log file, organized by date.
 * Creates a directory for the current date if it does not exist.
 * Appends the log entry to the user's log file in the format:
 * [ISO timestamp] message text.
 *
 * @param {string} user - The username or identifier for the log file.
 * @param {string} text - The message text to be logged.
 * @throws {Error} Throws an error if the log file cannot be written.
 */
function logMessage(user, text) {
    const date = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
    const dir = path.join(__dirname, '..', 'logs', date);

    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    const logPath = path.join(dir, `${user}.log`);
    const logEntry = `[${new Date().toISOString()}] ${text}\n`;

    fs.appendFileSync(logPath, logEntry);
}

module.exports = { logMessage };
