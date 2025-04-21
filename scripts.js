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
  llenarSelect(pokemonsAMostrar);

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
      <div class="pokemons-cards" id="${pokemon.name}">
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


const selectFiltro = document.getElementById("pokemon_filtro"); //Hacemos referencia al elemento <select> y lo guardamos para usarlo despues

function llenarSelect(pokemons) { //Recibe un array
  selectFiltro.innerHTML = `<option value="">Selecciona un Pokémon</option>`; //Reinicia el contenido del select, dejando solo una opción inicial vacía
  
  pokemons.forEach(p => { //Recorremos el array con foreach
    const option = document.createElement("option"); // Para cada pokemon se crea un <option> (esto crea el objeto HTML <option>)
    option.value = p.name; //El valor sera el nombre del pokemon
    option.textContent = p.name; //El texto sera el nombre del pokemon tambien
    selectFiltro.appendChild(option); //Lo agrega al select con appendChild
  });
}


selectFiltro.addEventListener("change", (e) => { //Se activa cada vez que el usuario cambia la selección del select
  const seleccionado = e.target.value; // Guardamos en la variable seleccionado el valor del pokemon elegido. Si no = ""
  const todasLasTarjetas = document.querySelectorAll('.pokemons-cards'); // Selecciona todas las tarjetas de pokemon que tengan la clase .pokemons-cards

  if (seleccionado === "") { //Si no hay ningun pokemon seleccionado se muestran todas las tarjetas
    // Mostrar todas las tarjetas
    todasLasTarjetas.forEach(t => t.style.display = "block"); //Va a cada tarjeta y con style.display = "block" se van mostrando
  } else { //Si no, se ocultan todas las tarjetas
    // Ocultar todas
    todasLasTarjetas.forEach(t => t.style.display = "none");

    // Mostrar solo la tarjeta con el id seleccionado
    const tarjeta = document.getElementById(seleccionado); //Busca la tarjeta con id igual al nombre del pokemon seleccionado
    if (tarjeta) {
      tarjeta.style.display = "block"; //Si la encuentra la muestra.
    }
  }
});



//esto se activa al presionar el botón, lo que ejecuta todo el código anteriormente visto dándole funcionalidad a la página.
window.addEventListener("DOMContentLoaded", cargarPokemons);

//Selecionamos y guardamos todos los botones, tanto los de desktop como los mobile
const botonesGen1 = document.querySelectorAll("#btn-gen1, #btn-gen1-m");
const botonesGen2 = document.querySelectorAll("#btn-gen2, #btn-gen2-m");
const botonesGen3 = document.querySelectorAll("#btn-gen3, #btn-gen3-m");
const botonesGen4 = document.querySelectorAll("#btn-gen4, #btn-gen4-m");

// Agrupamos todos los botones para poder reiniciar colores fácilmente
const todosLosBotones = [
  ...botonesGen1,
  ...botonesGen2,
  ...botonesGen3,
  ...botonesGen4
];

// Función que asigna eventos y colores por generación
function asignarEvento(botones, inicio, fin) { //Funcion que resive los botones y el rango de los pokemons a mostrar
  botones.forEach(boton => { //Para cada boton hacer...
    boton.addEventListener("click", (e) => { //Para cada boton escuchar el click
      cargarRangoPokemons(inicio, fin); //Cargamos los pokemon del boton correspondiente

      // Estilo para el botón presionado
      todosLosBotones.forEach(b => b.style.backgroundColor = "#ffffff"); //los demas botones en blanco
      e.target.style.backgroundColor = "#1b1c3f"; //El selecionado en otro color
    });
  });
}

// Asignamos la función a cada grupo de botones con su respectivo rango
asignarEvento(botonesGen1, 1, 15);
asignarEvento(botonesGen2, 152, 166);
asignarEvento(botonesGen3, 252, 266);
asignarEvento(botonesGen4, 387, 401);





// Elementos del DOM
const hamburger = document.getElementById("hamburguesa");
const mobileMenu = document.querySelector(".mobile_only");
const closeBtn = document.querySelector(".mobile_only .close_menu");
const overlay = document.querySelector(".overlay");

// Abrir el menú móvil al hacer clic en el botón hamburguesa
hamburger.addEventListener("click", () => {
  mobileMenu.classList.add("active");
  overlay.classList.add("active");
});

// Cerrar el menú al hacer clic en el botón de cierre ("X")
closeBtn.addEventListener("click", () => {
  mobileMenu.classList.remove("active");
  overlay.classList.remove("active");
});

// Cerrar el menú al hacer clic en el overlay
overlay.addEventListener("click", () => {
  mobileMenu.classList.remove("active");
  overlay.classList.remove("active");
});

// Si la ventana se agranda, cerrar automáticamente el menú
window.addEventListener("resize", () => {
  if (window.innerWidth > 768) {
    mobileMenu.classList.remove("active");
    overlay.classList.remove("active");
  }
});
