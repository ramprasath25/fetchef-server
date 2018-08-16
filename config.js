const mongojs = require('mongojs');
const ObjectId = mongojs.ObjectId;
const db = mongojs('restifyfood');

const tokenConfig = {
    secret: 'rest-api',
    refreshToken: 'refrestTokens',
    tokenLife: 86400,
    refreshTokenLife: 86400,
    mongodbURI: 'mongodb://127.0.0.1:27017/',
    appPort: 8081,
    appName: 'Rest-Api',
    appVersion: '1.0.0',
    db: db,
    ObjectId: ObjectId
}

module.exports = tokenConfig;