
/*
// http://www.vedur.is/media/vedurstofan/XML-thjonusta.pdf
// http://erikflowers.github.io/weather-icons/
*/

const numOfDays = 4 //how many days shall be displayed


fetch ("http://apis.is/weather/forecasts/is?stations=1")
.then ((results)=>{ //promise
	return results.json()
}).then((json)=>{  //þegar api er búið að hlaða
	json.results.map((item)=>{
		document.getElementById('weatherForecast').innerHTML += `<h1>Veðrið í ${item.name} næstu ${numOfDays} daga</h1>`
		item.forecast.map((item)=>{
			item.date = item.ftime.slice(5,10)	
			item.time = item.ftime.slice(11,16)
			//assigns a icon name
			switch(item.W){	
				case "Heiðskírt" :
					item["img"] =  "wi-day-sunny"
					break
				case "Léttskýjað" : 
					item["img"] =  "wi-day-sunny-overcast"
					break
				case "Skýjað" : 
					item["img"] =  "wi-day-cloudy"
					break
				case "Alskýjað" : 
					item["img"] =  "wi-cloudy"
					break
				case  "Lítils háttar rigning":  
				case  "Rigning": 
				case  "Skúrir":
					item["img"] =  "wi-rain"
					break
				case  "Lítils háttar slydda":
				case  "Slydda":
					item["img"] =  "wi-sleet"
					break
				case "Lítils háttar snjókoma" :
				case  "Snjókoma":
					item["img"] =  "wi-snow"
					break
				case  "Slydduél":
				case  "Snjóél" :
				case  "Frostrigning":
					item["img"] =  "wi-rain-mix"
					break
				case   "Skafrenningur":
					item["img"] =  "wi-snow-wind"
					break
				case  "Skýstrókar":
				case  "Moldrok" :
					item["img"] =  "wi-dust"
					break
				case "Þoka" :
					item["img"] =  "wi-fog"
					break
				case  "Lítils háttar súld":
				case  "Súld":
					item["img"] =  "wi-sprinkle"
					break
				case  "Hagl":
					item["img"] =  "wi-hail"
					break
				case  "Lítils háttar þrumuveður" :
					item["img"] =  "wi-lightning"
					break
				case  "Þrumuveður":
					item["img"] =  "wi-thunderstorm"
					break
			}
			switch(item.D){
				case 'N': item.D = "wi-towards-n"
					break
				case 'NNA': item.D = "wi-towards-nne"
					break
				case 'ANA': item.D = "wi-towards-ene"
					break
				case 'A': item.D = "wi-towards-e"
					break
				case 'ASA': item.D = "wi-towards-ese"
					break
				case 'SA': item.D = "wi-towards-se"
					break
				case 'SSA': item.D = "wi-towards-sse"
					break
				case 'S': item.D = "wi-towards-s"
					break
				case 'SSV': item.D = "wi-towards-ssw"
					break
				case 'SV': item.D = "wi-towards-sw"
					break
				case 'VSV': item.D = "wi-towards-wsw"
					break
				case 'V': item.D = "wi-towards-w"
					break
				case 'VNV': item.D = "wi-towards-wnw"
					break
				case 'NV': item.D = "wi-towards-nw"
					break
				case 'NNV': item.D = "wi-towards-nnw"
					break
			}
		}) //end forecast 'map'
		const forecastGroups = Object.entries(item.forecast.groupBy('date'))
		item.forecast = forecastGroups .slice(0,numOfDays) //how many days to display
		item.forecast.map((item)=>{
			const months = ["janúar","febrúar","mars","apríl","maí","júní","júlí","ágúst","september","nóvember","desember"]
			const month = months[item[0].slice(0,2)-1] //assigns the name of month
			item.push(item[0].slice(3,5) + ' ' + month) //adds the date forecast array
			
			document.getElementById('weather').innerHTML += `<section id="${item[0]}" class="forecastDay"><h3>${item[2]}</h3></section>`
			const forecastDiv = document.getElementById(item[0])

			item[1].forEach((forecast)=>{
				forecastDiv.innerHTML += `
					<div class="forecastTime">
						<span class="time">kl. ${forecast.time}</span>
						<span class="weatherForecast">
							${forecast.TD}<i class="wi wi-celsius"></i> <i class="wi ${forecast.img}"></i> 
							<br><em>${forecast.F}m/s</em> <i class="wi wi-wind ${forecast.D}"></i>
						</span>
					</div>
				`
			})
		}) //forecast.map
	}) // JSON.results.map
}) // fetch.then

//Function that groups arrays https://www.consolelog.io/group-by-in-javascript/
Array.prototype.groupBy = function(prop) {
  return this.reduce(function(groups, item) {
	const val = item[prop]
	groups[val] = groups[val] || []
	groups[val].push(item)
	return groups
  }, {})
}
