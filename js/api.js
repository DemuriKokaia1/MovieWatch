
const API_KEY = '9a81fab9';
const BASE_URL = 'https://www.omdbapi.com/'; // replace with your API base URL


//search movies/shows by title
export async function searchMovies(query, type = '') {
  const url = `${BASE_URL}?apikey=${API_KEY}&s=${encodeURIComponent(query)}&type=${type}`;
  
  const response = await fetch(url);

  //return an error message, when the server is down,no internet, etc.
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  const data = await response.json();

  //if omdb response is false, when the search can't find anything.
  if (data.Response === 'False') {
    throw new Error(data.Error);
  }
  // if everything goes right, returns the data.
  return data.Search;
}

// movies and shows have their own omdb id, full details will be fetched with this vvv
export async function getMovieById(imdbID) {
  const url = `${BASE_URL}?apikey=${API_KEY}&i=${imdbID}&plot=full`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  const data = await response.json();

  if (data.Response === 'False') {
    throw new Error(data.Error);
  }

  return data;
}