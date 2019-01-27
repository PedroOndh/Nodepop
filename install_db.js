'use strict';

/**
 * Crear los datos iniciales de la base de datos
 */

const readline = require('readline');

const db = require('./lib/connectMongoose');
const Anuncio = require('./models/Anuncio');
const anunciosData = require('./data/anuncios.json');

db.once('open', async () => {
  try {
    
    // preguntar al usuario si quiere borrar la base de datos
    const respuesta = await askUser('Estás seguro que quieres que borre TODA la base de datos? (no) ');

    if (respuesta.toLowerCase() !== 'si') {
      console.log('Abortado!');
      process.exit(0);
    }

    //await initanuncios();
    await initModel(Anuncio, anunciosData, 'anuncios');

    db.close();

  } catch(err) {
    console.log('Hubo un error', err);
    process.exit(1);
  }

});

function askUser(question) {
  return new Promise((resolve, reject) => {
    const interfaz = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    interfaz.question(question, answer => {
      interfaz.close();
      resolve(answer);
      return;
    });
  });
}


async function initModel(Model, data, modelName) {
  const deleted = await Model.deleteMany();
  console.log(`Eliminados ${deleted.n} ${modelName}.`);

  const insertados = await Model.insertMany(data);
  console.log(`Insertados ${insertados.length} ${modelName}.`);
}