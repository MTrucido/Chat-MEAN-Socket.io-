angular.module('MiChat', [ 'btford.socket-io'])
.factory('mySocket', function (socketFactory) {
  return socketFactory()
})
.controller('ctrlChat', function($scope, $http, mySocket ) {

  $scope.mensajes = []
  $scope.nuevo_mensaje = {
    usuario : '',
    mensaje : ''
  }
  $scope.alguien_escribiendo = 'Node.js + MongoDB + Angular.js + Socket.io'

  $scope.enviarMensaje = function () {
    mySocket.emit('nuevo_mensaje', $scope.nuevo_mensaje)
    $scope.nuevo_mensaje.mensaje = ''
  }
  $scope.escribiendo = function (usuario) {
    mySocket.emit('escribiendo_msj', usuario)
  }

  function scroll(){
    var element = document.getElementById('lista')
    element.scrollTop = element.scrollHeight
  }

  mySocket.on('mensajes', function (mensajes){
     $scope.mensajes = mensajes
     $scope.alguien_escribiendo = 'Node.js + MongoDB + Angular.js + Socket.io'
     setTimeout(scroll,300);
  })
  mySocket.on('escribiendo', function (usuario){
    $scope.alguien_escribiendo = usuario + ' esta escribiendo ...'
  })

})
