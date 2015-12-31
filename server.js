var PORT = process.env.PORT || 3000;
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var now = require('moment')();

app.use(express.static(__dirname + '/public'));

io.on('connection',function(socket){
    console.log('User connected to socket.io server');

    socket.on('message',function(message){
        message.timestamp = now.valueOf();
        console.log(message.timestamp + ' ' + message.name + ' : ' + message.text);
        io.emit('message',message);
    });

    socket.emit('message',{
        name: 'System',
        text: 'Welcome to the chat application',
        timestamp: now.valueOf()
    });
});

http.listen(PORT,function(){
    console.log('Server listening at port ' + PORT);
});