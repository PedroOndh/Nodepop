'use strict';

const express = require('express');
const router = express.Router();
const Anuncio = require('../models/Anuncio');


router.get('/', async (req, res, next) => {
  try { // protejemos el código para recoger posibles excepciones


    console.log('req.body', req.query);
    
    // Recogemos valores de entrada
    const nombre = req.query.nombre;
    const venta = req.query.venta;
    const precio = req.query.precio;
    const tags = req.query.tags;
    const skip = parseInt(req.query.skip);
    const limit = parseInt(req.query.limit);
    const sort = req.query.sort;

    const filter = {};

    if (nombre) {
      filter.nombre = new RegExp('^' + req.query.nombre, "i");
    }

    if (venta) {
      filter.venta = venta;
    }

    if (precio) {
      if (precio.includes('-')){
        let precioArr = precio.split('-');
        filter.precio = {};
        if (precioArr[0]){
          filter.precio['$gte'] = precioArr[0];
        }
        if (precioArr[1]){
          filter.precio['$lte'] = precioArr[1];
        }
      }else{
        filter.precio = precio;
      }
    }

    if (tags) {
      if (tags.includes(',')){
        let tagsArr = tags.split(',');
        filter.tags = {};
        filter.tags['$in'] = tagsArr;
      }else{
        filter.tags = tags;
      }
    }

    // buscamos anuncios en la base de datos
    res.locals.anuncios = await Anuncio.listar(filter, skip, limit, null, sort);

    res.render('index', { title: 'Nodepop' });

  } catch(err) {
    next(err);
    return;
  }
});

module.exports = router;
