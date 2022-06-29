const express = require('express');
require("dotenv").config();

const { socketController } = require("./sockets/socket");

const app = express();
const server = require('http').createServer(app);
const io = require("socket.io")(server);

const port = process.env.PORT || 3000;

app.use(express.static("public"));

io.on("connection", socketController );

server.listen(port, (err) => {

    if (err) throw new Error(err);

    console.log(`Servidor corriendo en puerto ${ port }`);

});