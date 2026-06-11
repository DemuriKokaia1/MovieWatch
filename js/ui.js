//import the watchlist functions.
import { saveMovie, removeMovie, isMovieSaved } from './watchlist.js';


 // creates a single movie card element and appends it to the results grid.
 
export function createMovieCard(movie) {
  const grid = document.getElementById('results-grid');

  // create the card container
  const card = document.createElement('div');
  card.classList.add('card');

  // use a placeholder image if OMDB doesn't have a poster
  const posterSrc = movie.Poster !== 'N/A' ? movie.Poster : 'assets/no-poster.png';

  // check if this movie is already in the watchlist
  const saved = isMovieSaved(movie.imdbID);

  // innerHtml for the card.
  card.innerHTML = `
    <img
      class="card__poster"
      src="${posterSrc}"
      alt="Poster for ${movie.Title}"
    >
    <div class="card__body">
      <p class="card__title">${movie.Title}</p>
      <p class="card__year">${movie.Year}</p>
      <button class="card__btn" data-id="${movie.imdbID}">
        ${saved ? 'Remove from Watchlist' : 'Add to Watchlist'}
      </button>
    </div>
  `;

  // clicking the card itself and not the button goes to the details page
  card.addEventListener('click', (e) => {
    // ignore clicks that land on the button — 
    if (e.target.closest('.card__btn')) return;
    window.location.href = `details.html?id=${movie.imdbID}`;
  });

  // The watchlist button closes over the movie object from this iteration —
  // this is a closure: the handler remembers which movie it belongs to
  const btn = card.querySelector('.card__btn');
  btn.addEventListener('click', () => {
    if (isMovieSaved(movie.imdbID)) {
      removeMovie(movie.imdbID);
      btn.textContent = 'Add to Watchlist';
    } else {
      saveMovie(movie);
      btn.textContent = 'Remove from Watchlist';
    }
  });

  grid.appendChild(card);
}


 // renders all movies from a search results array.
  // clears the grid first so old results dont add up.
export function renderResults(movies) {
  const grid = document.getElementById('results-grid');

  // clear previous results before getting new ones
  grid.innerHTML = '';

  movies.forEach(movie => createMovieCard(movie));
}

// show/hide loading message
export function setLoading(visible) {
  const msg = document.getElementById('loading-msg');
  msg.hidden = !visible;
}

//error message, or clear if its empty
export function setError(text) {
  const msg = document.getElementById('error-msg');
  msg.textContent = text;
  msg.hidden = !text;
}

//detail view on a movie, on detail.html
export function renderDetailView(movie) {
  const container = document.getElementById('movie-detail');

  const posterSrc = movie.Poster !== 'N/A' ? movie.Poster : 'assets/no-poster.png';
  const saved = isMovieSaved(movie.imdbID);

  container.innerHTML = `
    <img
      class="detail__poster"
      src="${posterSrc}"
      alt="Poster for ${movie.Title}"
    >
    <div class="detail__info">
      <h1 class="detail__title">${movie.Title}</h1>
      <p class="detail__meta">${movie.Year} · ${movie.Genre} · ${movie.Runtime}</p>
      <p class="detail__rating">⭐ ${movie.imdbRating} / 10</p>
      <p class="detail__plot">${movie.Plot}</p>
      <p class="detail__cast"><strong>Cast:</strong> ${movie.Actors}</p>
      <p class="detail__director"><strong>Director:</strong> ${movie.Director}</p>
      <button class="detail__btn" id="detail-watchlist-btn">
        ${saved ? 'Remove from Watchlist' : 'Add to Watchlist'}
      </button>
    </div>
  `;

  // watchlist button- on the detail page
  const btn = document.getElementById('detail-watchlist-btn');
  btn.addEventListener('click', () => {
    if (isMovieSaved(movie.imdbID)) {
      removeMovie(movie.imdbID);
      btn.textContent = 'Add to Watchlist';
    } else {
      saveMovie(movie);
      btn.textContent = 'Remove from Watchlist';
    }
  });
}