const sqlite3 = require('sqlite3').verbose();

// Configure SQLite database for persistence
const db = new sqlite3.Database('./sessions.sqlite');

// Create table if it doesn't exist
db.run(`
    CREATE TABLE IF NOT EXISTS sessions (
        userId TEXT PRIMARY KEY,
        step TEXT NOT NULL DEFAULT 'inicio',
        lastActive INTEGER NOT NULL
    )
`);

// Get user session
function getSession(userId) {
    return new Promise((resolve, reject) => {
        db.get('SELECT * FROM sessions WHERE userId = ?', [userId], (err, row) => {
            if (err) return reject(err);

            if (row) {
                // Update activity timestamp
                db.run('UPDATE sessions SET lastActive = ? WHERE userId = ?', [Date.now(), userId]);
                resolve(row);
            } else {
                // Create new session
                const newSession = {
                    userId: userId,
                    step: 'inicio',
                    lastActive: Date.now()
                };
                db.run('INSERT INTO sessions (userId, step, lastActive) VALUES (?, ?, ?)',
                    [userId, 'inicio', newSession.lastActive],
                    (err) => {
                        if (err) return reject(err);
                        resolve(newSession);
                    }
                );
            }
        });
    });
}

// Update session step
function setStep(userId, step) {
    return new Promise((resolve, reject) => {
        db.run('UPDATE sessions SET step = ?, lastActive = ? WHERE userId = ?',
            [step, Date.now(), userId],
            function (err) {
                if (err) return reject(err);
                resolve();
            }
        );
    });
}

// Reset session
function resetSession(userId) {
    return new Promise((resolve, reject) => {
        db.run('DELETE FROM sessions WHERE userId = ?', [userId], (err) => {
            if (err) return reject(err);
            resolve();
        });
    });
}

// Clean inactive sessions (> 30 minutes)
function cleanSessions() {
    const expiryTime = Date.now() - 30 * 60 * 1000; // 30 minutes
    db.run('DELETE FROM sessions WHERE lastActive < ?', [expiryTime], (err) => {
        if (err) console.error('Error cleaning sessions:', err);
        else console.log(`Inactive sessions cleaned: ${this.changes}`);
    });
}

module.exports = { getSession, setStep, resetSession, cleanSessions };