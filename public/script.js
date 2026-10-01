async function getWeather() {

    const cityInput =
        document.getElementById("cityInput");

    const city =
        cityInput.value.trim();


    // Validate input

    if (city === "") {

        showError(
            "Please enter a city name."
        );

        return;
    }


    // Elements

    const loading =
        document.getElementById("loading");

    const error =
        document.getElementById("error");

    const dashboard =
        document.getElementById("weatherDashboard");


    // Show loading

    loading.style.display = "block";

    error.style.display = "none";

    dashboard.style.display = "none";


    try {

        // Call Node.js API

        const response =
            await fetch(
                `/api/weather?city=${encodeURIComponent(city)}`
            );


        const data =
            await response.json();


        // Check API response

        if (!response.ok) {

            throw new Error(
                data.message ||
                "Unable to fetch weather data."
            );
        }


        // Update dashboard

        document.getElementById(
            "cityName"
        ).textContent =
            data.city;


        document.getElementById(
            "country"
        ).textContent =
            data.country;


        document.getElementById(
            "temperature"
        ).textContent =
            `${Math.round(data.temperature)}°C`;


        document.getElementById(
            "feelsLike"
        ).textContent =
            Math.round(data.feelsLike);


        document.getElementById(
            "description"
        ).textContent =
            data.description;


        document.getElementById(
            "humidity"
        ).textContent =
            data.humidity;


        document.getElementById(
            "windSpeed"
        ).textContent =
            data.windSpeed;


        document.getElementById(
            "pressure"
        ).textContent =
            data.pressure;


        document.getElementById(
            "visibility"
        ).textContent =
            (data.visibility / 1000).toFixed(1);


        document.getElementById(
            "minTemperature"
        ).textContent =
            Math.round(data.minTemperature);


        document.getElementById(
            "maxTemperature"
        ).textContent =
            Math.round(data.maxTemperature);


        document.getElementById(
            "sunrise"
        ).textContent =
            data.sunrise;


        document.getElementById(
            "sunset"
        ).textContent =
            data.sunset;


        document.getElementById(
            "updatedAt"
        ).textContent =
            data.updatedAt;


        // Weather icon

        document.getElementById(
            "weatherIcon"
        ).src =
            `https://openweathermap.org/img/wn/${data.icon}@2x.png`;


        // Show dashboard

        dashboard.style.display = "block";


    } catch (error) {

        console.error(error);

        showError(error.message);

    } finally {

        loading.style.display = "none";

    }

}


/*
========================================
ERROR FUNCTION
========================================
*/

function showError(message) {

    const error =
        document.getElementById("error");

    const dashboard =
        document.getElementById("weatherDashboard");

    error.textContent = message;

    error.style.display = "block";

    dashboard.style.display = "none";
}


/*
========================================
ENTER KEY SUPPORT
========================================
*/

document
    .getElementById("cityInput")
    .addEventListener("keypress", function(event) {

        if (event.key === "Enter") {

            getWeather();

        }

    });
