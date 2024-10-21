// Morgan logging

import morgan, { token } from 'morgan';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Create __dirname equivalent for ES modules

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Log file stream setup
const logStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' });

// Define custom logging format

const customMorganFormat = morgan((tokens, req, res) => {
    return [
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        tokens['response-time'](req, res), 'ms'
    ].join(' ');
}, { stream: logStream });

// Export Morgan configuration

export default customMorganFormat;