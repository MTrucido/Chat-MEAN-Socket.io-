'use strict'

const puerto = process.env.PORT || 3000

// Dependencias y Servidor
const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const mongoose = require('mongoose')

// Modulos nuestros
const MensajeDB = require('./MensajesDB')

app.use(express.static('public'))
app.use(function(req,res,next){
    req.io = io;
    next();
})

let mensajes_lista = []

//--------MongoDB-----------------------------------------
// Coneccion
const coneccion = process.env.MongoURI || 'mongodb://localhost/chat_Angular_websocket'
mongoose.connect(coneccion, conectarDB)

function conectarDB (err, res) {
	if (err) { console.log(`Fallo coneccion a MongoDB, ${err}`) }
  else { console.log(' * Coneccion correcta a MongoDB.') }
}

//---------------------------------------------------------
// Rutas
app.get('/', function(req, res) {
  res.render('/index.html')
});

//------Eventos -------------------------------------------

// Escuchar las nuevas conecciones
io.on('connection', function(socket) {
  console.log('Se ha conectado un usuario')

	  MensajeDB.find({}, function(err, mensajes_db) {
			if (err) { return res.status(500).send(err.message)}
			mensajes_lista = mensajes_db
			socket.emit('mensajes', mensajes_lista)
		})


  // Escuchar el evento 'nuevo_mensaje'
  socket.on('nuevo_mensaje', function(msj) {
		// Guardar_Y_Enviar_Mensaje
		let nuevo_mensaje = new MensajeDB({
	    usuario : msj.usuario,
	    mensaje : msj.mensaje
	  })
	  nuevo_mensaje.save((err) => {
	    if (err) {return res.status(500).send(err.message)}
	    mensajes_lista.push(nuevo_mensaje)
	    // Avisarles a todos
	    // Emitir el evento 'mensajes'
	    io.sockets.emit('mensajes', mensajes_lista)
	  })
  })

	// Escuhar el evento escriviendo
	socket.on('escribiendo_msj', function(usuario) {
	    io.sockets.emit('escribiendo', usuario)
  })

})

server.listen(puerto, () => {
  console.log(`Servidor corriendo en el puerto ${puerto}`);
})
