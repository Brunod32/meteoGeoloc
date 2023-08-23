/**************** Date ****************/
let today = new Date();
let dateInHtml = document.getElementById('date');

showDate();

function showDate() {
    let date = new Date();

    let localeDate = date.toLocaleString('fr-Fr', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric'
    });

    setTimeout('showDate()', 100);
    dateInHtml.innerText = `Nous sommes le ${localeDate[0].toUpperCase()}${localeDate.slice(1).replace("à", "et il est ")}.`;
}

/**************** Meteo ****************/
/***** Météo selon localisation *****/
const apiKey = '7d4a696f4e46055b073d599ec89e157b';
// Récupérer la position via l'API Geolocalisation
let localisation = navigator.geolocation.getCurrentPosition(
    function (position) {


        // Appel à l'api openWeather avec ville en paramètre de fonction
        let apiCall = function (lat, lon) {
            let url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=fr`;

            // Meteo courante
            fetch(url)
                .then(response => response.json()
                    .then((data) => {   
                    //console.log(data)
                    
                    switch (data.weather[0].main) {
                        case 'Thunderstorm':
                            document.querySelector('#city').innerHTML =
                            "<i class='bi bi-geo-alt'></i> " + data.name + ", le temps est <i class='bi bi-cloud-lightning'></i>";
                            break;
                        case 'Clouds':
                            document.querySelector('#city').innerHTML =
                            "<i class='bi bi-geo-alt'></i> " + data.name + ", le temps est <i class='bi bi-cloud'></i>";
                            break;
                        case 'Rain':
                            document.querySelector('#city').innerHTML =
                            "<i class='bi bi-geo-alt'></i> " + data.name + ", le temps est <i class='bi bi-cloud-drizzle'></i>";
                            break;
                        case 'Clear':
                            document.querySelector('#city').innerHTML =
                            "<i class='bi bi-geo-alt'></i> " + data.name + ", le temps est <i class='bi bi-brightness-high'></i>";
                            break;
                        case 'Mist' || 'Smoke' || 'Haze' || 'Dust' || 'Fog' || 'Sand' || 'Ash' || 'Squall' || 'Tornado':
                            document.querySelector('#city').innerHTML =
                            "<i class='bi bi-geo-alt'></i> " + data.name + ", le temps est <i class='bi bi-cloud-drizzle'></i>";
                            break;
                        case 'Snow':
                            document.querySelector('#city').innerHTML =
                            "<i class='bi bi-geo-alt'></i> " + data.name + ", le temps est <i class='bi bi-cloud-snow'></i>";
                            break;              
                        default:
                            document.querySelector('#city').innerHTML = "Tendance : inconnue";
                            break;
                    }
                    
                    // document.querySelector('#city').innerHTML =
                    //     "<i class='bi bi-geo-alt'></i> " + data.name + ", le temps est " + data.weather[0].description;
                    document.querySelector('#temp').innerHTML =
                        "<i class='bi bi-thermometer-half'></i> " + data.main.temp + '°C' + ", ressenti " + data.main.feels_like + '°C';
                    document.querySelector('#wind').innerHTML =
                        "<i class='bi bi-wind'></i> " + data.wind.speed + ' km/h';
                    document.querySelector('#humidity').innerHTML =
                        "<i class='bi bi-droplet'></i> " + data.main.humidity + ' %';
                })
            ).catch(err => console.log('Erreur: ' + err));
        }

        apiCall(position.coords.latitude, position.coords.longitude)

        // Prévisions
        let apiForecastCall = function (lat, lon) {
            let urlForecast = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=fr`;
        
            fetch(urlForecast)
                .then(response => response.json()
                .then((data) => {
        
                    let targetTown = document.querySelector('#town');
                    let weatherForecastContainer = document.querySelector('.weatherForecastContainer');
        
                    for (let i = 0; i < 40; i++) {
                        // console.log(data.list)
                        // Affichage du nom de la ville
                        targetTown.innerHTML = data.city.name;
        
                        let hoursforecastDiv = document.createElement("div");
                        hoursforecastDiv.setAttribute('class', 'hoursforecastDiv');
                        weatherForecastContainer.appendChild(hoursforecastDiv);
        
                        // Création et affichage de la zone date
                        let timeZone = document.createElement("div");
                        timeZone.setAttribute('class', 'timeZone')
                        timeZone.innerHTML = "<i class='bi bi-clock'></i> " + data.list[i].dt_txt;
                        let hrDate = document.createElement("hr");
                        timeZone.appendChild(hrDate)
                        hoursforecastDiv.appendChild(timeZone);
        
                        // Création et affichage de la tendance météo
                        let weatherZone = document.createElement("div");
                        weatherZone.setAttribute('class', 'weatherZone');
                        let tendance = data.list[i].weather[0].main;
        
                        switch (tendance) {
                            case 'Thunderstorm' :
                                weatherZone.innerHTML = "Tendance : <i class='bi bi-cloud-lightning'></i>";
                                break;
                            case 'Rain':
                                // weatherZone.innerHTML = "Tendance : <i class='bi bi-cloud-rain-heavy'></i>";
                                weatherZone.innerHTML = "Tendance : <i class='bi bi-cloud-drizzle'></i>";
                                break;
                            case 'Snow':
                                weatherZone.innerHTML = "Tendance : <i class='bi bi-cloud-snow'></i>";
                                break;
                            case 'Mist':
                                weatherZone.innerHTML = "Tendance : <i class='bi bi-cloud-drizzle'></i>";
                                break;               
                            case 'Clear':
                                weatherZone.innerHTML = "Tendance : <i class='bi bi-brightness-high'></i>";
                                break;
                            case 'Clouds':
                                weatherZone.innerHTML = "Tendance : <i class='bi bi-cloud-sun'></i>";
                                break;
                            default:
                                weatherZone.innerHTML = "Tendance : inconnue";
                                break;
                        }
                        hoursforecastDiv.appendChild(weatherZone);
        
                        // Création de la zone d'affichage des données
                        let dataDiv = document.createElement("div");
                        dataDiv.setAttribute('class', 'dataDiv');
                        weatherZone.appendChild(dataDiv);
        
                        let dataDivTempAndPressure = document.createElement('div');
                        dataDiv.appendChild(dataDivTempAndPressure);
                        let dataDivWindAndHumidity = document.createElement('div');
                        dataDiv.appendChild(dataDivWindAndHumidity);
        
        
                        // Création et affichage de la zone température
                        let tempZone = document.createElement("div");
                        //tempZone.innerHTML = "<i class='bi bi-thermometer-half'></i>" + data.list[i].main.temp + "°C, ressentie: " + data.list[i].main.feels_like + "°C";
                        tempZone.innerHTML = "<i class='bi bi-thermometer-half'></i>" + data.list[i].main.temp + "°C";
                        dataDivTempAndPressure.appendChild(tempZone);
        
                        // Création et affichage de la zone température ressentie
                        // let tempFeelsLikeZone = document.createElement("div");
                        // tempFeelsLikeZone.appendChild(document.createTextNode(", ressentie: " + data.list[i].main.feels_like + "°C"));
                        // weatherZone.appendChild(tempFeelsLikeZone);
                        
                        // Création et affichage de la pression
                        let pressureZone = document.createElement("div");
                        // pressureZone.appendChild(document.createTextNode("Pression: " + data.list[i].main.pressure));
                        pressureZone.innerHTML = "<i class='bi bi-stopwatch'></i> " + data.list[i].main.pressure;
                        dataDivTempAndPressure.appendChild(pressureZone);
        
                        // Création et affichage du vent
                        let windZone = document.createElement("div");
                        windZone.innerHTML = "<i class='bi bi-wind'></i> " + data.list[i].wind.speed + ' km/h';
                        dataDivWindAndHumidity.appendChild(windZone);
                        
                        // Création et affichage du taux d'humidité
                        let humidityZone = document.createElement("div");
                        humidityZone.innerHTML = "<i class='bi bi-droplet'></i>" + data.list[i].main.humidity + ' %';
                        dataDivWindAndHumidity.appendChild(humidityZone);
                    }
                })
            ).catch(err => console.log('Erreur: ' + err));
        }
        apiForecastCall(position.coords.latitude, position.coords.longitude);
    }
);

/***** Météo selon recherche *****/
// Ecouteur d'événement sur la soumission du formulaire
document.querySelector('form').addEventListener('submit', function (e) {
    e.preventDefault();
    let citySearch = document.querySelector('#inputCity').value;
    let weatherForecastContainer = document.querySelector('.weatherForecastContainer');
    weatherForecastContainer.innerHTML = '';
    apiCallSearch(citySearch)
    apiForecastCallSearch(citySearch)
});

let apiCallSearch = function (city) {
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=fr`;

    fetch(url)
        .then(response => response.json()
        .then((data) => {
            // console.log(data)
            //console.log("Prédéfini : " + data.weather[0].main)

            switch (data.weather[0].main) {
                case 'Thunderstorm':
                    document.querySelector('#city').innerHTML =
                    "<i class='bi bi-geo-alt'></i> " + data.name + ", le temps est <i class='bi bi-cloud-lightning'></i>";
                    break;
                case 'Clouds':
                    document.querySelector('#city').innerHTML =
                    "<i class='bi bi-geo-alt'></i> " + data.name + ", le temps est <i class='bi bi-cloud'></i>";
                    break;
                case 'Rain':
                    document.querySelector('#city').innerHTML =
                    "<i class='bi bi-geo-alt'></i> " + data.name + ", le temps est <i class='bi bi-cloud-drizzle'></i>";
                    break;
                case 'Clear':
                    document.querySelector('#city').innerHTML =
                    "<i class='bi bi-geo-alt'></i> " + data.name + ", le temps est <i class='bi bi-brightness-high'></i>";
                    break;
                case 'Mist' || 'Smoke' || 'Haze' || 'Dust' || 'Fog' || 'Sand' || 'Ash' || 'Squall' || 'Tornado':
                    document.querySelector('#city').innerHTML =
                    "<i class='bi bi-geo-alt'></i> " + data.name + ", le temps est <i class='bi bi-cloud-drizzle'></i>";
                    break;
                case 'Snow':
                    document.querySelector('#city').innerHTML =
                    "<i class='bi bi-geo-alt'></i> " + data.name + ", le temps est <i class='bi bi-cloud-snow'></i>";
                    break;              
                default:
                    document.querySelector('#city').innerHTML = "Tendance : inconnue";
                    break;
            }
            
            // document.querySelector('#city').innerHTML =
            //     "<i class='bi bi-geo-alt'></i> " + data.name + ", le temps est " + data.weather[0].description;
            document.querySelector('#temp').innerHTML =
                "<i class='bi bi-thermometer-half'></i> " + data.main.temp + '°C' + ", ressenti " + data.main.feels_like + '°C';
            document.querySelector('#wind').innerHTML =
                "<i class='bi bi-wind'></i> " + data.wind.speed + ' km/h';
            document.querySelector('#humidity').innerHTML =
                "<i class='bi bi-droplet'></i> " + data.main.humidity + ' %';
        })
    ).catch(err => console.log('Erreur: ' + err));
}

let apiForecastCallSearch = function (city) {
    let urlForecast = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric&lang=fr`;

    fetch(urlForecast)
        .then(response => response.json()
        .then((data) => {

            let targetTown = document.querySelector('#town');
            let weatherForecastContainer = document.querySelector('.weatherForecastContainer');

            for (let i = 0; i < 40; i++) {
                // console.log(data.list)
                // Affichage du nom de la ville
                targetTown.innerHTML = data.city.name;

                let hoursforecastDiv = document.createElement("div");
                hoursforecastDiv.setAttribute('class', 'hoursforecastDiv');
                weatherForecastContainer.appendChild(hoursforecastDiv);

                // Création et affichage de la zone date
                let timeZone = document.createElement("div");
                timeZone.setAttribute('class', 'timeZone')
                timeZone.innerHTML = "<i class='bi bi-clock'></i> " + data.list[i].dt_txt;
                let hrDate = document.createElement("hr");
                timeZone.appendChild(hrDate)
                hoursforecastDiv.appendChild(timeZone);

                // Création et affichage de la tendance météo
                let weatherZone = document.createElement("div");
                weatherZone.setAttribute('class', 'weatherZone');
                let tendance = data.list[i].weather[0].main;

                switch (tendance) {
                    case 'Thunderstorm' :
                        weatherZone.innerHTML = "Tendance : <i class='bi bi-cloud-lightning'></i>";
                        break;
                    case 'Rain':
                        // weatherZone.innerHTML = "Tendance : <i class='bi bi-cloud-rain-heavy'></i>";
                        weatherZone.innerHTML = "Tendance : <i class='bi bi-cloud-drizzle'></i>";
                        break;
                    case 'Snow':
                        weatherZone.innerHTML = "Tendance : <i class='bi bi-cloud-snow'></i>";
                        break;
                    case 'Mist':
                        weatherZone.innerHTML = "Tendance : <i class='bi bi-cloud-drizzle'></i>";
                        break;               
                    case 'Clear':
                        weatherZone.innerHTML = "Tendance : <i class='bi bi-brightness-high'></i>";
                        break;
                    case 'Clouds':
                        weatherZone.innerHTML = "Tendance : <i class='bi bi-cloud-sun'></i>";
                        break;
                    default:
                        weatherZone.innerHTML = "Tendance : inconnue";
                        break;
                }
                hoursforecastDiv.appendChild(weatherZone);

                // Création de la zone d'affichage des données
                let dataDiv = document.createElement("div");
                dataDiv.setAttribute('class', 'dataDiv');
                weatherZone.appendChild(dataDiv);

                let dataDivTempAndPressure = document.createElement('div');
                dataDiv.appendChild(dataDivTempAndPressure);
                let dataDivWindAndHumidity = document.createElement('div');
                dataDiv.appendChild(dataDivWindAndHumidity);


                // Création et affichage de la zone température
                let tempZone = document.createElement("div");
                //tempZone.innerHTML = "<i class='bi bi-thermometer-half'></i>" + data.list[i].main.temp + "°C, ressentie: " + data.list[i].main.feels_like + "°C";
                tempZone.innerHTML = "<i class='bi bi-thermometer-half'></i>" + data.list[i].main.temp + "°C";
                dataDivTempAndPressure.appendChild(tempZone);

                // Création et affichage de la zone température ressentie
                // let tempFeelsLikeZone = document.createElement("div");
                // tempFeelsLikeZone.appendChild(document.createTextNode(", ressentie: " + data.list[i].main.feels_like + "°C"));
                // weatherZone.appendChild(tempFeelsLikeZone);
                
                // Création et affichage de la pression
                let pressureZone = document.createElement("div");
                // pressureZone.appendChild(document.createTextNode("Pression: " + data.list[i].main.pressure));
                pressureZone.innerHTML = "<i class='bi bi-stopwatch'></i> " + data.list[i].main.pressure;
                dataDivTempAndPressure.appendChild(pressureZone);

                // Création et affichage du vent
                let windZone = document.createElement("div");
                windZone.innerHTML = "<i class='bi bi-wind'></i> " + data.list[i].wind.speed + ' km/h';
                dataDivWindAndHumidity.appendChild(windZone);
                
                // Création et affichage du taux d'humidité
                let humidityZone = document.createElement("div");
                humidityZone.innerHTML = "<i class='bi bi-droplet'></i>" + data.list[i].main.humidity + ' %';
                dataDivWindAndHumidity.appendChild(humidityZone);
            }
        })
    ).catch(err => console.log('Erreur: ' + err));
}

document.getElementById("refresh").addEventListener('click', () => {
    location.reload();
})
