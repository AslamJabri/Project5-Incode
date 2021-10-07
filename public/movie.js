
$.ajax(`https://api.themoviedb.org/3/movie/${movie_id}?api_key=c820500c0a92520524ea977cc56c8a32`).then(data => {
    
    const details = [data.genres[0].name, data.original_language, data.production_companies[0].name, data.release_date, data.runtime, data.vote_average, data.tagline];
    let filmDis = $("<div class='row'>")
    fetchRatings(movie_id).then(score => { 
        filmDis.append(`<div class="col-md-4"><img src="https://image.tmdb.org/t/p/w500${data.poster_path}" class="img-fluid"></div>`)
        filmDis.append(`<div class="col-md-8">
                            <h2 class="card-title">${data.title}</h2>
                            <ul class="list-group movie-details">
                                <li class="list-group-item bg-secondary text-info">Genre: ${details[0]}
                                <li class="list-group-item bg-secondary text-info">Language: ${details[1]}
                                <li class="list-group-item bg-secondary text-info">Production: ${details[2]}
                                <li class="list-group-item bg-secondary text-info">Release Date: ${details[3]}
                                <li class="list-group-item bg-secondary text-info">Duration: ${details[4]} Min
                                <li class="list-group-item bg-secondary text-info rating">Rating: ${score}</li>
                                <li class="list-group-item bg-secondary text-info">Tagline: ${details[6]}</ul>`)
        filmDis.append(`<p class="card-text mt-2">${data.overview}`)
        checkRated(movie_id).then(
            data => {
                if(data) {
                    filmDis.append(`<form action="/ratings/${movie_id}" method="POST">
                                        <select name="ratings" id="ratings">
                                            <option value="1">1</option>
                                            <option value="2">2</option>
                                            <option value="3">3</option>
                                            <option value="4">4</option>
                                            <option value="5">5</option>
                                        </select>
                                        <button type="submit" class="btn btn-info d-inline-block" id="rate-btn">Rate
                                    </form>`)
                }
            }
        )
        $("#movie_view").append(filmDis)

    })

})



async function fetchRatings(movie_id) {
    try {
      const res = await fetch(`/ratings/${movie_id}`);
      const data = await res.json();
      return data.score;
    }
    catch(err) {
        console.log(err);
    }
}

async function checkRated(movie_id) {
    try {
      const res = await fetch(`/rated/${movie_id}`);
      const data = await res.json();
      return data.isAuth;
    }
    catch(err) {
        console.log(err);
    }
  }

$(".movie-details li").on("click", () => {
    console.log("clicked");
})


