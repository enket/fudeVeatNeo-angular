/**
 * Created by trnay on 2017/01/20.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ArtSchema = new Schema({
    artId : {type: String, required: true, unique: true},
    title: {type: String, required: true, unique: false},
    description: {type: String, required: true, unique: false},
    height: {type: Number, required: true, unique: false},
    width: {type: Number, required: true, unique: false},
    img: {type: String, required: true, unique: false},
    data: [{
        userId: String,
        data: [{
            i: Number,
            x: Number,
            y: Number,
            rad: Number,
            deltaRad: Number,
            dist: Number,
            angle: Number
        }]
    }],
    likes: Number
});

module.exports = mongoose.model('Art', ArtSchema);