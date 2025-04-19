const cards= document.getElementById('cards');
const errorSection = document.getElementById('error-section');
let todosLosPokemons = [];

async function cargarPokemons() { //Funcion principal de carga de pokemons
  cards.innerHTML="";

  try {
    const res = await fetch('https://pokeapi.co/api/v2/pokemon?limit=410'); //Peticion HTTP GET. Guardamos la respuesta de la API en la variable res.
    if (!res.ok) throw new Error(`Error en la solicitud: ${res.status}`); //Revisamon si fue exitosa la peticion, si no lanzamos error.

    const data= await res.json(); //Convertimos la respuesta a un objeto JavaScript. data representara toda la respuesta de la API.
    const detallesPromises = data.results.map( pokemon => //data.results.map() Recorre el array de objetos pokemon y crea uno nuevo con lo que le devolvés en cada iteración. Lo que entrega se lo entrega como parámetro a la funcion ()
      fetch(pokemon.url).then(r => r.json()) //Usamos fetch otra vez para obtener todos los detalles los pokemon, (los cuales estan en la url que está en el objeto que se entrego con el fetch original), cada uno por cada uno especificamente. 
    ); //Then toma la respuesta del fetch, y con una funcion flecha lo combierte en objeto JS, el objeto response transformado a JSON es r.
    todosLosPokemons = data.results; //Guardamos el array de pokemons obtenidos desde la API, los cuales tenemos gracias al res.josn(). 410 pokemon
    cargarRangoPokemons(1,15); 


  } catch (error) {
    console.error("Error al cargar Pokémon:", error);
    errorSection.style.display = "flex";
  }
  
}

async function cargarRangoPokemons(from,to){
  cards.innerHTML= ""; //Limpiamos el contenido actual de las cards para no acumularlas
  const pokemonsAMostrar = todosLosPokemons.slice(from - 1, to); //.slice nos permite tomar una parte del array. En este caso desde la posicion from - 1 hasta to (valores ya preestablecidos). from - 1 porque los arrays comienzan en 0.

  const informacion = await Promise.all( //Esperá a que todas las peticiones se resuelvan, y después guardá la info completa de todos los Pokémon en informacion
    pokemonsAMostrar.map(p => fetch(p.url).then(r => r.json())) //De los pokemon a mostar, recorre el array y transforma cada objeto en otra cosa... Del fetch obtienes la info en bruto, y la pasas al .then que la trans forma a un objeto JS.
  );

  informacion.forEach(pokemon => { //recorre uno por uno y te da cada Pokémon como parámetro en la variable.
    const tipos = pokemon.types.map(t => //pokemon.types es un array que contiene los tipos que puede tener un pokemon. Con map vamos a recorrerlos.
      `<div class="${t.type.name}"><p>${t.type.name.toUpperCase()}</p></div>` // t es un de los tipos del pokemon t.type selecciona algo como {name: 'grass'} y t.type.name selecciona 'grass'
    ).join("");

    const habilidades = pokemon.abilities.map(h =>
      `<li>${h.ability.name}</li>`
    ).join("");
    //Creamos las tarjetas desde aquí con HTML
    //A cards le agregamos ...
    //todo eso son propiedades que ya tenemos
    cards.innerHTML += ` 
      <div class="pokemons-cards">
        <div class="image">
          <img width="170px" src="${pokemon.sprites.front_default}" alt="${pokemon.name}"> 
          <h1>${String(pokemon.id).padStart(3, '0')}</h1>
        </div>
        <div class="pokdesc">
          <div class="name">
            <h1 class="pokename">${pokemon.name}</h1>
            <p class="pokenumer">${String(pokemon.id).padStart(3, '0')}</p>
          </div>
          <div class="types">${tipos}</div>  
          <div class="ability">
            <p>habilidades</p>
            <ul>${habilidades}</ul>
          </div>
        </div>
      </div>
    `;



  });


}

//esto se activa al presionar el botón, lo que ejecuta todo el código anteriormente visto dándole funcionalidad a la página.
window.addEventListener("DOMContentLoaded", cargarPokemons);


const boton1 = document.getElementById("btn-gen1");
const boton2 = document.getElementById("btn-gen2");
const boton3 = document.getElementById("btn-gen3");
const boton4 = document.getElementById("btn-gen4");

document.getElementById("btn-gen1").addEventListener("click", (e) => {
  cargarRangoPokemons(1, 15);
  e.target.style.backgroundColor = "#1b1c3f"
  boton2.style.backgroundColor = "#ffffff"
  boton3.style.backgroundColor = "#ffffff"
  boton4.style.backgroundColor = "#ffffff"
});

document.getElementById("btn-gen2").addEventListener("click", (e) => {
  cargarRangoPokemons(152, 166);
  e.target.style.backgroundColor = "#1b1c3f"
  boton1.style.backgroundColor = "#ffffff"
  boton3.style.backgroundColor = "#ffffff"
  boton4.style.backgroundColor = "#ffffff"
});

document.getElementById("btn-gen3").addEventListener("click", (e) => {
  cargarRangoPokemons(252, 266);
  e.target.style.backgroundColor = "#1b1c3f"
  boton1.style.backgroundColor = "#ffffff"
  boton2.style.backgroundColor = "#ffffff"
  boton4.style.backgroundColor = "#ffffff"
});

document.getElementById("btn-gen4").addEventListener("click", (e) => {
  cargarRangoPokemons(387, 401);
  e.target.style.backgroundColor = "#1b1c3f"
  boton1.style.backgroundColor = "#ffffff"
  boton2.style.backgroundColor = "#ffffff"
  boton3.style.backgroundColor = "#ffffff"
});