// movieWatchlist- key which we will store the watchlist array in LocalStorage
const STORAGE_KEY = 'movieWatchlist';

//get full watchlist array from LocalStorage,if nothing is there an empty array. localstorage always returns strings, so it needs to be parsed.
export function getWatchlist() {
  const stored = localStorage.getItem(STORAGE_KEY);

  return stored ? JSON.parse(stored) : [];
}

//saves a movie to a watchlist.
export function saveMovie(movie) {
  const watchlist = getWatchlist();

  //if the button is clicked multiple times, it won't save duplicates
  if (isMovieSaved(movie.imdbID)) return;

  // using spread ... operator, add the omdb data and 2 extra properties, watched and rating.
  const movieToSave = {
    ...movie,
    watched: false,
    rating: 0
  };

  watchlist.push(movieToSave);

  //make sure the array is a string, before storing
  localStorage.setItem(STORAGE_KEY, JSON.stringify(watchlist));
}

//remove a movie from a watchlist, using the omdb id.
export function removeMovie(imdbID) {
  const watchlist = getWatchlist();

  const updated = watchlist.filter(movie => movie.imdbID !== imdbID);

  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}

//  function to see if the movie is already on the watchlist,returns a boolean.
export function isMovieSaved(imdbID) {
  const watchlist = getWatchlist();
  return watchlist.some(movie => movie.imdbID === imdbID);
}

//toggle watched/unwatched status of the movie
export function toggleWatched(imdbID) {
  const watchlist = getWatchlist();

  const updated = watchlist.map(movie => {
    if (movie.imdbID === imdbID) {
      // flip the watched boolean
      return { ...movie, watched: !movie.watched };
    }
    return movie;
  });

  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}

//save a star rating for the movie.
export function setRating(imdbID, rating) {
  const watchlist = getWatchlist();

  const updated = watchlist.map(movie => {
    if (movie.imdbID === imdbID) {
      return { ...movie, rating };
    }
    return movie;
  });

  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}