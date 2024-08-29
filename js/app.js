const btnSearch = document.getElementById('btnSearch');
const inputSearch = document.getElementById('searchArtist');
let playlist = null;

btnSearch.addEventListener('click', () => {
  const artist = inputSearch.value.trim(); // Corrección en la función trim y eliminación de espacios en blanco
  if (artist.length > 0) { // Corrección de 'lenght' a 'length'
    searchArtist(artist);
  }
});

const searchArtist = async (name) => {
  const url = `https://deezerdevs-deezer.p.rapidapi.com/search?q=${encodeURIComponent(name)}`;
  const options = {
    method: 'GET',
    headers: {
      'x-rapidapi-key': '7cab1b83e5msh17e67411177cbebp11d719jsn73d43b4538d9',
      'x-rapidapi-host': 'deezerdevs-deezer.p.rapidapi.com'
    }
  };

  try {
    const response = await fetch(url, options);
    if (!response.ok) { // Verificar si la respuesta no fue exitosa
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    const result = await response.json();
    console.log(result);
  } catch (error) {
    console.error('Error al buscar el artista:', error); // Mensaje de error más descriptivo
  }
};
