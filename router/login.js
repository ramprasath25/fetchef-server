const Router = require('restify-router').Router;
const router = new Router();
const jwt = require('jsonwebtoken');
const config = require('../config');
const userCollection = config.db.collection('user');
const tokenList = {};

router.post('/', (req, res) => {
    const data = req.body;
    const user = {
        name: data.name,
        email: data.email
    }    
    const token = jwt.sign(user, config.secret, {expiresIn: config.tokenLife});
    const refreshToken = jwt.sign(user, config.refreshToken, {expiresIn: config.refreshTokenLife});
    data.token = token;
    data.refreshToken = refreshToken;
    userCollection.save(data, (err, result) => {
        if(err) {
            res.send(500, "Internal Server Error");
        } else {
            tokenList[refreshToken] = data;
            res.send(200, result);
        }
    });
});

router.post('/token', (req, res) => {
    const reqToken = req.body.refreshToken;
    if (reqToken && (reqToken in tokenList)) {
        const user = {
            username: req.body.username,
            password: req.body.password
        }
        const token = jwt.sign(user, config.secret, {expiresIn: config.tokenLife});
        const response= {
            token:  token
        }
        res.send(200, response);
    } else {        
        res.send(400, "Invalid Token")
    }
});

module.exports = router;