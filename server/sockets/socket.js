const Users = require("../class/usuario");

const { crearMensaje } = require("../utils/utilidades");

const user = new Users();

const socketController = ( socket ) => {

    // Usuario Conectado
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
        socket.broadcast.to( data.sala ).emit( "enviar-mensaje-ser", crearMensaje('Administrador', `${ data.nombre } se unio` ));

        callback( user.getPersonPerRoom( data.sala ) );

    });

    // Usuario Desconectado
    socket.on("disconnect", () => {

        let pr = user.removePerson( socket.id );

        socket.to(pr.sala).emit("notification-leaveUser", crearMensaje( "Administrador", `${ pr.name } salio` ) );
        socket.to(pr.sala).emit("notification-userConn", user.getPersonPerRoom( pr.sala ) );

    });

    // Crea mensaje global
    socket.on("crear-mensaje-cli", ( data, callback ) => {

        let persona = user.getPerson( socket.id );
        let mensaje =  crearMensaje( persona.name, data.mensaje );

        socket.broadcast.to( persona.sala ).emit( "enviar-mensaje-ser", mensaje);
    
        callback( mensaje );
    });

    // Mensajes Privados
    socket.on("crear-mensajepri-cli", ( data ) => {
        let persona =  user.getPerson( socket.id );
        socket.broadcast.to( data.to ).emit( 'crear-mensajepri-ser', crearMensaje(persona.name, data.mensaje) );
    });

}


module.exports = { socketController };