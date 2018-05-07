
const restify = require('restify');
const restError = require('restify-errors');
const logger = require('morgan');
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const config = require('./config');
const loginRoutes = require('./router/login');
const userRoutes = require('./router/userRoutes');
const corsMiddleware = require('restify-cors-middleware');

const server = restify.createServer({
    name: config.appName,
    version: config.appVersion
});
const cors = corsMiddleware({
    preflightMaxAge: 5,
    origins: ['*'],
    allowHeaders: ['API-Token'],
    exposeHeaders: ['API-Token-Expiry']
})
server.use(restify.plugins.acceptParser(server.acceptable));
server.use(restify.plugins.queryParser({ mapParams: true }));
server.use(restify.plugins.fullResponse());
server.use(restify.plugins.bodyParser());
server.pre(cors.preflight);
server.use(cors.actual);
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
    if (req.url.startsWith('/login')) {
        return next();
    } else {
        const token = req.headers['x-access-token'];        
        if (token) {
            jwt.verify(token, config.secret, (err, decode)=> {
                if(err) {
                    return next(new restError.NotAuthorizedError("Token not found"))
                } else {
                    return next();
                }
            });
        } else {
            return next(new restError.NotAuthorizedError("Token Not found"));
        }
    }
})
server.get('/', (req, res) => {
    // console.log(config)
    const db = config.db;
    const myColl = db.collection('roles')
    myColl.find((err, docs) => {
        console.log(docs)
    });
    res.send(200, "Rest API Server");
});

loginRoutes.applyRoutes(server, '/login');
userRoutes.applyRoutes(server, '/user');

server.listen(config.appPort, () =>{
    console.log('Server running at', server.name, server.url);
});
