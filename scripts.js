const cards= document.getElementById('cards');
const errorSection = document.getElementById('error-section');
let todosLosPokemons = [];

async function cargarPokemons() {
  cards.innerHTML="";

  try {
    const res = await fetch('https://pokeapi.co/api/v2/pokemon?limit=410');
    if (!res.ok) throw new Error(`Error en la solicitud: ${res.status}`);

    const data= await res.json();
    const detallesPromises = data.results.map( pokemon =>
      fetch(pokemon.url).then(r => r.json())
    );
    todosLosPokemons = data.results;
    cargarRangoPokemons(1,15); 


  } catch (error) {
    console.error("Error al cargar Pokémon:", error);
    errorSection.style.display = "flex";
  }
  
}

async function cargarRangoPokemons(from,to){
  cards.innerHTML= "";
  const pokemonsAMostrar = todosLosPokemons.slice(from - 1, to);

  const informacion = await Promise.all(
    pokemonsAMostrar.map(p => fetch(p.url).then(r => r.json()))
  );

  informacion.forEach(pokemon => {
    const tipos = pokemon.types.map(t =>
      `<div class="${t.type.name}"><p>${t.type.name.toUpperCase()}</p></div>`
    ).join("");

    const habilidades = pokemon.abilities.map(h =>
      `<li>${h.ability.name}</li>`
    ).join("");

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