const mongojs = require('mongojs');
const db = mongojs('restapi');

const tokenConfig = {
    secret: 'rest-api',
    refreshToken : 'refrestTokens',
    tokenLife: 900,
    refreshTokenLife: 86400,
    mongodbURI: 'mongodb://127.0.0.1:27017',
    appPort: 8080,
    appName: 'Rest-Api',
    appVersion: '1.0.0',
    db: db
}

module.exports = tokenConfig;