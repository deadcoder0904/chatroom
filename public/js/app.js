var socket = io();
var $username = getParameterByName('username');
var $chatroom = getParameterByName('chatroom');

var $form = $('#chat-form');
var $message = $form.find('input[name=message]');
var $messages = $('#messages');

function getParameterByName(name) {
    var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
    return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}

String.prototype.escapeHTML = function() {
    return this.replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

socket.on('connect',function(){
    $messages.append('<li class="list-group-item text-success page-header">' + $username.escapeHTML() + ' connected to the chatroom ' + $chatroom.escapeHTML() + "</li>");
});

socket.on('message',function(message){
    $messages.append('<li class="list-group-item"><b>' + message.name + '</b> : <br> ' + message.text + '</li>');
});

$form.on('submit',function(event){
    event.preventDefault();
    if($message.val().trim() !== '')
    {
        socket.emit('message',{
            name: $username.escapeHTML(),
            text: $message.val().escapeHTML().trim()
        });
        $messages.append('<li class="list-group-item"><b>' + $username.escapeHTML() + '</b> : <br> ' + $message.val().escapeHTML().trim() + '</li>');
        $message.val('');
    }
});