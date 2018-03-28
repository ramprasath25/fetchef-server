const Router = require('restify-router').Router;
const router = new Router()

const uripath= '/';
const apiversion = { version: '1.0.0'};

router.get({ path: uripath, apiversion }, (req, res, next) => {
    res.send(200, "Ok Success");
});


module.exports = router;