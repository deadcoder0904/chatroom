var PORT = process.env.PORT || 3000;
var express = require('express');
var emoji = new require('emoji-translate')();
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var moment = require('moment');
var clientInfo = {};

app.use(express.static(__dirname + '/public'));

function splitTheSentence(sentence){
    arr = sentence.split(/\s+/);
    text = "";
    for (var i = 0; i < arr.length; i++)
        text += makeEmoji(arr[i]) + " ";
    return text;
}

function makeEmoji(word){
    temp = word;
    gotEmoji = emoji.translate(temp.toLowerCase());
    console.log("word-"+word);
    console.log("gotEmoji-"+gotEmoji);
    console.log("temp-"+temp);
    if(gotEmoji === temp.toLowerCase())
        return word;
    else return gotEmoji;
}

io.on('connection',function(socket){
    console.log('User connected to socket.io server');

    socket.on('disconnect',function(){
        var user = clientInfo[socket.id];
        if(typeof user !== 'undefined'){
            socket.leave(user);
            io.to(user.chatroom).emit('message',{
                name: 'System',
                text: splitTheSentence(user.name) + ' has left the Chatroom !!',
                timestamp: moment().valueOf()
            });
        }
    });

    socket.on('joinRoom',function(req){
        clientInfo[socket.id] = req;
        socket.join(req.chatroom);
        socket.broadcast.to(req.chatroom).emit('message',{
            name: 'System',
            text: splitTheSentence(req.name) + ' has joined the Chatroom !!',
            timestamp: moment().valueOf()
        });
    });

    socket.on('message',function(message){
        message.timestamp = moment().valueOf();
        console.log(message.timestamp + ' ' + message.name + ' : ' + message.text);
        arr = message.text.split(/\s+/);
        message.name = splitTheSentence(message.name);
        message.text = splitTheSentence(message.text);
        console.log(message.text);
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