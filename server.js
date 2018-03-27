'use strict'
const restify = require('restify');
const error = require('restify-errors');
const mongdb = require('mongodb').MongoClient;
const logger = require('morgan');
const fs = require('fs');
const path = require('path');
const routes = require('./router/routes');

const server = restify.createServer({
    name: "Rest API",
    version: "1.0.0"
});

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

server.use(logger('dev', {
    skip: function(req, res) {
        return res.statusCode < 400
    }
}));
server.use(restify.plugins.acceptParser(server.acceptable));
server.use(restify.plugins.queryParser());
server.use(restify.plugins.bodyParser());

routes.applyRoutes(server, '/admin');
server.get({path:'/', version: '1.0.0'}, (req, res, next) =>{
    return next(new error.NotAuthorizedError("Input missing"));
});

server.listen(8080, () =>{
    console.log("Server is running at", server.name)
});