async function cargarPokemon() {
    const res = await fetch('https://pokeapi.co/api/v2/pokemon?limit=1000');
    const data = await res.json();
    pokemonNames = data.results.map(pokemon => pokemon.name);
  }
  
  cargarPokemon();