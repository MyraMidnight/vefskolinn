const loadedMovies = []; //array sem fyllist með upplýsing um frá "loadMovies"
let nextPage = 1; //telur hvaða síðu verður notuð í apiUrl
let popularOrSearch = "popular"; // sjá "searchMovies" function

/* function til að fela elements*/
const hiddenToggle = (elementId)=>{
	const element = document.getElementById(elementId);
	
	element.classList.toggle("hidden"); //bætir á eða fjarlægjir "hidden" class
};

/* 
function til að fara milli tabs í popup
 */
const popupTabs = (e, tabName)=>{
    const activeTab = document.getElementById("content_" +tabName);
	const tabContent = document.getElementsByClassName("tabContent");
	const tabLink = document.getElementsByClassName("tabLink")
	
    // Get all elements with class="tabcontent" and hide them
    for (i = 0; i < tabContent.length; i++) {
        tabContent[i].style.display = "none";
    }

    // Get all elements with class="tablinks" and remove the class "active"
    for (i = 0; i < tabLink.length; i++) {
        tabLink[i].classList.remove("activeTab");
    }

    // Show the current tab, and add an "active" class to the button that opened the tab
    activeTab.style.display = "block";
    e.currentTarget.classList.add("activeTab");
}

/* 
function sem nær í upplýsingar um bíómyndir 
*/
const loadMovies = ()=>{
	let apiUrl = "";

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
		nextPage++;
	});
};

/* 
function sem býr til HTML fyrir hvert movie 
*/
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

/* 
function sem sortar listann eftir titil/rating
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


/* 
function sem fylgist með hvort viðkomandi sé kominn neðst á síðuna 
*/
window.addEventListener("scroll", ()=>{
	const divWrap = document.getElementById("movieList");
	const windowHeight = window.innerHeight; //how tall is the window
	const pageHeight = divWrap.clientHeight - windowHeight; //how tall is page

	if ( window.scrollY >= pageHeight){ // ef viðkomandi er kominn alveg neðst á síðuna
		loadMovies(); // þá ná í meira efni/pages
	};
});

/* 
function sem leyfir viðkomandi að leita í gegnum TheMovieDB
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

/* 
function sem býr til popup með nánari upplýsingum um valda mynd
Þegar smellt er á bíómynd á síðunni kemur upp modal (líka á leitarsíðum) með meiri upplýsingum um myndina þar þurfa að vera a.m.k. 3 mismunandi köll í apann (t.d. Get Credits, Get Videos og Get Details)
*/
const moreInfo = (movieId) => { 
	const overlay = document.getElementById("popup");
	const popup = document.getElementById("popupContent");
	const popupHeading = document.getElementById("popupName");
	//tab content
	const details = document.getElementById("content_details");
	const reviews = document.getElementById("content_reviews");
	const videos = document.getElementById("content_videos");

//tæmir út popup upplýsingar áður en hann nær í nýjar upplýsingar
	details.innerHTML = ``;
	reviews.innerHTML = ``;
	videos.innerHTML = `
		<iframe id="youtubeVideo" name="youtubeVideo"></iframe>
		<ul id="videoList">
		</ul>
	`;
//Nær í nánari upplýsingar
	fetch ("https://api.themoviedb.org/3/movie/" + movieId + "?api_key=92faef4c2a01d2027019eaa0cbcd34a7&language=en-US")
	.then ((results)=>{ //loforð um að hlaða API
			return results.json();
	})
	.then((json)=>{  //þegar API er loksins búið að hlaða
		details.innerHTML+=`
			<ul>
				<li><strong>Title:</strong> ${json.title}</li>
				<li><strong>Overview:</strong> ${json.overview}</li>
				<li><strong>Original language:</strong> ${json.original_language}</li>
				<li><strong>Rating:</strong> ${json.vote_average}/10 (${json.vote_count} votes)</li>
				<li><strong>Release date:</strong> ${json.release_date}</li>
				<li><strong>Runtime:</strong> ${json.runtime} minutes</li>
			</ul>
		`;

	});
		
//Nær í reviews
	fetch ("https://api.themoviedb.org/3/movie/" + movieId + "/reviews?api_key=92faef4c2a01d2027019eaa0cbcd34a7&language=en-US&page=1")
	.then ((results)=>{ //loforð um að hlaða API
		return results.json();
	})
	.then((json)=>{  //þegar API er loksins búið að hlaða
		if (json === undefined) { //ef engin reviews eru í boði
			reviews.innerHTML=`<span> No Reviews </span>`;
		} else { 
			json.results.map((movie)=>{
				if (movie.content.length > 500){ //ef review "content" er lengra en 500 stafir, klippa það niður og bæta link í full review	
				movie.content = movie.content.slice(0,500) + `...<br><a href="${movie.url}" target="review" class="viewReview"> view full review</a>`;
				};
				return movie;
			}).forEach((movie)=>{ 
				reviews.innerHTML+=`
					<ul class="review">
						<li><strong>Author:</strong> <em>${movie.author}</em> </li>
						<li>${movie.content}</li>
					</ul>
				`;
			});
		};
	});
	
//Nær í trailers / videos
	fetch ("https://api.themoviedb.org/3/movie/" + movieId + "/videos?api_key=92faef4c2a01d2027019eaa0cbcd34a7&language=en-US")
	.then ((results)=>{ //loforð um að hlaða API
		return results.json();
	})
	.then((json)=>{  //þegar API er loksins búið að hlaða
		if (json === undefined) { //ef engin vídeó eru í boði
				videos.innerHTML=`<span> No Videos </span>`;
		} else {
			json.results.forEach((video)=>{ //býr til link að video
				document.getElementById("videoList").innerHTML +=`
				<li>
				<a target="youtubeVideo" href="https://www.youtube.com/embed/${video.key}" >${video.name} - <strong>type:</strong> ${video.type}</a>
				</li>`;
			});
		};
	});
	overlay.classList.remove("hidden"); //fjarlægjir "hidden" class til að birta popup
};

loadMovies(); //hleður inn fyrstu síðu af movies