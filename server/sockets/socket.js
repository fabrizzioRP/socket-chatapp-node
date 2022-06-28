const Users = require("../class/usuario");

const { crearMensaje } = require("../utils/utilidades");

const user = new Users();

const socketController = ( socket, io ) => {

    socket.on("entrarChat", ( data, callback ) => {

        if( !data.nombre || !data.sala ) {
            return callback({
                ok: false,
                msg: "EL nombre y sala es necesario"
            });
        }

        // Crear sala y unir a este usuario a esa sala
        socket.join( data.sala );

        user.addPerson( socket.id , data.nombre , data.sala );

        socket.broadcast.to( data.sala ).emit("notification-userConn", user.getPersonPerRoom( data.sala ) );

        callback( { ok: true, msg: data } );

    });

    socket.on("disconnect", () => {

        let pr = user.removePerson( socket.id );

        socket.to(pr.sala).emit("notification-leaveUser", crearMensaje( "Administrador", `${ pr.name } se desconecto` ) );
        socket.to(pr.sala).emit("notification-userConn", user.getPersonPerRoom( pr.sala ) );

    });

    socket.on("crear-mensaje-cli", ( data ) => {

        let persona = user.getPerson( socket.id );

        socket.broadcast.to( persona.sala ).emit( "enviar-mensaje-ser", crearMensaje( persona.name, data.mensage ) );
    });

    // Mensajes Privados
    socket.on("crear-mensajepri-cli", ( data ) => {
        let persona =  user.getPerson( socket.id );
        socket.broadcast.to( data.to ).emit( 'crear-mensajepri-ser', crearMensaje(persona.name, data.mensaje) );
    });

}


module.exports = { socketController };