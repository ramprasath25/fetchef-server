'use strict'
const restify = require('restify');
const error = require('restify-errors');
const mongodb = require('mongodb').MongoClient;
const logger = require('morgan');
const fs = require('fs');
const path = require('path');
const config = require('./config');
const loginRoutes = require('./router/login');
const userRoutes = require('./router/userRoutes');

const server = restify.createServer({
    name: config.appName,
    version: config.appVersion
});
server.use(logger('dev'));
server.use(restify.plugins.acceptParser(server.acceptable));
server.use(restify.plugins.queryParser({ mapParams: true }));
server.use(restify.plugins.fullResponse());
server.use(restify.plugins.bodyParser());

//Logs
const logPath = path.join(__dirname, 'logs', 'access.log');
if(fs.existsSync(logPath)) {
    console.log('Logs exists');
    server.use(logger('common', {
        stream : fs.createWriteStream(logPath, {flags: 'a'})
    }));
} else {
    fs.mkdirSync(path.dirname(logPath));
    fs.writeFileSync(logPath, {flags : 'wx'});
    console.log('Access Logs created');
}
//Logs skipping Error codes
server.use(logger('dev', {
    skip: function(req, res) {
        return res.statusCode < 400
    }
}));
// Authentication
server.use(function(req, res, next) {    
    if (req.url.startsWith('/') || req.url.startsWith('/login/*')) {
        return next();
    } else {        
        const token = req.headers['x-access-token'];
        
        if (token) {
            return next();
        } else {
            return next(new error.NotAuthorizedError("Token Not found"));
        }
    }
})
server.get('/', (req, res) => {
    res.send(200, "Rest API Server");
});

loginRoutes.applyRoutes(server, '/login');
userRoutes.applyRoutes(server, '/user');

server.listen(config.appPort, () =>{
    mongodb.connect(config.mongodbURI, (err, db) => {
        if (err) {
            console.log('Error connecting to mongodb');
        } else {
            console.log('Server running at', server.name, server.url);
        }
    });
});