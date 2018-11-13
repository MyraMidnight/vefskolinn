const loadedMovies = []; //array sem fyllist með upplýsing um frá "loadMovies"
let nextPage = 1; //telur hvaða síðu verður notuð í apiUrl
let popularOrSearch = "popular"; // sjá "searchMovies" function
	let apiUrl = "";

/* function sem nær í upplýsingar um bíómyndir */
const loadMovies = ()=>{

	if (popularOrSearch == "popular"){ //default
		apiUrl = "https://api.themoviedb.org/3/discover/movie?api_key=92faef4c2a01d2027019eaa0cbcd34a7&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=" + nextPage;
	} else if (popularOrSearch == "search"){ //ef viðkomandi notar leitina
		const searchInput = document.getElementById("searchInput");
		const searchValue = searchInput.value;
		apiUrl = "https://api.themoviedb.org/3/search/movie?api_key=92faef4c2a01d2027019eaa0cbcd34a7&include_adult=false&query=" + searchValue + "&page=" + nextPage;
	};
	
	fetch(apiUrl) 
	.then((results)=>{ //loforð um að hlaða API
		return results.json();
	})
	.then((json)=>{  //þegar API er loksins búið að hlaða
		json.results.map((movie)=>{ //breytir eða býr til movie properties
			movie.poster_path = "https://image.tmdb.org/t/p/w300_and_h450_bestv2" + movie.poster_path;
			movie.release_year = movie.release_date.slice(0,-6);
			return movie;
		}).forEach((movie)=>{
			movieItem(movie); //býr til movie hvert movie með "movieItem"
			loadedMovies.push(movie);			
		});

		document.getElementById("popupOverlay").style.display = "none"; //felur popup ef nýjar myndir hlaðast inn með "loadMovies" function, t.d. fyrst þegar síðan birtist.
		console.log("current page: " + nextPage);
		nextPage++;
	});
};

/* function sem býr til HTML fyrir hvert movie */
const movieItem = (movie)=>{
	const movieDiv = document.getElementById("movieList");
	
	// function sem athugar ef upprunalegt tungumál myndar er enska
	const englishMovieCheck = ()=>{ 
		if ( movie.original_language != "en" ){
			return `<li><h2>${movie.title} (${movie.original_title})</h2></li>`
		} else {
			return `<li><h2>${movie.title}</h2></li>`
		};
	};
	
	movieDiv.innerHTML += `
		<div class="movieItem">
			<img src="${movie.poster_path}" onclick="moreInfo(${movie.id})">
			<ul>
		` + englishMovieCheck() + `
				<li>Rating: <em>${movie.vote_average}</em></li>
				<li>Released: <em>${movie.release_year}</em></li>
				<li class="desc">${movie.overview}</li>
			</ul>
		</div>
	`;
};

/* function sem sortar listann eftir titil/rating
Önnur leitin er með niðurstöður sem þú hefur hlaðið inn á síðuna með fetch um það bil 5 til 6 “pages” (en það eru um 100 myndir). Þar átt þú að nota search function-ið sem þú gerðir í síðustu viku.
*/
const filterMovies = (filter)=>{
	const moviesWrap = document.getElementById("movieList");
	
	moviesWrap.innerHTML = "";
	
	loadedMovies.sort((movieA, movieB)=>{
		if (filter === "title"){
			//to UpperCase verður að vera svo sort geti alltaf borið saman alla stafina í orðinu alveg sama hvort það séu lágstafir eða hástsafir			
			let moviea = movieA.title.toUpperCase();
			let movieb = movieB.title.toUpperCase();
			
			if (moviea < movieb) { //Ef movieb er fyrr í stafrófinu en moviea þá fer movieb á undan eða í raun -1 sem þýðir að það fer upp/yfir
				return -1;
			} else if (moviea > movieb) { //Ef movieb er aftar í stafrófinu en moviea þá verður movieb á eftir eða í raun +1 sem þýðir að hann fer niður/undir
				return 1;
			} else { //ef myndin hefur sama titil
				return 0;
			};
		} else if ( filter === "rating") {
			return movieB.vote_average - movieA.vote_average;
		};
	}).forEach((movie)=>{
		movieItem(movie); //býr til movie hvert movie með "movieItem"
	});
};


/* function sem fylgist með hvort viðkomandi sé kominn neðst á síðuna */
window.addEventListener("scroll", ()=>{
	const divWrap = document.getElementById("movieList");
	const windowHeight = window.innerHeight; //how tall is the window
	const pageHeight = divWrap.clientHeight - windowHeight; //how tall is page

	if ( window.scrollY >= pageHeight){ // ef viðkomandi er kominn alveg neðst á síðuna
		loadMovies(); // þá ná í meira efni/pages
	};
});

/* function sem leyfir viðkomandi að leita í gegnum TheMovieDB
Hin leitin notar search  úr TMDB apanum (https://developers.themoviedb.org/3/search/search-movies)	
*/
const searchMovies = (e)=>{
	const moviesWrap = document.getElementById("movieList");
	const searchInput = document.getElementById("searchInput");
	const searchValue = searchInput.value;
	const heading = document.getElementById("heading");
	
	if (e.keyCode == 13 ){ //ef viðkomandi ýtir á enter í "searchInput"
		loadedMovies.length = 0;  //tæmir út "loadedMovies" array
		nextPage = 1; // endurstillir "nextPage" teljarann
		moviesWrap.innerHTML = ""; //tæmir út moviesWrap
		
		if (searchValue == ""){ //ef viðkomandi leitar að með tómt "searchValue"
			popularOrSearch = "popular";
			heading.innerHTML = "Popular movies!";
		} else { // annars leita að niðurstöðum
			popularOrSearch = "search";
			heading.innerHTML = "Searching for a movie!";
		};	
		loadMovies();
	} else { //ekki gera neitt nema ýtt sé á enter (keyCode 13)
		return false;
	};
};

/* function sem býr til popup með nánari upplýsingum um valda mynd
Þegar smellt er á bíómynd á síðunni kemur upp modal (líka á leitarsíðum) með meiri upplýsingum um myndina þar þurfa að vera a.m.k. 3 mismunandi köll í apann (t.d. Get Credits, Get Videos og Get Details)
*/
const moreInfo = (movieId) => { // 
	const overlay = document.getElementById("popupOverlay");
	const popup = document.getElementById("popup");
	const reviewUrl = "https://api.themoviedb.org/3/movie/"+movieId+"/reviews?api_key=92faef4c2a01d2027019eaa0cbcd34a7&language=en-US&page=1";
	
	fetch (reviewUrl)
	.then ((results)=>{ //loforð um að hlaða API
		return results.json();
	})
	.then((json)=>{  //þegar API er loksins búið að hlaða
		json.results.forEach((review)=>{
			document.getElementById("reviews").innerHTML+=`
				<ul>
					<li> Review: ${review.content} </li>
					<li> Author: ${review.author} </li>
				</ul>
			`
		});
	});

	overlay.style.display= "flex"; //birtir popup overlay

	popup.innerHTML =`
		<div id="reviews"></div>
	`;
};

loadMovies(); //hleður inn fyrstu síðu af movies
