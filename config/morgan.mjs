// Morgan logging

import fs from 'fs';
import path from 'path';
import morgan from 'morgan';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Create __dirname equivalent for ES modules

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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