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
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/jsonAPI');

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
        }).select('-data');
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
        });
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


// ルーティング登録
app.use('/api', router);

var drawingData = [];
var dateOffset;

io.sockets.on('connection', function (socket) {
    var room = {
        id: '',
        data: []
    };
    var i = 0;

    console.log('a user ' + socket.id + ' has connected');

    // enter to the room
    socket.on('joinRoom', function (data) {
        room.id = data.value;
        //room.data[socket.id] = [];
        console.log(room);
        socket.join(room.id);
        console.log('a user ' + socket.id + ' has joined to ' + room.id);
        console.log(socket.adapter.rooms[room.id]);
        i = 0;
        if (socket.adapter.rooms[room.id].length == 3) {
            setTimeout(function () {
                io.sockets.in(room.id).emit('continueToCanvas');
                dateOffset = Date.parse(new Date());
            }, 1000);
        }
    });

    // share drawing
    socket.on('drawInRoom', function (data) {
        socket.broadcast.to(room.id).emit('drawInRoom', data);
        data.data[1].date = Date.parse(new Date()) - dateOffset;
        data.data[1].i = i;
        i = (i + 1) | 0;
        room.data.push(data.data[1]);
    });

    socket.on('commitData', function () {
        drawingData.push({
            userId: socket.id,
            data: room.data
        })
    });

    socket.on('saveArt', function (data) {
        io.sockets.in(room.id).emit('commitData');

        setTimeout(function () {
            // 新しいユーザのモデルを作成する．
            var art = new Art();

            // ユーザの各カラムの情報を取得する．
            art.artId = data.artId;
            art.title = data.title;
            art.description = data.description;
            art.data = drawingData;

            // ユーザ情報をセーブする．
            art.save(function (err) {
                if (err)
                    console.log(err);
                io.sockets.in(room.id).emit('saved');
            });
            console.log(room);
        }, 1000);
    });

    socket.on('disconnect', function () {
        console.log('user disconnected');
        console.log(room);
    })
});

http.listen(3000, function () {
    console.log('listening on *:3000');
});