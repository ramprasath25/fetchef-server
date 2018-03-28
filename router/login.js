const Router = require('restify-router').Router;
const router = new Router();
const jwt = require('jsonwebtoken');
const config = require('../config');
const tokenList = {};
router.post('/', (req, res) => {
    const user = {
        username: req.body.username,
        password: req.body.password
    }
    
    const token = jwt.sign(user, config.secret, {expiresIn: config.tokenLife});
    const refreshToken = jwt.sign(user, config.refreshToken, {expiresIn: config.refreshTokenLife});
    const response = {
        message: "Logged in successfully",
        token: token,
        refreshToken: refreshToken
    }
    tokenList[refreshToken] = response;
    res.send(200, response);
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