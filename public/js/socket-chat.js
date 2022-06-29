
var params = new URLSearchParams( window.location.search );

if( !params.has('nombre') || !params.has('sala') ){
    window.location = "index.html";
    throw new Error("El nombre y sala son necesario");
}

var usuario = { 
    sala: params.get("sala"),
    nombre : params.get("nombre")
 };

var socket = io();

// Mandamos el usuario que entro al chat
socket.on('connect', () => {
    socket.emit('entrarChat', usuario , ( resp ) => {
        renderUser( resp );
    });
});

socket.on('disconnect', () => {
    console.log('Perdimos conexión con el servidor');
});

// Notifica y muestra los usuario conectados
socket.on("notification-userConn", ( data ) => {
    renderUser( data );
});

// Notifica y muestra el mensaje de usuario desconectado
socket.on("notification-leaveUser", ( data ) => {
    renderMessage( data , false );
    scrollBottom();
});

// Evento para enviar mensaje al servidor
// socket.emit("crear-mensaje-cli", { mensaje : "Algo" } );

// Evento escucha mensaje del servidor
socket.on("enviar-mensaje-ser", ( data ) => {
    renderMessage( data , false );
    scrollBottom();
});

// Evento para enviar mensaje privado
// socket.emit("crear-mensajepri-cli", { to : "idsocketuser" , mensage : "Algo" } );

// Evento enviar mensaje privado
socket.on("crear-mensajepri-ser", ( data ) => {
    console.log( "Mensaje privado", data );
});