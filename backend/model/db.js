const admin = require("firebase-admin");

const credentials = require("../../serviceAccountCredentials.json");

admin.initializeApp({
    credential: admin.credential.cert(credentials),
});

module.exports = admin;

