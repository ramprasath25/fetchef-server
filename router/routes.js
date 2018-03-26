const Router = require('restify-router').Router;
const router = new Router()

router.get('/user', (req, res, next) => {
    res.send(200, "Ok Success");
});

module.exports = router;