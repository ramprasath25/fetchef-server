'use strict'
const restify = require('restify');
const error = require('restify-errors');
const mongdb = require('mongodb').MongoClient;
const routes = require('./router/routes');

const server = restify.createServer({
    name: "Rest API",
    version: "1.0.0"
});

routes.applyRoutes(server, '/admin');
server.get({path:'/', version: '1.0.0'}, (req, res, next) =>{
    return next(new error.InternalServerError("Input missing"));
});
server.listen(8080, () =>{
    console.log("Server is running at", server.name)
});