const apiKey = "904fc70c";
let moviesData = [];

// Search on Enter key
document.getElementById("searchInput").addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    searchMovie();
  }
});

async function searchMovie() {
  const query = document.getElementById("searchInput").value.trim();
  const moviesContainer = document.getElementById("movieContainer");
  moviesContainer.innerHTML = "";

  if (query === "") {
    alert("Please enter a movie name!");
    return;
  }

  try {
    const response = await fetch(
      `https://www.omdbapi.com/?s=${query}&apikey=${apiKey}`
    );
    const data = await response.json();

    if (data.Response === "False") {
      moviesContainer.innerHTML = "<h2>Movie not found 😢</h2>";
      return;
    }

    moviesData = [];

    for (let movie of data.Search) {
      const detailRes = await fetch(
        `https://www.omdbapi.com/?i=${movie.imdbID}&apikey=${apiKey}`
      );
      const details = await detailRes.json();
      moviesData.push(details);
    }

    displayMovies(moviesData);

  } catch (error) {
    moviesContainer.innerHTML = "<h2>Something went wrong</h2>";
  }
}

// DISPLAY MOVIES 
function displayMovies(movies) {
  const moviesContainer = document.getElementById("movieContainer");
  moviesContainer.innerHTML = "";
     if (movies.length >0){
      fetchRecommendedMovies(movies[0].Genre);
     }
  movies.forEach(movie => {
    const card = document.createElement("div");
    card.classList.add("movie-card");

    card.innerHTML = `
      <img src="${movie.Poster !== "N/A" ? movie.Poster : "https://via.placeholder.com/200"}" alt="${movie.Title}">
      <h3>${movie.Title}</h3>
      <p><strong>Year:</strong> ${movie.Year}</p>
      <p><strong>Genre:</strong> ${movie.Genre}</p>
      <p><strong>IMDB: </strong>⭐ ${movie.imdbRating}</p>
      <p class="plot">
      <strong>Description:</strong> ${movie.Plot !== "N/A" ? movie.Plot : "Description not available."}</p>
      
    `;
      fetchRecommendedMovies(movie.Genre);
    moviesContainer.appendChild(card);
  });
}

//  SORT FUNCTION 
function sortMovies() {
  const option = document.getElementById("sortOption").value;

  if (option === "year") {
    moviesData.sort((a, b) => b.Year - a.Year);
  } else if (option === "rating") {
    moviesData.sort((a, b) => b.imdbRating - a.imdbRating);
  }

  displayMovies(moviesData);
}
//Recommended movie
async function fetchRecommendedMovies(genre) {
  const recommendContainer = document.getElementById("recommendContainer");
  recommendContainer.innerHTML = "";

  // Pick first genre only (Comedy, Action → Comedy)
  const mainGenre = genre.split(",")[0];

  try {
    const response = await fetch(
      `https://www.omdbapi.com/?s=${mainGenre}&type=movie&apikey=${apiKey}`
    );

    const data = await response.json();

    if (data.Response === "False") return;
      
    for (let movie of data.Search.slice(0, 6)) {
      const detailRes = await fetch(
        `https://www.omdbapi.com/?i=${movie.imdbID}&apikey=${apiKey}`
      );
      const details = await detailRes.json();

      const card = document.createElement("div");
      card.classList.add("movie-card");

      card.innerHTML = `
        <img src="${details.Poster}">
        <h4>${details.Title}</h4>
        <p>⭐ ${details.imdbRating}</p>
      `;
     
      recommendContainer.appendChild(card);
    }
  } catch (err) {
    console.log(err);
  }
}