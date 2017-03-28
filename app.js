/**
 * Created by trnay on 2017/01/18.
 */
var express = require('express');
var path = require('path');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var bodyParser = require('body-parser');

//DB接続
var MONGO_URL = process.env.MONGOHQ_URL || 'mongodb://localhost/jsonAPI';
var mongoose = require('mongoose');
mongoose.connect(MONGO_URL);

//モデルの宣言
var User = require('./models/user');
var Art = require('./models/art');

app.use(express.static(path.join(__dirname, 'app')));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

var router = express.Router();

router.use(function (rwq, res, next) {
    console.log('Something is happening.');
    next();
});

// 正しく実行出来るか左記にアクセスしてテストする (GET http://localhost:3000/api)
router.get('/', function (req, res) {
    res.json({message: 'Successfully Posted a test message.'});
});

// /users というルートを作成する．
// ----------------------------------------------------
router.route('/users')

// ユーザの作成 (POST http://localhost:3000/api/users)
    .post(function (req, res) {

        // 新しいユーザのモデルを作成する．
        var user = new User();

        // ユーザの各カラムの情報を取得する．
        user.twitter_id = req.body.twitter_id;
        user.name = req.body.name;
        user.age = req.body.age;

        // ユーザ情報をセーブする．
        user.save(function (err) {
            if (err)
                res.send(err);
            res.json({message: 'User created!'});
        });
    })

    // 全てのユーザ一覧を取得 (GET http://localhost:8080/api/users)
    .get(function (req, res) {
        User.find(function (err, users) {
            if (err)
                res.send(err);
            res.json(users);
        });
    });

// /users/:user_id というルートを作成する．
// ----------------------------------------------------
router.route('/users/:user_id')

// 1人のユーザの情報を取得 (GET http://localhost:3000/api/users/:user_id)
    .get(function (req, res) {
        //user_idが一致するデータを探す．
        User.findById(req.params.user_id, function (err, user) {
            if (err)
                res.send(err);
            res.json(user);
        });
    })
    // 1人のユーザの情報を更新 (PUT http://localhost:3000/api/users/:user_id)
    .put(function (req, res) {
        User.findById(req.params.user_id, function (err, user) {
            if (err)
                res.send(err);
            // ユーザの各カラムの情報を更新する．
            user.twitter_id = req.body.twitter_id;
            user.name = req.body.name;
            user.age = req.body.age;

            user.save(function (err) {
                if (err)
                    res.send(err);
                res.json({message: 'User updated!'});
            });
        });
    })

    // 1人のユーザの情報を削除 (DELETE http://localhost:3000/api/users/:user_id)
    .delete(function (req, res) {
        User.remove({
            _id: req.params.user_id
        }, function (err, user) {
            if (err)
                res.send(err);
            res.json({message: 'Successfully deleted'});
        });
    });

// /arts というルートを作成する．
// ----------------------------------------------------
router.route('/arts')

// 作品の作成 (POST http://localhost:3000/api/arts)
    .post(function (req, res) {

        // 新しいユーザのモデルを作成する．
        var art = new Art();

        // ユーザの各カラムの情報を取得する．
        art.artId = req.body.artId;
        art.title = req.body.title;
        art.description = req.body.description;
        art.data = req.body.data;

        // ユーザ情報をセーブする．
        art.save(function (err) {
            if (err)
                res.send(err);
            res.json({message: 'User created!'});
        });
    })

    // 作品一覧取得 (GET http://localhost:3000/api/arts)
    .get(function (req, res) {
        Art.find(function (err, arts) {
            if (err)
                res.send(err);
            res.json(arts);
        }).select('-data').select('-img');
    });

// /arts/:artId というルートを作成する．
// ----------------------------------------------------
router.route('/arts/:artId')

// 1人のユーザの情報を取得 (GET http://localhost:3000/api/users/:user_id)
    .get(function (req, res) {
        //user_idが一致するデータを探す．
        Art.findById(req.params.artId, function (err, art) {
            if (err)
                res.send(err);
            res.json(art);
        }).select('-img');
    })

    .delete(function (req, res) {
        Art.remove({
            _id: req.params.artId
        }, function (err, user) {
            if (err)
                res.send(err);
            res.json({message: 'Successfully deleted'});
        });
    });

// /canvases というルートを作成する．
// ----------------------------------------------------
router.route('/canvases')

// 1人のユーザの情報を取得 (GET http://localhost:3000/api/users/:user_id)
    .get(function (req, res) {
        res.json(rooms);
    });

// /canvases/:canvasId というルートを作成する．
// ----------------------------------------------------
router.route('/canvases/:canvasId')

// 1人のユーザの情報を取得 (GET http://localhost:3000/api/users/:user_id)
    .get(function (req, res) {
        res.json(rooms.filter(function (element, index, array) {
            return ( element.uuid && element.uuid === req.params.canvasId );
        })[0]);
    });


// ルーティング登録
app.use('/api', router);

var drawingData = [];
var rooms = [];

io.sockets.on('connection', function (socket) {
    var room = {
        id: '',
        data: []
    };
    var i = 0;

    console.log('a user ' + socket.id + ' has connected');

    // enter to the room
    socket.on('createRoom', function (data) {
        room.id = data.value.uuid;
        rooms.push(data.value);
        console.log(rooms);
        socket.join(room.id);
        console.log('a user ' + socket.id + ' has created room : ' + room.id);
    });

    socket.on('joinRoom', function (data) {
        room.id = data.value;
        socket.join(room.id);
        console.log('a user ' + socket.id + ' has joind to room : ' + room.id);
    });

    socket.on('removeRoom', function () {
        rooms = rooms.filter(function (element, index, array) {
            return ( element.uuid && !(element.uuid === room.id) );
        });
        console.log('a user ' + socket.id + ' has removed room : ' + room.id + ' from list');
    });

    socket.on('leaveRoom', function () {
        socket.leave(room.id);
        console.log('a user ' + socket.id + ' has leaved from room : ' + room.id);
    });

    socket.on('continueToCanvas', function () {
        io.sockets.in(room.id).emit('continueToCanvas');
    });

    // share drawing
    socket.on('drawInRoom', function (data) {
        socket.broadcast.to(room.id).emit('drawInRoom', data);
        room.data.push(data.data[1]);
    });

    socket.on('commitData', function () {
        drawingData.push({
            userId: socket.id,
            data: room.data
        })
    });

    socket.on('saveArt', function (data, imgData) {
        io.sockets.in(room.id).emit('commitData');
        console.log(imgData);

        setTimeout(function () {
            // 新しいユーザのモデルを作成する．
            var art = new Art();

            // ユーザの各カラムの情報を取得する．
            art.artId = data.uuid;
            art.title = data.title;
            art.description = data.description;
            art.height = data.height;
            art.width = data.width;
            art.img = imgData;
            art.data = drawingData;
            drawingData = [];

            // ユーザ情報をセーブする．
            art.save(function (err) {
                if (err)
                    console.log(err);
                io.sockets.in(room.id).emit('saved');
            });
            console.log(room);
        }, 2000);
    });

    socket.on('disconnect', function () {
        console.log('user disconnected');
        console.log(room.id);
    })
});

var port = process.env.PORT || 3000;
http.listen(port, function () {
    console.log('listening on *:3000');
});