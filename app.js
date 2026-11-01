$(document).ready(function () {
    const popover = new bootstrap.Popover(document.getElementById("city-input"), {
        trigger: "manual"
    });
    let savedHistory = JSON.parse(localStorage.getItem("weatherHistory")) || [];

    savedHistory.forEach(function (item) {
        $("#history-list").append(`
            <li>
                <img src="https://openweathermap.org/img/wn/${item.icon}@2x.png" alt="Weather icon">
                <strong>${item.name}</strong>
                <span>${item.temperature} °C</span>
                <span>${item.windSpeed} m/s</span>
            </li>
        `);
    });

        $("#search-form").on("submit", function (event) {
            event.preventDefault();
        let city = $("#city-input").val();

        const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric&lang=sv`;

        $.ajax({
            url: url,
            method: "GET",
            success: function (data) {
                popover.hide();

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
                history = history.filter(item => item.name !== cityName);
                history.unshift({
                    name: cityName,
                    temperature: temperature,
                    windSpeed: windSpeed,
                    icon: icon
                });
                history = history.slice(0, 5);

                localStorage.setItem("weatherHistory", JSON.stringify(history));

                $("#history-list").empty();

                history.forEach(function (item) {
                    $("#history-list").append(`
                        <li>
                            <img src="https://openweathermap.org/img/wn/${item.icon}@2x.png" alt="Weather icon">
                            <strong>${item.name}</strong>
                            <span>${item.temperature} °C</span>
                            <span>${item.windSpeed} m/s</span>
                        </li>
                    `);
                });
            },
            error: function () {
                $("#weather-result").empty();
                popover.show();
            }
        });
    });
    
        $("#location-btn").on("click", function () {
            navigator.geolocation.getCurrentPosition(
            function (position) {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;
                const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric&lang=sv`;

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
                        history = history.filter(item => item.name !== cityName);
                        history.unshift({
                            name: cityName,
                            temperature: temperature,
                            windSpeed: windSpeed,
                            icon: icon
                        });
                        history = history.slice(0, 5);

                        localStorage.setItem("weatherHistory", JSON.stringify(history));

                        $("#history-list").empty();
                        history.forEach(function (item) {
                            $("#history-list").append(`
                                <li>
                                    <img src="https://openweathermap.org/img/wn/${item.icon}@2x.png" alt="Weather icon">
                                    <strong>${item.name}</strong>
                                    <span>${item.temperature} °C</span>
                                    <span>${item.windSpeed} m/s</span>
                                </li>
                            `);
                        });
                    },
                    error: function () {
                        alert("Could not fetch weather for your location.");
                    }
                });

                console.log(latitude, longitude);
            },
            function (error) {
                console.log("Geolocation error:", error.code, error.message);
            }
        );
    });
});