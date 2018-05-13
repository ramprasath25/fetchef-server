const Router = require('restify-router').Router;
const router = new Router();
const restError = require('restify-errors');
const config = require('../config');
const user_settingsColl = config.db.collection('user_settings');
const user_inventoryColl = config.db.collection('user_inventory');
const uripath= '/settings';
const iventoryPath = '/inventory';
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
//List Inventory
router.get({path: iventoryPath + '/:userId', apiversion}, (req, res, next) => {
    user_inventoryColl.find({userId:req.params.userId},(err, result) => {
        if(err) {
            return next(new restError.InternalServerError("Error please try later"));
        } else {
            res.send(200, { message: "ok, success", data: result });
        }
    });
});
// Post Inventory
router.post({ path: iventoryPath, apiversion }, (req, res, next) => {
    user_inventoryColl.save(req.body, (err, result) => {
        if (err) {
            return next(new restError.InternalServerError("Error please try later"));
        } else {
            res.send(200, { message: "ok, success", data: result });
        }
    });
});
//Update Inventory
router.put({ path: iventoryPath + '/:name', apiversion }, (req, res, next) => {
    const data = req.body;
    user_settingsColl.findAndModify({
        query: { name: req.params.name },
        update: data
    }, (err, result) => {
        if (err) {
            return next(new restError.InternalServerError("Error please try later"));
        } else {
            if (result !== null)
                res.send(200, { message: "upadate success", data: data });
            else
                res.send(404, { message: "Data not found" });
        }
    });
})

module.exports = router;