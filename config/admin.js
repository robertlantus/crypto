
// admin.js

import admin from 'firebase-admin';
import { readFile } from 'fs/promises';

// import serviceAccount from '../../../admin/gecko-users-firebase-adminsdk-1rh4e-479642a01a.json' assert { type: 'json' };

const serviceAccount = JSON.parse(await readFile(new URL('../../../admin/gecko-users-firebase-adminsdk-1rh4e-479642a01a.json', import.meta.url)));

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://gecko-users.firebaseio.com"
});

export const auth = admin.auth();