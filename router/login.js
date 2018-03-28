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

module.exports = router;