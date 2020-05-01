// const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.get = require('./getFunctions');
exports.on = require('./onEvent');
exports.add = require('./addFunctions');
exports.modify = require('./modifyFunctions');
exports.delete = require('./deleteFunctions');
exports.user = require('./userFunctions');
exports.calculate = require('./calculateFunctions');
exports.chat = require('./chatFunctions')
