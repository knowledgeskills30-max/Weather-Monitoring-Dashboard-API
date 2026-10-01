const express = require("express");
const axios = require("axios");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3000;
const WEATHER_API_KEY = process.env.WEATHER_API_KEY;

// Middleware
app.use(cors());
app.use(express.json());

// Serve frontend files
app.use(express.static(path.join(__dirname, "public")));

/*
========================================
HOME ROUTE
========================================
*/

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

/*
========================================
WEATHER API ROUTE
========================================

Example:

GET /api/weather?city=Hyderabad
*/

app.get("/api/weather", async (req, res) => {

    try {

        const city = req.query.city;

        // Check city
        if (!city) {
            return res.status(400).json({
                success: false,
                message: "Please provide a city name."
            });
        }

        // Check API key
        if (!WEATHER_API_KEY) {
            return res.status(500).json({
                success: false,
                message: "Weather API key is not configured."
            });
        }

        // OpenWeather API
        const url =
            `https://api.openweathermap.org/data/2.5/weather` +
            `?q=${encodeURIComponent(city)}` +
            `&appid=${WEATHER_API_KEY}` +
            `&units=metric`;

        // Request weather data
        const response = await axios.get(url);

        const data = response.data;

        // Format response
        const weatherData = {

            success: true,

            city: data.name,

            country: data.sys.country,

            temperature: data.main.temp,

            feelsLike: data.main.feels_like,

            minTemperature: data.main.temp_min,

            maxTemperature: data.main.temp_max,

            humidity: data.main.humidity,

            pressure: data.main.pressure,

            windSpeed: data.wind.speed,

            weather: data.weather[0].main,

            description: data.weather[0].description,

            icon: data.weather[0].icon,

            visibility: data.visibility,

            sunrise: new Date(
                data.sys.sunrise * 1000
            ).toLocaleTimeString(),

            sunset: new Date(
                data.sys.sunset * 1000
            ).toLocaleTimeString(),

            updatedAt: new Date().toLocaleString()
        };

        res.json(weatherData);

    } catch (error) {

        console.error("Weather API Error:", error.message);

        // City not found
        if (error.response && error.response.status === 404) {

            return res.status(404).json({
                success: false,
                message: "City not found. Please enter a valid city name."
            });
        }

        // Unauthorized
        if (error.response && error.response.status === 401) {

            return res.status(401).json({
                success: false,
                message: "Invalid weather API key."
            });
        }

        // Other errors
        res.status(500).json({
            success: false,
            message: "Unable to fetch weather information."
        });
    }
});

/*
========================================
HEALTH CHECK ROUTE
========================================
*/

app.get("/api/health", (req, res) => {

    res.json({
        success: true,
        message: "Weather Monitoring API is running!",
        serverTime: new Date().toISOString()
    });

});

/*
========================================
START SERVER
========================================
*/

app.listen(PORT, "0.0.0.0.", () => {

    console.log("------------------------------------");
    console.log("🌦️ Weather Monitoring Dashboard");
    console.log("------------------------------------");
    console.log(`Server running on 0.0.0.0:${PORT}`);
    console.log(`Server running on http://localhost:3000 ${PORT}`);
    console.log("------------------------------------");

});
