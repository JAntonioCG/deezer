const btnSearch = document.getElementById('btnSearch');
const inputSearch = document.getElementById('searchArtist');
let playlist = null;
let tracks = null;
let currentPage = 0; // Página actual
const songsPerPage = 4; // Número de canciones por página

btnSearch.addEventListener('click', () => {
  const artist = inputSearch.value.trim();
  if (artist.length > 0) {
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
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    const result = await response.json();
    if (result && result.data && result.data.length > 0 && result.data[0].artist) {
      loadArtist(result.data[0].artist.id);
    }
    console.log(result);
  } catch (error) {
    console.error('Error al buscar el artista:', error);
  }
};

const loadArtist = async (id) => {
  const url = `https://deezerdevs-deezer.p.rapidapi.com/artist/${id}`;
  const options = {
    method: 'GET',
    headers: {
      'x-rapidapi-key': '67d0813419mshb9742e1ca9e61bfp18229cjsnc20ca06863b3',
      'x-rapidapi-host': 'deezerdevs-deezer.p.rapidapi.com'
    }
  };

  try {
    const response = await fetch(url, options);
    const result = await response.json();
    if (result) {
      loadArtistData(result);
    }
    console.log(result);
  } catch (error) {
    console.error(error);
  }
};

const loadArtistData = async (info) => {
  const img = document.querySelector('.imagen');
  const tituloArtista = document.querySelector('.tituloArtista');
  const descripcionArtista = document.querySelector('.descripcionArtista');

  const urlTracks = info.tracklist;
  const canciones = await fetch(urlTracks);
  tracks = await canciones.json();

  tituloArtista.textContent = info.name;
  descripcionArtista.textContent = `Este artista tiene ${info.nb_album} álbumes y ${info.nb_fan} fans`;
  img.setAttribute('src', info.picture_medium);

  // Reiniciar la página actual y mostrar la primera página de canciones
  currentPage = 0;
  dibujarRenglones(tracks);

  console.log('Canciones => ', tracks);
};

const dibujarRenglones = (canciones) => {
  const templateRegion = document.getElementById('templateMusica').content;
  const fragment = document.createDocumentFragment();
  const musica = document.querySelector('.musicaBusqueda');

  // Limpiar renglones de canciones anteriores, pero mantener los botones de navegación
  const renglonesCanciones = musica.querySelectorAll('.renglonCancion');
  renglonesCanciones.forEach(renglon => renglon.remove());

  // Calcular el rango de canciones para la página actual
  const start = currentPage * songsPerPage;
  const end = start + songsPerPage;
  const cancionesPagina = canciones.data.slice(start, end); // Extraer canciones de la página actual

  cancionesPagina.forEach((track) => {
    const clone = templateRegion.cloneNode(true);
    clone.querySelector('.tituloCancion').textContent = track.title || 'N/A';
    clone.querySelector('.albumCancion').textContent = track.album.title || 'N/A';
    clone.querySelector('.duracionCancion').textContent = formatTime(track.duration);
    clone.querySelector('.imgCancion > img').setAttribute('src', track.album.cover_small);

    fragment.appendChild(clone);
  });

  // Insertar los renglones de canciones sin borrar los botones de navegación
  musica.insertBefore(fragment, musica.querySelector('.navegacion'));

  // Controlar el estado de los botones (deshabilitar si no hay más páginas)
  document.getElementById('prevBtn').disabled = currentPage === 0;
  document.getElementById('nextBtn').disabled = end >= canciones.data.length;

  console.log('Canciones => ', canciones);
};

const formatTime = (seconds) => {
  if (seconds < 0) {
    return '00 : 00';
  }
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;

  const formatMins = String(minutes).padStart(2, '0');
  const formatSecs = String(secs).padStart(2, '0');

  return `${formatMins} : ${formatSecs}`;
};

// Funciones para manejar los botones de navegación
document.getElementById('prevBtn').addEventListener('click', () => {
  if (currentPage > 0) {
    currentPage--;
    dibujarRenglones(tracks); // Mostrar la página anterior de canciones
  }
});

document.getElementById('nextBtn').addEventListener('click', () => {
  if ((currentPage + 1) * songsPerPage < tracks.data.length) {
    currentPage++;
    dibujarRenglones(tracks); // Mostrar la página siguiente de canciones
  }
});
