require('dotenv').config();
const mongoose = require('mongoose');

// conexión a bd 
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 30000, // Aumentado a 30 segundos
  socketTimeoutMS: 45000, // Tiempo de espera del socket
  ssl: true,
  sslValidate: false
}).then(() => console.log("Conexión exitosa a MongoDB"))
  .catch(err => console.error("Error al conectar a MongoDB:", err));


// defino el esquema 
const personSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: Number,
  favoriteFoods: [String],
})

// creo el documento Person
let Person = mongoose.model('Person', personSchema)



const createAndSavePerson = (done) => {
  const person = new Person({
    name: "Pedro",
    age: 45,
    favoriteFoods: ["Pizza"]
  })
  person.save()
    .then(saveDoc => {
      console.log("Persona guardada:", saveDoc)
      done(null, saveDoc);
    })
    .catch(err => {
      console.log("Error al guardar persona:", err)
      done(err, null);
    })
};

const createManyPeople = (arrayOfPeople, done) => {
  Person.insertMany(arrayOfPeople)
    .then(saveDocs => {
      console.log("Personas guardadas:", saveDocs);
      done(null, saveDocs);
    })
    .catch(err => {
      console.error("Error al guardar personas:", err);
      done(err, null);
    });
};

createManyPeople([
  { name: "Alberto", age: 45, favoriteFoods: ["Hot Dog"] },
  { name: "Maria", age: 30, favoriteFoods: ["Hamburger"] },
  { name: "Luis", age: 25, favoriteFoods: ["Tacos"] }
], (err, people) => {
  if (err) {
    console.error("Error al crear muchas personas:", err);
  } else {
    console.log("Personas creadas:", people);
  }
});

const findPeopleByName = (personName, done) => {
  Person.find({ name: personName })
    .then(findDocs => {
      console.log("Personas encontradas:", findDocs);
      done(null, findDocs);
    })
    .catch(err => {
      console.error("Error al encontrar personas:", err);
      done(err, null);
    });

};
perssonName = "Alberto";

const findOneByFood = (food, done) => {
  Person.findOne({ favoriteFoods: food })
    .then(findDoc => {
      console.log("Persona encontrada:", findDoc);
      done(null, findDoc);
    })
    .catch(err => {
      console.error("Error al encontrar persona:", err);
      done(err, null);
    });
};

food = "Pizza";

const findPersonById = (personId, done) => {
  Person.findById(personId)
    .then(findDoc => {
      console.log("Persona encontrada:", findDoc);
      done(null, findDoc);
    })
    .catch(err => {
      console.error("Error al encontrar persona:", err);
      done(err, null);
    });

};
// personId = '681e656d69b7f80630cec85c';


const findEditThenSave = (personId, done) => {
  const foodToAdd = 'hamburger';
  console.log(`[findEditThenSave] DEBUG: Iniciando con personId: "${personId}"`); // Log del ID de entrada

  Person.findById(personId)
    .then(person => {
      if (!person) {
        // Este es un caso importante: si no se encuentra la persona.
        console.error(`[findEditThenSave] DEBUG: Persona no encontrada con ID: "${personId}"`);
        const notFoundError = new Error(`Documento no encontrado con ID ${personId} en findEditThenSave`);
        // Es crucial llamar a done con un error aquí si la prueba espera encontrar algo.
        return done(notFoundError, null);
      }

      console.log(`[findEditThenSave] DEBUG: Persona encontrada: ${JSON.stringify(person, null, 2)}`);
      person.favoriteFoods.push(foodToAdd);
      console.log(`[findEditThenSave] DEBUG: Comida '${foodToAdd}' añadida a favoriteFoods. Lista actual: ${JSON.stringify(person.favoriteFoods)}`);
      console.log(`[findEditThenSave] DEBUG: Intentando guardar la persona actualizada...`);

      return person.save(); // Retorna la promesa de save()
    })
    .then(updatedPerson => {
      // Esto se ejecuta si person.save() fue exitoso.
      console.log(`[findEditThenSave] DEBUG: Persona actualizada y guardada exitosamente: ${JSON.stringify(updatedPerson, null, 2)}`);
      done(null, updatedPerson); // Éxito
    })
    .catch(err => {
      // Esto captura errores de findById o de save.
      console.error(`[findEditThenSave] DEBUG: Error durante la operación: `, err); // Imprime el objeto de error completo
      done(err, null); // Fallo
    });
};
const findAndUpdate = (personName, done) => {
  const ageToSet = 20;
  Person.findOne({ name: personName }, (err, person) => {
    if (err) throw err;
    person.age = ageToSet;
    person.save()
      .then(saveDoc => {
        console.log("Persona guardada:", saveDoc)
        done(null, saveDoc);
      })
      .catch(err => {
        console.log("Error al guardar persona:", err)
        done(err, null);
      })
  });

};


const removeById = (personId, done) => {
  Person.findByIdAndRemove(personId)
    .then(removeDoc => {
      console.log("Persona eliminada:", removeDoc);
      done(null, removeDoc);
    })
    .catch(err => {
      console.error("Error al eliminar persona:", err);
      done(err, null);
    });

};

const removeManyPeople = (done) => {
  Person.remove({ name: "Mary" })
    .then(removeDocs => {
      console.log("Personas eliminadas:", removeDocs);
      done(null, removeDocs);
    })
    .catch(err => {
      console.error("Error al eliminar personas:", err);
      done(err, null);
    });

};

const queryChain = (done) => {
  Person.find({ favoriteFoods: "burrito" })
    .sort({ name: 1 })
    .limit(2)
    .select({ age: 0 })
    .exec()
    .then(findDocs => {
      console.log("Personas encontradas:", findDocs);
      done(null, findDocs);
    })
    .catch(err => {
      console.error("Error al encontrar personas:", err);
      done(err, null);
    });


};

createAndSavePerson((err, person) => {
  if (err) throw err;
  const persona = new Person({
    name: "Julian",
    age: 45,
    favoriteFoods: ["Donas"]
  })

  console.log("Persona creada:", person);
});





/** **Well Done !!**
/* You completed these challenges, let's go celebrate !
 */

//----- **DO NOT EDIT BELOW THIS LINE** ----------------------------------

exports.PersonModel = Person;
exports.createAndSavePerson = createAndSavePerson;
exports.findPeopleByName = findPeopleByName;
exports.findOneByFood = findOneByFood;
exports.findPersonById = findPersonById;
exports.findEditThenSave = findEditThenSave;
exports.findAndUpdate = findAndUpdate;
exports.createManyPeople = createManyPeople;
exports.removeById = removeById;
exports.removeManyPeople = removeManyPeople;
exports.queryChain = queryChain;
