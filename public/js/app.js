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
    $messages.append("<div class='page-header text-center text-capitalize text-danger' style='font-family: Symbola'><b>You have successfully connected to the chatroom " + $chatroom.escapeHTML() + "</b></div>");
});

socket.on('message',function(message){
    var timestamp = moment.utc(message.timestamp).local();
    var low = 0;
    var text;
    if(message.name === 'System')
        $messages.append('<li class="list-group-item" style="background-color: #6db2d1;font-family: Symbola;"><b>' + timestamp.format('ddd Do,MMM YYYY @ h:mm:ss a') + '</b><br>' + message.name + ' : ' + message.text + '</li>');
    else{
        text = "<li class='list-group-item' style='font-family: Symbola'><b>" + timestamp.format("ddd Do,MMM YYYY @ h:mm:ss a") + "</b><br>" + message.name + " : ";
        if(message.text.length > 63)
            {
                text += "<br>";
                for (var i = 0; i < message.text.length; i+=63) {
                    text += message.text.substring(low,low+63) + "<br>";
                    low = low + 63;
                }
            text += "</li>";
            $messages.append(text);
            }
        else    
            {
                text += message.text + "</li>";
                $messages.append(text);
            }
    }
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
    else alert('Please enter the message !!');
});