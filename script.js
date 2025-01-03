const apikey="e450b0763d24571596b022544e630d41";
const apiUrl="https://api.openweathermap.org/data/2.5/weather?units=metric&q="
let searchbox=document.querySelector(".search input");
let searchbtn=document.querySelector(".search button");
let weathericon=document.querySelector(".weather-iocn");
async function cheakweather(city){
    const response=await fetch(apiUrl+city+ `&appid=${apikey}`);
    let data =await response.json();
    
    if(response.status==404){
        document.querySelector(".error").style.display="block";
        document.querySelector("weather").style.display="none";
    }
    else {

    document.querySelector(".city").innerHTML=data.name;
    document.querySelector(".temp").innerHTML=Math.round(data.main.temp)+"°C";
    document.querySelector(".wind").innerHTML=data.wind.speed+"km/h";
    document.querySelector(".humidity").innerHTML=data.main.humidity+"%";
    if(data.weather[0].main=="Clouds"){
        weathericon.src="Clouds.png";
    }
    else if(data.weather[0].main=="Clear"){
        weathericon.src="Clear.png";
    }
    else if(data.weather[0].main=="Rain"){
        weathericon.src="rain.png";
    }
    else if(data.weather[0].main=="Drizzle"){
        weathericon.src="drizzle.png";
    }
    else if(data.weather[0].main=="Mist"){
        weathericon.src="mist.png";
    }
    document.querySelector(".weather").style.display="block"
}
}
searchbtn.addEventListener('click',()=>{
    cheakweather(searchbox.value);
})
