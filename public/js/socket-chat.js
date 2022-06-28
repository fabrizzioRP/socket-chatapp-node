
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
        console.log( resp.ok ? `Conectado : ${ resp.msg.nombre }, sala : ${ resp.msg.sala }` : resp.msg );
    });
});

socket.on('disconnect', () => {
    console.log('Perdimos conexión con el servidor');
});

// Notifica y muestra los usuario conectados
socket.on("notification-userConn", ( data ) => {
    console.log( data );
});

// Notifica y muestra el mensaje de usuario desconectado
socket.on("notification-leaveUser", ( data ) => {
    console.log( data );
});

// Evento para enviar mensaje al servidor
// socket.emit("crear-mensaje-cli", { mensage : "Algo" } );

// Evento escucha mensaje del servidor
socket.on("enviar-mensaje-ser", ( data ) => {
    console.log( data );
});

// Evento para enviar mensaje privado
// socket.emit("crear-mensajepri-cli", { to : "idsocketuser" , mensage : "Algo" } );

// Evento enviar mensaje privado
socket.on("crear-mensajepri-ser", ( data ) => {
    console.log( "Mensaje privado", data );
});