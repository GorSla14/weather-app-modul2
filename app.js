$(document).ready(function () {
    let savedHistory = JSON.parse(localStorage.getItem("weatherHistory")) || [];

    savedHistory.forEach(function (city) {
        $("#history-list").append(`<li>${city}</li>`);
    });

    $("#search-btn").on("click", function () {
        let city = $("#city-input").val();

        const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric&lang=sv`;

        $.ajax({
            url: url,
            method: "GET",
            success: function (data) {
                const cityName = data.name;
                const temperature = data.main.temp;
                const windSpeed = data.wind.speed;
                const icon = data.weather[0].icon;

                $("#weather-result").html(`
                    <h2>${cityName}</h2>
                    <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="Weather icon">
                    <p>Temperature: ${temperature} °C</p>
                    <p>Wind speed: ${windSpeed} m/s</p>
                `);
                let history = JSON.parse(localStorage.getItem("weatherHistory")) || [];
                history = history.filter(item => item !== cityName);
                history.unshift(cityName);
                history = history.slice(0, 5);

                localStorage.setItem("weatherHistory", JSON.stringify(history));

                $("#history-list").empty();

                history.forEach(function (city) {
                    $("#history-list").append(`<li>${city}</li>`);
                });
            },
            error: function () {
                $("#weather-result").empty();
                alert("City not found. Please try again.");
            }
        });
    });
});