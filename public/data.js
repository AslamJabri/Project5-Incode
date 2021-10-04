const api_key = `api_key=c820500c0a92520524ea977cc56c8a32`;
const base_url = `https://api.themoviedb.org/3`;
const api_url = `${base_url}/discover/movie?sort_by=popularity.desc&${api_key}`;
const search_url = `${base_url}/search/movie?${api_key}`;
const rating_url = `${base_url}/discover/movie/?certification_country=US&certification=R&sort_by=vote_average.desc&${api_key}`
const kids_url = `${base_url}/discover/movie?certification_country=US&certification.lte=G&sort_by=popularity.desc&${api_key}`
const genre_url = `${base_url}/discover/movie?with_genres=`;

fetchMovies(api_url);

// fetching data from api
function fetchMovies(url) {
  $.ajax({
    method: "GET",
    url: url,
    dataType: "json",
  })
    .then((data) => {
      const movies = data.results;
      
      displayMovies(movies);
    })
    .catch((error) => {
      console.log(error);
    });
}

// search event
$("#searchForm").on("submit", (e) => {
  e.preventDefault();
  let searchText = $("#searchText").val();
  if (searchText) {
    fetchMovies(`${search_url}&query=${searchText}`);
    searchText = ""
  }
});

// function to display movies
function displayMovies(movies) {
  let output = '';
  $(movies).each((i, val) => {
  
    output += `
      <div class="card">
        <img src="https://image.tmdb.org/t/p/w500${val.poster_path}" class="card-img-top " alt="movie poster">
        <div class="card-body p-0 mt-2">
          <h6 class="d-grid btn btn-dark text-center">${val.title}</h6>
          <div class="d-flex justify-content-between" >
          <p class="card-text"><span class='badge bg-info text-dark'>TMdb</span> ${val.vote_average}</p>
          <p class="card-text">${val.release_date.slice(0, 4)}</p>
          </div>
          <div class="overview d-grid"><p>${val.overview}</p><a class='btn btn-info' href=${val.id}>Detail</a></div>
        </div>
      </div>`
    $(".box").html(output);
  });
}


// fetching all the genre type
$.ajax(`
https://api.themoviedb.org/3/genre/movie/list?${api_key}`).then(data => {
  const movieGenres = data.genres;
  let listItems = ""
  $(movieGenres).each((i, val) => {
    listItems += `<li>
                  <a class="dropdown-item genre-item" id="${val.id}">${val.name}</a>
                </li>`
  })
  $(".genre-list").html(listItems)
})

$(".genre-parent .genre-list").on("click", (e) => {
  const genreId = e.target.id
  const targetedGenre = `${genre_url}${genreId}&${api_key}`
  fetchMovies(targetedGenre)
  })



