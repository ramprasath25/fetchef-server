const Router = require('restify-router').Router;
const router = new Router();
const jwt = require('jsonwebtoken');
const config = require('../config');
const tokenList = {};
const db = config.db;
// User Login
router.post('/', (req, res) => {
    const user = {
        name: req.body.name,
        email: req.body.email
    }
    const data = req.body;
    console.log(data);
    const token = jwt.sign(user, config.secret, {expiresIn: config.tokenLife});
    const refreshToken = jwt.sign(user, config.refreshToken, {expiresIn: config.refreshTokenLife});
    data.refreshToken = refreshToken;
    const myColl = db.collection('users')
    myColl.save(data, (err, docs) => {
        console.log(err);
        if(err) {
            res.send(500, "Internal server error");
        } else {
            tokenList[refreshToken] = docs;
            res.send(200, docs);
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