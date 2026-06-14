import { searchMovies } from './api.js';
import { renderResults, setLoading, setError } from './ui.js';
import { getWatchlist, toggleWatched, setRating } from './watchlist.js';

// main.js runs on all three pages, so we check which page we're on
// and only run the relevant code for that page

const page = document.body.dataset.page;

if (page === 'index') initSearchPage();
if (page === 'watchlist') initWatchlistPage();
if (page === 'details') initDetailsPage();

//debounce, a closure that delays calling a function until the user stops triggering it, the timer is kept inside the closure scope
function debounce(fn, delay) {
  let timer;
  return function(...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}
// search page

function initSearchPage() {
  const form = document.getElementById('search-form');
  const input = document.getElementById('search-input');

  form.addEventListener('submit', handleSearch);

   const debouncedSearch = debounce(async () => {
    const query = input.value.trim();
    if (!query) return;
    setError('');
    setLoading(true);
    try {
      const type = document.getElementById('type-filter').value;
      const results = await searchMovies(query, type);
      renderResults(results);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, 400);

  input.addEventListener('input', debouncedSearch);
}

// handles the search form submission. reads the query and type filter, calls the API, renders results.
async function handleSearch(e) {
  // prevent the browser from reloading the page on form submit
  e.preventDefault();

  const query = document.getElementById('search-input').value.trim();
  const type  = document.getElementById('type-filter').value;

  // client-side validation — show feedback if input is empty
 if (!query || query.length < 2) {
  setError('Please enter at least 4 characters to search.');
  return;
}

  // clear any previous error and show loading state
  setError('');
  setLoading(true);

  try {
    const results = await searchMovies(query, type);
    renderResults(results);
  } catch (err) {
    // show the error message from api.js to the user
    setError(err.message);
  } finally {
    // always hide loading, whether the call succeeded or failed
    setLoading(false);
  }
}

// watchlist page

function initWatchlistPage() {
  renderWatchlistPage();
}

//reads the watchlist from localStorage and renders each saved movie. also wires up the watched toggle and star rating for each item.

function renderWatchlistPage() {
  const grid = document.getElementById('watchlist-grid');
  const emptyMsg = document.getElementById('empty-msg');
  const watchlist = getWatchlist();

  // clear the grid before re-rendering
  grid.innerHTML = '';

  if (watchlist.length === 0) {
    emptyMsg.hidden = false;
    return;
  }

  emptyMsg.hidden = true;

  // each movie gets its own card with a watched toggle and star rating
  watchlist.forEach(movie => {
    const card = createWatchlistCard(movie);
    grid.appendChild(card);
  });
}

//creates a watchlist card element for a saved movie. closes over the movie object to remember which item it belongs to
 
function createWatchlistCard(movie) {
  const card = document.createElement('div');
card.classList.add('card');
if (movie.watched) {
  card.classList.add('card--watched');
}
 const posterSrc = movie.Poster !== 'N/A' ? movie.Poster : 'assets/no-poster.png';
  card.innerHTML = `
    <img
      class="card__poster"
      src="${posterSrc}"
      alt="Poster for ${movie.Title}"
    >
    <div class="card__body">
      <p class="card__title">${movie.Title}</p>
      <p class="card__year">${movie.Year}</p>
      <div class="card__stars" data-id="${movie.imdbID}">
        ${buildStars(movie.rating)}
      </div>
      <button class="card__btn card__btn--watched" data-id="${movie.imdbID}">
        ${movie.watched ? 'Watched ✓' : 'Mark as Watched'}
      </button>
    </div>
  `;

  // watched toggle  closes over this card's movie object
  const watchedBtn = card.querySelector('.card__btn--watched');
  watchedBtn.addEventListener('click', () => {
    toggleWatched(movie.imdbID);
    // re-render the whole list so the card reflects the new state
    renderWatchlistPage();
  });

  // star rating buttons — each closes over its own star value
  const stars = card.querySelectorAll('.star');
  stars.forEach(star => {
    star.addEventListener('click', () => {
      const value = parseInt(star.dataset.value);
      setRating(movie.imdbID, value);
      renderWatchlistPage();
    });
  });

  return card;
}

//builds the HTML for 5 star buttons, highlighting the saved rating.
function buildStars(current) {
  let html = '';
  for (let i = 1; i <= 5; i++) {
    const filled = i <= current ? '★' : '☆';
    html += `<button class="star" data-value="${i}">${filled}</button>`;
  }
  return html;
}

// details page

async function initDetailsPage() {
  // read the movie ID from the URL — e.g. details.html?id=tt0468569
  const params = new URLSearchParams(window.location.search);
  const imdbID = params.get('id');

  if (!imdbID) {
    document.getElementById('movie-detail').textContent = 'No movie selected.';
    return;
  }

  setLoading(true);

  try {
    // getMovieById is imported inside this function to keep the top-level imports clean — only load what each page needs
    const { getMovieById } = await import('./api.js');
    const { renderDetailView } = await import('./ui.js');

    const movie = await getMovieById(imdbID);
    renderDetailView(movie);
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
}