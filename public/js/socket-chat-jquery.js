
var params = new URLSearchParams( window.location.search );

var nombre = params.get('nombre');
var sala = params.get('sala');

// Referencias de jquery
const divUsuarios = $('#divUsuarios');
const formEnviar  = $('#formEnviar');
const txtMensaje  = $('#txtMensaje');
const divChatbox  = $('#divChatbox');
const tituloChat  = $('#tituloChat');

// Funciones para renderizar usuarios
function renderUser( persons ) {    

    var titulo = '<h3 class="box-title">Sala de chat <small>'+ params.get('sala').toLocaleUpperCase() +'</small></h3>';
    tituloChat.html( titulo );

    var html = '';

    html += '<li>';
    html +=     '<a href="javascript:void(0)" class="active"> Chat de <span>'+ params.get('sala') +'</span></a>';
    html += '</li>';


    for( var i = 0; i < persons.length; i++ ){
        html += '<li>';
        html +=     '<a data-id="'+ persons[i].id +'" href="javascript:void(0)"><img src="assets/images/users/1.jpg" alt="user-img" class="img-circle"> <span>'+ persons[i].name +'<small class="text-success">online</small></span></a>';
        html += '</li>';
    }

    divUsuarios.html(html);

}

// Funciones para renderizar los mensajes
function renderMessage( message , yo ) {

    var html  = "";
    var fecha = new Date( message.fecha );
    var hora  = fecha.getHours() + ':'+ fecha.getMinutes();

    var adminClass = 'info';
    if( message.nombre === "Administrador" ) {
        adminClass = 'danger';
    }    

    if( yo ){
        html += '<li class="reverse">';
        html += '        <div class="chat-content">';
        html += '            <h5>'+ message.nombre +'</h5>';
        html += '        <div class="box bg-light-info">'+ message.mensaje +'</div>';
        html += '    </div>';
        html += '    <div class="chat-img"><img src="assets/images/users/5.jpg" alt="user" /></div>';
        html += '    <div class="chat-time">'+ hora +'</div>';
        html += '</li>';
    } else {
        html += '<li class="animated fadein" >';
        if( message.nombre !== "Administrador" ){
            html += '    <div class="chat-img"><img src="assets/images/users/1.jpg" alt="user" /></div>';
        }
        html += '        <div class="chat-content">';
        html += '            <h5>'+ message.nombre +'</h5>';
        html += '            <div class="box bg-light-'+ adminClass +'">'+ message.mensaje +'</div>';
        html += '        </div>';
        html += '    <div class="chat-time">'+ hora +'</div>';
        html += '</li>';
    }

    divChatbox.append( html ); 
}

// funcion para nuestro scroll de nuestro div de chat
function scrollBottom() {

    // selectors
    var newMessage = divChatbox.children('li:last-child');

    // heights
    var clientHeight = divChatbox.prop('clientHeight');
    var scrollTop = divChatbox.prop('scrollTop');
    var scrollHeight = divChatbox.prop('scrollHeight');
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight() || 0;

    if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
        divChatbox.scrollTop(scrollHeight);
    }
}

// Listeners de jquery
divUsuarios.on('click', 'a', function() {
    var id = $(this).data('id');
    
    // if( id ){
    //     console.log( id );
    // }

});

formEnviar.on('submit', function( event ) {

    event.preventDefault();

    if( txtMensaje.val().trim().length === 0 ){
        return;
    }
    
    socket.emit("crear-mensaje-cli", { mensaje : txtMensaje.val() } , ( mensaje ) => {
        // console.log( mensaje );
        renderMessage( mensaje, true );
        txtMensaje.val('').focus();
        scrollBottom();
    });

});
