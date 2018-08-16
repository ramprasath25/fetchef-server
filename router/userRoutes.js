const Router = require('restify-router').Router;
const router = new Router();
const restError = require('restify-errors');
const mongojs = require('mongojs');
const config = require('../config');
const user_settingsColl = config.db.collection('user_settings');
const user_inventoryColl = config.db.collection('user_inventory');
const uripath = '/settings';
const iventoryPath = '/inventory';
const apiversion = { version: '1.0.0' };
const recipeController = require('../controllers/recipeList');
const userSettingsController = require('../controllers/settings');
//Get settings
router.get({ path: uripath + '/:userId', apiversion }, (req, res, next) => {
    userSettingsController.getSettings(req.params.userId, (err, result) => {
        if (err) {
            return next(new restError.InternalServerError("Error please try later"));
        } else {
            res.send(200, { message: "ok, success", data: result })
        }
    });
});
//Get Recipe List
router.get({ path: '/getRecipeList/:userId', apiversion }, (req, res, next) => {
    recipeController.getRecipeList(req.params.userId, (err, result) => {
        if (err) {
            return next(new restError.InternalServerError("Error please try later"));
        } else {
            res.send(200, { message: "ok, success", data: result })
        }
    });
});
// Get Recipe Details
router.post({ path: '/getRecipeDetails/:userId', apiversion }, (req, res, next) => {
    recipeController.getRecipeDetails(req.body.recipeId, (err, result) => {
        if (err) {
            return next(new restError.InternalServerError("Error please try later"));
        } else {
            res.send(200, { message: "ok, success", data: result })
        }
    });
});
//Save
router.post({ path: uripath, apiversion }, (req, res, next) => {
    user_settingsColl.save(req.body, (err, result) => {
        if (err) {
            return next(new restError.InternalServerError("Error please try later"));
        } else {
            res.send(200, { message: "ok, success", data: result });
        }
    });
});
//Update
router.put({ path: uripath + '/:name', apiversion }, (req, res, next) => {
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
});
//Delete
router.del({ path: uripath + '/:name', apiversion }, (req, res, next) => {
    user_settingsColl.remove({ name: req.params.name }, (err, result) => {
        if (err) {
            return next(new restError.InternalServerError("Error please try later"));
        } else {
            res.send(200, { message: "delete success" });
        }
    });
});
//List Inventory
router.get({ path: iventoryPath + '/:userId', apiversion }, (req, res, next) => {
    user_inventoryColl.find({ userId: req.params.userId }, (err, result) => {
        if (err) {
            return next(new restError.InternalServerError("Error please try later"));
        } else {
            res.send(200, { message: "ok, success", data: result });
        }
    });
});
// Post Inventory
router.post({ path: iventoryPath, apiversion }, (req, res, next) => {
    req.body.createdDate = new Date();
    user_inventoryColl.save(req.body, (err, result) => {
        if (err) {
            return next(new restError.InternalServerError("Error please try later"));
        } else {
            res.send(200, { message: "ok, success", data: result });
        }
    });
});
// Delete Inventory
router.del({ path: iventoryPath + '/:id', apiversion }, (req, res, next) => {
    user_inventoryColl.remove({ '_id': mongojs.ObjectID(req.params.id) }, (err, result) => {
        if (err) {
            return next(new restError.InternalServerError("Error please try later"));
        } else {
            user_inventoryColl.find({ userId: req.body.userId }, (err, result) => {
                if (err) {
                    return next(new restError.InternalServerError("Error please try later"));
                } else {
                    res.send(200, { message: "ok, success", data: result });
                }
            });
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
});
// Post Diet
router.post({ path: '/diet', apiversion }, (req, res, next) => {
    const data = req.body;
    user_settingsColl.findAndModify({
        query: { userId: req.body.userId, type: 'Diet' },
        update: data
    }, (err, result) => {
        if (err) {
            return next(new restError.InternalServerError("Error please try later"));
        } else {
            if (result !== null)
                res.send(200, { message: "upadate success", data: result });
            else {
                user_settingsColl.save(req.body, (err, result) => {
                    if (err) {
                        return next(new restError.InternalServerError("Error please try later"));
                    } else {
                        res.send(200, { message: "ok, success", data: result });
                    }
                });
            }
        }
    });
});
router.post({ path: '/cusine', apiversion }, (req, res, next) => {
    const data = req.body;
    user_settingsColl.findAndModify({
        query: { userId: req.body.userId, type: 'Cusine' },
        update: data
    }, (err, result) => {
        if (err) {
            return next(new restError.InternalServerError("Error please try later"));
        } else {
            if (result !== null)
                res.send(200, { message: "upadate success", data: result });
            else {
                user_settingsColl.save(req.body, (err, result) => {
                    if (err) {
                        return next(new restError.InternalServerError("Error please try later"));
                    } else {
                        res.send(200, { message: "ok, success", data: result });
                    }
                });
            }
        }
    });
});
router.post({ path: '/intolerance', apiversion }, (req, res, next) => {
    const data = req.body;
    user_settingsColl.findAndModify({
        query: { userId: req.body.userId, type: 'Intolerance' },
        update: data
    }, (err, result) => {
        if (err) {
            return next(new restError.InternalServerError("Error please try later"));
        } else {
            if (result !== null)
                res.send(200, { message: "upadate success", data: result });
            else {
                user_settingsColl.save(req.body, (err, result) => {
                    if (err) {
                        return next(new restError.InternalServerError("Error please try later"));
                    } else {
                        res.send(200, { message: "ok, success", data: result });
                    }
                });
            }
        }
    });
});
router.post({ path: '/exclude', apiversion }, (req, res, next) => {
    const data = req.body;
    user_settingsColl.findAndModify({
        query: { userId: req.body.userId, type: 'Exclude' },
        update: data
    }, (err, result) => {
        if (err) {
            return next(new restError.InternalServerError("Error please try later"));
        } else {
            if (result !== null)
                res.send(200, { message: "upadate success", data: result });
            else {
                user_settingsColl.save(req.body, (err, result) => {
                    if (err) {
                        return next(new restError.InternalServerError("Error please try later"));
                    } else {
                        res.send(200, { message: "ok, success", data: result });
                    }
                });
            }
        }
    });
});
module.exports = router;