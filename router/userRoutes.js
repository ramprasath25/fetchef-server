const Router = require('restify-router').Router;
const router = new Router();
const restError = require('restify-errors');
const config = require('../config');
const user_settingsColl = config.db.collection('user_settings');
const uripath= '/settings';
const apiversion = { version: '1.0.0'};
//Get
router.get({ path: uripath+'/:name', apiversion }, (req, res, next) => {
    user_settingsColl.findOne({ name: new RegExp(req.params.name, 'i')}, (err, result) => {
        if(err) {
            return next(new restError.InternalServerError("Error please try later"));
        } else {
            res.send(200, { message: "ok, success", data: result })
        }
    });
});
//Save
router.post({ path: uripath, apiversion }, (req, res, next) => {
    user_settingsColl.save(req.body, (err, result) => {
        if(err) {
            return next( new restError.InternalServerError("Error please try later"));
        } else {
            res.send(200, {message: "ok, success", data: result});
        }
    });
});
//Update
router.put({ path: uripath+'/:name', apiversion }, (req, res, next) => {
    const data = req.body;
    user_settingsColl.findAndModify({
        query: { name: req.params.name },
        update: data
        }, (err, result) => {
        if(err) {
            return next(new restError.InternalServerError("Error please try later"));
        } else {
            if(result !== null)
                res.send(200, { message: "upadate success", data: data});
            else
                res.send(404, { message: "Data not found"});
        }
        });
});
//Delete
router.del({ path: uripath + '/:name', apiversion }, (req, res, next) => {
    user_settingsColl.remove({name: req.params.name}, (err, result) => {
        if (err) {
            return next(new restError.InternalServerError("Error please try later"));
        } else {
            res.send(200, { message: "delete success"});
        }
    });
});
module.exports = router;