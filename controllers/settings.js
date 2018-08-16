const config = require('../config');
const user_settingsColl = config.db.collection('user_settings');
var async = require('async');

exports.getSettings = function (userId, callback) {
    user_settingsColl.find({ userId: userId }, { _id: 0, data: 1, type: 1 }, (err, result) => {
        if (err) {
            callback(true, "Error please try later");
        } else {
            let Diet = result.findIndex(item => item.type == 'Diet');
            let Cusine = result.findIndex(item => item.type == 'Cusine')
            let Intolerance = result.findIndex(item => item.type == 'Intolerance')
            let Exclude = result.findIndex(item => item.type == 'Exclude')
            
            callback(false, result);
        }
    });
}