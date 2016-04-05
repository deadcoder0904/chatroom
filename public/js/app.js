function getParameterByName(name) {
    var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
    return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
};

String.prototype.escapeHTML = function() {
    return this.replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
};

var socket = io();
var $username = getParameterByName('username');
var $chatroom = getParameterByName('chatroom');

var $form = $('#chat-form');
var $message = $form.find('input[name=message]');
var $messages = $('#messages');

$('#chat-header').html('WELCOME TO ' + $chatroom.escapeHTML());

socket.on('connect',function(){
    socket.emit('joinRoom',{
        name: $username,
        chatroom: $chatroom
    });
    $messages.append("<div class='page-header text-center text-capitalize text-danger'><b>You have successfully connected to the chatroom " + $chatroom.escapeHTML() + "</b></div>");
});

socket.on('message',function(message){
    var timestamp = moment.utc(message.timestamp).local();
    if(message.name === 'System')
        $messages.append('<li class="list-group-item" style="background-color: #6db2d1"><b>' + timestamp.format('ddd Do,MMM YYYY @ h:mm:ss a') + '</b><br>' + message.name + ' : ' + message.text + '</li>');
    else
        $messages.append('<li class="list-group-item"><b>' + timestamp.format('ddd Do,MMM YYYY @ h:mm:ss a') + '</b><br>' + message.name + ' : ' + message.text + '</li>');
});

$form.on('submit',function(event){
    event.preventDefault();
    if($message.val().trim() !== '')
    {
        socket.emit('message',{
            name: $username.escapeHTML(),
            text: $message.val().escapeHTML().trim()
        });
        $message.val('');
    }
});