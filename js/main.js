
let crd = null;
// const input = document.querySelector("#city-input");

let city = "";
getPos();
// main();
const input = document.querySelector("#city-input");

const apiKey = "7271c34a05e3a462f7bee6f19d106d9b";
// input.value;
async function getPos() {
    const options = {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 5000,
    };

    async function success(pos) {
        crd = pos.coords;

        console.log("Your current position is:");
        console.log(`Latitude : ${crd.latitude}`);
        console.log(`Longitude: ${crd.longitude}`);

        city = await getCityFromCoords(crd.latitude, crd.longitude)
        input.value = city;
        fetchTodayWeather();
        fetchForecastDays();
    }

    function error(err) {
        console.warn(`ERROR(${err.code}): ${err.message}`);
    }
    navigator.geolocation.getCurrentPosition(success, error, options);
}

async function main() {
    await getPos();
    console.log("main function called " + city);
    fetchTodayWeather();
}


async function fetchForecastDays(result) {
    try {
        if (city !== "") {
            const url = `https://api.weatherstack.com/marine?access_key=${apiKey}&query=${city}&hourly=1&interval=1&forecast=7`;
            const options = {
                method: 'GET'
            };
            const response = await fetch(url, options);
            const result = await response.text();
            console.log(result);
        }
        else {
            console.error("City not found or empty");
        }
    } catch (error) {
        console.error(error);
    }
}

async function fetchTodayWeather() {
    try {
        if (city !== "") {
            console.error(city);
            const url = `https://api.weatherstack.com/current?access_key=${apiKey}&query=${city}`;
            const options = {
                method: 'GET'
            };
            const response = await fetch(url, options);
            const result = await response.text();
            loadTodayData(JSON.parse(result));
            loadHorlyForecast(JSON.parse(result));
        }
        else {
            console.error("City not found or empty");
        }
        // console.log(result);
    } catch (error) {
        console.error(error);
    }
}

function loadTodayData(result) {
    const currentTemp = document.querySelector("#current-temperature");
    const dayDescription = document.querySelector(".day");
    const feelsLike = document.querySelector("#feels-like");
    const howItFeels = document.querySelector("#how-it-feels");
    const percip = document.querySelectorAll(".percipitation-value");
    const visibility = document.querySelector("#visibility");
    const humidity = document.querySelector("#humidity");

    currentTemp.textContent = `${result.current.temperature}°`;
    dayDescription.textContent = result.current.weather_descriptions[0];
    feelsLike.textContent = `${result.current.feelslike}°`;
    howItFeels.innerHTML = result.current.temperature > result.current.feelslike ? "cooler" : "warmer";
    percip.forEach((percipValue) => {
        percipValue.textContent = `${result.current.precip}mm`;
    });
    visibility.textContent = `${result.current.visibility}km`;
    humidity.textContent = `${result.current.humidity}%`;
}

function loadHorlyForecast(result) {
    const nowTemp = document.querySelector("#now-temp");
    const nowWeather = document.querySelector("#now-weather");
    // get current our and go forward 

    //they are a collection of elements
    // const hour1 = document.querySelector("#hour-1");
    // const hour2 = document.querySelector("#hour-2");
    // const hour3 = document.querySelector("#hour-3");
    // const hour4 = document.querySelector("#hour-4");
    // const hour5 = document.querySelector("#hour-5");

    nowTemp.textContent = `${result.current.temperature}°`;
    nowWeather.textContent = result.current.weather_descriptions[0];
    const img = document.createElement("img");
    img.src = result.current.weather_icons[0];
    img.classList.add("weather-icon");
    nowWeather.appendChild(img);


}

// hourly forecast



// const todayDate = document.querySelector("#today-date");
// const todayTemp = document.querySelector("#today-temp");
// const todayWeather = document.querySelector("#today-weather");

// const day1 = document.querySelector("#day-1");
// const day2 = document.querySelector("#day-2");
// const day3 = document.querySelector("#day-3");
// const day4 = document.querySelector("#day-4");
// const day5 = document.querySelector("#day-5");

// const uvIndex = document.querySelector("#uv-index");
// const windSpeed = document.querySelector("#wind-speed");


async function getCityFromCoords(latitude, longitude) {
    try {
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10`);
        const data = await response.json();
        return data.address.city || data.address.town || data.address.village || data.address.municipality;
    } catch (error) {
        console.error("Error getting city name:", error);
        return null;
    }
}

