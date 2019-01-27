'use strict';

const express = require('express');
const router = express.Router();
const Anuncio = require('../../models/Anuncio');

/**
 * GET /anuncios
 * Obtener una lista de anuncios
 * 
 */
router.get('/', async (req, res, next) => {
  try { // protejemos el código para recoger posibles excepciones
    
    // Recogemos valores de entrada
    const nombre = req.query.nombre;
    const venta = req.query.venta;
    const precio = req.query.precio;
    const tags = req.query.tags;
    const skip = parseInt(req.query.skip);
    const limit = parseInt(req.query.limit);
    const fields = req.query.fields;
    const sort = req.query.sort;

    const filter = {};

    if (nombre) {
      filter.nombre = new RegExp('^' + req.query.nombre, "i");
    }

    if (venta) {
      filter.venta = venta;
    }

    // Habilitamos la posibilidad de filtrar el precio en rangos de mayor y menor que
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

    // Habilitamos la opcion de buscar mas de un tag
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
    const anuncios = await Anuncio.listar(filter, skip, limit, fields, sort);

    res.json({ success: true, results: anuncios });

  } catch(err) {
    next(err);
    return;
  }
});

/**
 * GET /anuncios/tags
 * Obtener una lista de los tags existentes, es decir: todos aquellos utilizados entre todos los anuncios.
 * 
 */
router.get('/tags', async (req, res, next) => {
  try{

    let etiquetasBruto = await Anuncio.find().select('tags -_id');

    let etiquetasArr = [];

    etiquetasBruto.forEach( item => {
      item.tags.forEach( tag => {
        if (etiquetasArr.indexOf(tag) < 0 ){
          etiquetasArr.push(tag);
        }
      });
    });

    res.json({ success: true, results: etiquetasArr });

  } catch(err) {
    next(err);
    return;
  }

});


/**
 * POST /anuncios
 * Crear un anuncio
 */
router.post('/', async (req, res, next) => {
  try {
    const data = req.body;

    const anuncio = new Anuncio(data);

    const anuncioGuardado = await anuncio.save();    

    res.json({ success: true, result: anuncioGuardado });

  } catch(err) {
    next(err);
    return;
  }
});


/**
 * DELETE /anuncios/:id
 * Elimina un anuncio
 */
router.delete('/:id', async (req, res, next) => {
  try {
    const id = req.params.id;

    await Anuncio.deleteOne({ _id: id }).exec();

    res.json({ success: true });

  } catch (err) {
    next(err);
    return;
  }
});

module.exports = router;
