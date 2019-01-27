'use strict';

const mongoose = require('mongoose');

// definimos el esquema
const anuncioSchema = mongoose.Schema({
  nombre: { type: String, index: true },
  venta: { type: Boolean, index: true },
  precio: { type: Number, index: true },
  foto: String,
  tags: { type: [String], index: true }
}, { collection: 'anuncios' });

// creamos un método estático
anuncioSchema.statics.listar = (filtro, skip, limit, fields, sort) => {
  const query = Anuncio.find(filtro);
  query.skip(skip);
  query.limit(limit);
  query.select(fields);
  query.sort(sort);
  return query.exec();
};


// creamos el modelo
const Anuncio = mongoose.model('Anuncio', anuncioSchema);

module.exports = Anuncio;
