function updateClock() {
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, "0");
  const minutes = now.getMinutes().toString().padStart(2, "0");
  const seconds = now.getSeconds().toString().padStart(2, "0");
  const time = `${hours}:${minutes}:${seconds}` ;
  document.getElementById("clock").innerHTML = time;
  console.log("clock is running")
}

function updateDate() {
    const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
    const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", 
        "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"
    ];
    const today = new Date();
    const weekDayNum = today.getDay();
    const weekday = days[weekDayNum];
    const month = today.getMonth();
    const dayOfMonth = today.getDate();

    const dateToday = `${weekday}, ${months[month]} ${dayOfMonth}`;
    
    document.getElementById("date").innerHTML = dateToday;
    console.log(dateToday);
}

async function updateWeather() {
    const weatherApi = await fetch('https://api.openweathermap.org/data/2.5/weather?q=Birmingham,UK&appid=93eab7c744e431f9d47792b7b9f092388&units=metric')
    const weatherData = await weatherApi.json()
    const temperature = weatherData.main.temp;
    const weatherDescription = weatherData.weather[0].description;    
    const humidity = weatherData.main.humidity;
    const humidityDisplay = `HUMIDITY: ${humidity}%`

    const windSpeed = weatherData.wind.speed;
    const windSpeedKmh = Math.round(windSpeed * 3.6);
    const windDisplay = `WIND: ${windSpeedKmh}KM/H`

    const cloudCover = weatherData.clouds.all;
    const cloudCoverDisplay = `Cloud Cover: ${cloudCover}%`

    const feelsLike = weatherData.main.feels_like;
    const feelsLikeDisplay = `Feels like: ${feelsLike}°C` 
    

    document.getElementById("temperature").innerHTML= temperature;
    document.getElementById("weather").innerHTML= weatherDescription;
    document.getElementById("humidity").innerHTML = humidityDisplay;
    document.getElementById("windSpeed").innerHTML = windDisplay;
    document.getElementById("cloud_cover").innerHTML = cloudCoverDisplay;
    document.getElementById("feels_like").innerHTML = feelsLikeDisplay;

    console.log(temperature)
    console.log(weatherDescription)
    console.log(humidityDisplay)
    console.log(windDisplay)
    console.log(cloudCoverDisplay)
    console.log(feelsLikeDisplay)

}

setInterval(updateClock, 1000);
updateClock();
updateWeather();
updateDate();