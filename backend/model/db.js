const admin = require("firebase-admin");

const credentials = require("../../serviceAccountCredentials.json");

admin.initializeApp({
    credential: admin.credential.cert(credentials),
});

const db = admin.firestore();

module.exports = { db, admin };

