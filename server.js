var PORT = process.env.PORT || 3000;
var express = require('express');
var emoji = new require('emoji-translate')();
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var moment = require('moment');
var clientInfo = {};

app.use(express.static(__dirname + '/public'));

io.on('connection',function(socket){
    console.log('User connected to socket.io server');

    socket.on('disconnect',function(){
        var user = clientInfo[socket.id];
        if(typeof user !== 'undefined'){
            socket.leave(user);
            io.to(user.chatroom).emit('message',{
                name: 'System',
                text: user.name + ' has left the Chatroom !!',
                timestamp: moment().valueOf()
            });
        }
    });

    socket.on('joinRoom',function(req){
        clientInfo[socket.id] = req;
        socket.join(req.chatroom);
        socket.broadcast.to(req.chatroom).emit('message',{
            name: 'System',
            text: req.name + ' has joined the Chatroom !!',
            timestamp: moment().valueOf()
        });
    });

    socket.on('message',function(message){
        message.timestamp = moment().valueOf();
        console.log(message.timestamp + ' ' + message.name + ' : ' + message.text);
        message.text = emoji.translate(message.text);
        io.to(clientInfo[socket.id].chatroom).emit('message',message);
    });

    socket.emit('message',{
        name: 'System',
        text: 'Welcome to the chat application',
        timestamp: moment().valueOf()
    });
});

http.listen(PORT,function(){
    console.log('Server listening at port ' + PORT);
});