/**
 * Created by trnay on 2017/01/19.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    twitter_id : {type: String, required: true, unique: true},
    name: String,
    age: Number
});

module.exports = mongoose.model('User', UserSchema);