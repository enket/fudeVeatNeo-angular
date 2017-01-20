/**
 * Created by trnay on 2017/01/20.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ArtSchema = new Schema({
    artId : {type: String, required: true, unique: true},
    title: String,
    description: String,
    data: [{
        userId: String,
        data: [{
            i: Number,
            x: Number,
            y: Number,
            rad: Number,
            deltaRad: Number,
            dist: Number,
            angle: Number,
            date: Number
        }]
    }],
    likes: Number
});

module.exports = mongoose.model('Art', ArtSchema);