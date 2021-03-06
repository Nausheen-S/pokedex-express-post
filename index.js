const express = require('express');
const jsonfile = require('jsonfile');

const FILE = 'pokedex.json';
// Init express app
const app = express();
//Configurations and set up
const reactEngine = require('express-react-views').createEngine();
app.engine('jsx', reactEngine);
// this tells express where to look for the view files
app.set('views', __dirname + '/views');
// this line sets react to be the default view engine
app.set('view engine', 'jsx');

// tell your app to use the module
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

app.get('/pokemon/new', (request,response)=>{
    console.log(request.body);
    response.render("home");
})

app.post('/pokemon', function(request, response) {
    jsonfile.readFile(FILE, (err, obj) =>{
    var items = {
        id: request.body.id,
        num: request.body.num,
        name: request.body.name,
        img: request.body.img,
        height: request.body.height,
        weight: request.body.weight
    };
    console.error(err);
    obj["pokemon"].push(items);
    jsonfile.writeFile(FILE, obj, (err) => {
        response.send("Added pokemon: " + items.name)

         });
     //response.send(items);
})
})

app.get('/pokemon/:id', (request, response) => {

  // get json from specified file
  jsonfile.readFile(FILE, (err, obj) => {

    // check to make sure the file was properly read
    if( err ){

      console.log("error with json read file:",err);
      response.status(503).send("error reading filee");
      return;
    }
    // obj is the object from the pokedex json file
    // extract input data from request
    let inputId = parseInt( request.params.id );

    var pokemon;

    // find pokemon by id from the pokedex json file
    for( let i=0; i<obj.pokemon.length; i++ ){

      let currentPokemon = obj.pokemon[i];

      if( currentPokemon.id === inputId ){
        pokemon = currentPokemon;
      }
    }

    if (pokemon === undefined) {

      // send 404 back
      response.status(404);
      response.send("not found");
    } else {

      response.send(pokemon);
    }
  });
});

app.get('/', (request, response) => {
  response.send("Welcome to pokedex");
  response.render('home', data);
});


app.listen(3000, () => console.log('~~~ Tuning in to the waves of port 3000 ~~~'));