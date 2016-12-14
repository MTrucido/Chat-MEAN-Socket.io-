
'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const mensajeSchema = new mongoose.Schema({
  usuario : 'string',
  mensaje : 'string'
});

module.exports = mongoose.model('MensajeDB',mensajeSchema);
