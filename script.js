const API_KEY = "4454b11a288b8e0044e9fec3ac5cde52";
const API_URL = "https://api.openweathermap.org/data/2.5/weather";

const API_URL_5days = "https://api.openweathermap.org/data/2.5/forecast";

const IMG_URL = "https://api.openweathermap.org/img/w";

let city = "Minsk";

let cityInput = document.querySelector(".site-search-type");
cityInput.value = city;

let showCity = document.querySelector(".weather-menu-cityName");
showCity.innerHTML = city;

let searchImg = document.querySelector(".site-search-img");

let localDate = document.querySelector(".weather-menu-date h2");
localDate.innerHTML = new Date().toLocaleDateString();

let wrapper = document.querySelector(".wrapper");
let contWeather = document.querySelector(".container-weather");

let wrapperOneDay = document.querySelector(".wrapper-one-day");

let btnToday = document.querySelector(".menu-today-btn");
let btn5Days = document.querySelector(".menu-5days-btn");

let errorImg = document.querySelector(".error");
let errorText = document.querySelector(".error-title");

//real forecast
function getWeather() {
    fetch(`${API_URL}?q=${city}&appid=${API_KEY}&lang=ru&units=metric`)
    .then((response) => response.json())
    .then((data) => {
        //console.log(data);
        getWeatherCondition(data);
    })
    .catch(() => {
        document.body.innerHTML = errorImg.innerHTML;
    })
}
getWeather();

//forecast 5-days
function getWeather5Days() {
    fetch(`${API_URL_5days}?q=${city}&appid=${API_KEY}&lang=ru&units=metric`)
    .then((response) => response.json())
    .then((data) => {
        console.log(data);
        getDayWeather(data);
    })
}
getWeather5Days();

//change name city
function setCity() {
    city = cityInput.value;
    showCity.innerHTML = cityInput.value.charAt(0).toUpperCase() + cityInput.value.slice(1);
    
    getWeather();
    getWeather5Days();
    
    cityInput.blur();
}

searchImg.addEventListener('click', setCity);

//block real weather conditions
function getWeatherCondition(data) {
    
    let temp = document.querySelector(".weather-info-degree-temp p");
    temp.innerHTML = Math.round(data.main.temp) + " " + "°C";

    let tempFeels = document.querySelector(".weather-info-degree-feels p");
    tempFeels.innerHTML = "Ощущается как"  + " " + Math.round(data.main.feels_like) + "°";

    let timeSunrise = document.querySelector(".weather-info-sun-rise-time");
    let timeRise = new Date(data.sys.sunrise * 1000);
    let riseTimeHours = timeRise.getHours();
    let riseTimeMinutes = timeRise.getMinutes();
    
    if (riseTimeHours >= 0 && riseTimeHours <= 9){
        timeSunrise.innerHTML = `0${riseTimeHours}:${riseTimeMinutes} AM`;
    } else if (riseTimeMinutes >= 0 && riseTimeMinutes <= 9){
        timeSunrise.innerHTML = `${riseTimeHours}:0${riseTimeMinutes} AM`;
    } else if (riseTimeHours >= 0 && riseTimeHours <= 9 && riseTimeMinutes >= 0 && riseTimeMinutes <= 9){
        timeSunrise.innerHTML = `0${riseTimeHours}:0${riseTimeMinutes} AM`;
    } else {
        timeSunrise.innerHTML = `${riseTimeHours}:${riseTimeMinutes} AM`;
    }
    
    let timeSunset = document.querySelector(".weather-info-sun-set-time");
    let timeSet = new Date(data.sys.sunset * 1000);
    let setTimeHours = timeSet.getHours();
    let setTimeMinutes = timeSet.getMinutes();
    
    if (setTimeHours >= 0 && setTimeHours <= 9) {
        timeSunset.innerHTML = `0${setTimeHours}:${setTimeMinutes} PM`;
    } else if (setTimeMinutes >= 0 && setTimeMinutes <= 9) {
        timeSunset.innerHTML = `${setTimeHours}:0${setTimeMinutes} PM`;
    } else if (setTimeHours >= 0 && setTimeHours <= 9 && setTimeMinutes >= 0 && setTimeMinutes <= 9){
        timeSunset.innerHTML = `0${setTimeHours}:0${setTimeMinutes} PM`;
    } else {
        timeSunset.innerHTML = `${setTimeHours}:${setTimeMinutes} PM`;
    }

    let durationSunTime = document.querySelector(".weather-info-sun-duration-time");
    let timeDurationHours = Math.floor((data.sys.sunset -data.sys.sunrise) / 3600);
    let timeDurationMinutes = Math.floor(((data.sys.sunset - data.sys.sunrise) / 60 ) - (timeDurationHours * 60));
    
    if (timeDurationHours >= 0 && timeDurationHours <= 9) {
        durationSunTime.innerHTML = `0${timeDurationHours}:${timeDurationMinutes} hr`;
    } else if (timeDurationMinutes >= 0 && timeDurationMinutes <= 9){
        durationSunTime.innerHTML = `${timeDurationHours}:0${timeDurationMinutes} hr`;
    } else if (timeDurationHours >= 0 && timeDurationHours <= 9 && timeDurationMinutes >= 0 && timeDurationMinutes <= 9){
        durationSunTime.innerHTML = `0${timeDurationHours}:0${timeDurationMinutes} hr`;
    } else {
        durationSunTime.innerHTML = `${timeDurationHours}:${timeDurationMinutes} hr`;
    }
    
    let description = document.querySelector(".weather-info-condition-description p");
    description.innerHTML = data.weather[0].description;
    
    let icon = document.querySelector(".weather-info-condition-icon-item");
    icon.src = `${IMG_URL}/${data.weather[0].icon}.png`; 
}

//buttons вкладки
btnToday.addEventListener("click", function() {
    btnToday.classList.add("menu-today-btn-click");
    btn5Days.classList.remove("menu-today-btn-click");
    
    wrapper.classList.add("hide");
    contWeather.classList.remove("hide");

    wrapperOneDay.classList.add("view");
})

btn5Days.addEventListener("click", function() {
    btn5Days.classList.add("menu-today-btn-click");
    btnToday.classList.remove("menu-today-btn-click");

    wrapper.classList.remove("hide");
    contWeather.classList.add("hide");

    wrapperOneDay.classList.remove("view");
})

//block forecast 5-days
let globalArr = [];
let daysWeek = ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];
let months = ["", "Янв", "Фев", "Мар", "Апр", "Май", "Июн", "Июл", "Авг", "Сен", "Окт", "Ноя", "Дек"];

//получение конкретного времени каждого дня
function getDayWeather(data) {
    globalArr = [];
    let dayOne = [];
    let imgs = [];
    let temps = [];
    let descriptions = [];
    let allMonth = [];
    let numDays = [];
    let weekDays = [];
    let hours = [];

    for (let i = 0; i < data.list.length; i++) {
        globalArr.push(data.list[i]);
        //console.log(globalArr);
    
        if (data.list[i].dt_txt.includes("15:00:00")) {
            dayOne.push(data.list[i].dt_txt);
            //console.log(dayOne);

            imgs.push(data.list[i].weather[0].icon);

            temps.push(data.list[i].main.temp.toFixed(0));

            descriptions.push(data.list[i].weather[0].description);

            let hour = new Date(data.list[i].dt * 1000);
            let numHour = hour.getUTCHours();
            hours.push(numHour);
            
            let date = new Date(data.list[i].dt * 1000);
            let month = date.getUTCMonth() + 1;
            allMonth.push(months[month]);

            let num = new Date(data.list[i].dt * 1000);
            numDays.push(num.getUTCDate());

            let dt = new Date(data.list[i].dt * 1000);
            let numDt = dt.getUTCDay();
            weekDays.push(daysWeek[numDt]);
        }
    }
    getOneDay(dayOne, imgs, temps, numDays, weekDays, allMonth, hours, descriptions); 
}

//создание элемента каждого дня на конкретное время (15:00) на странице
function getOneDay(dayOne, imgs, temps, numDays, weekDays, allMonth, hours, descriptions){
    let wrapperDay = "";
    
    for (let i = 0; i < dayOne.length; i++){
        wrapperDay += `
            <div class="wrapper-day">
            <h3 class="wrapper-day-info">${weekDays[i]} ${allMonth[i]} ${numDays[i]}</h3>
            <p class="wrapper-day-hour">${hours[i]} : 00</p>
            <div class="wrapper-day-icon">
            <img src="${IMG_URL}/${imgs[i]}.png" class="wrapper-day-img">
            </div>
            <p class="wrapper-day-temp">${temps[i]} °C</p>
            <p class="wrapper-day-condition">${descriptions[i]}</p>
            </div>
        `
    }
    wrapper.innerHTML = wrapperDay;

    let daysBtns = document.querySelectorAll(".wrapper-day");
    
    getDateBtn(daysBtns, dayOne);
}

//клик на каждый день
function getDateBtn(btns, dayOne) {
    for (let i = 0; i < btns.length; i++) {
        btns[i].addEventListener("click", function(){
            
            for (let i = 0; i < btns.length; i++) {
                btns[i].classList.remove("wrapper-color");
            }
            btns[i].classList.add("wrapper-color");
            
            let dateForBtn = dayOne[i].split(' ').shift();
            //console.log(dateForBtn);
            getHourlyForecast(dateForBtn);
        })
    }
}

//погода за один день по всем полученным часам

function getHourlyForecast(dateForBtn) {
    let arrOneDay = [];
        for (let i = 0; i < globalArr.length; i++) {
            if (globalArr[i].dt_txt.includes(`${dateForBtn}`)) {
                arrOneDay.push(globalArr[i]);
                console.log(arrOneDay);
            }
        }
        getEveryHourInfo(arrOneDay);
}

function getEveryHourInfo(arrOneDay) {
    let everyWeekDays = [];
    let everyMonth = [];
    let everyNumDays = [];
    let everyHr = [];
    let everyImg = [];
    let everyTemp = [];
    let everyDescription = [];

        for (let k = 0; k < arrOneDay.length; k++) {
            
            let date = new Date(arrOneDay[k].dt * 1000);
            let month = date.getUTCMonth() + 1;
            everyMonth.push(months[month]);
            
            let num = new Date(arrOneDay[k].dt * 1000);
            everyNumDays.push(num.getUTCDate());

            let dt = new Date(arrOneDay[k].dt * 1000);
            let numDt = dt.getUTCDay();
            everyWeekDays.push(daysWeek[numDt]);

            let numEveryHr = new Date(arrOneDay[k].dt * 1000);
            everyHr.push(numEveryHr.getUTCHours());

            everyImg.push(arrOneDay[k].weather[0].icon);
            everyTemp.push(arrOneDay[k].main.temp.toFixed(0));
            everyDescription.push(arrOneDay[k].weather[0].description);
        }

        getEveryHour(arrOneDay, everyWeekDays, everyMonth, everyNumDays, everyHr, everyImg, everyTemp, everyDescription);
}

function getEveryHour(arrOneDay, everyWeekDays, everyMonth, everyNumDays, everyHr, everyImg, everyTemp, everyDescription) {
    let wrapperEveryDay = "";
        
    for (let i = 0; i < arrOneDay.length; i++) {
            
            wrapperEveryDay += `
            <div class="wrapper-every-day">
            <h3 class="wrapper-every-day-info">${everyWeekDays[i]} ${everyMonth[i]} ${everyNumDays[i]} </h3>
            <p class="wrapper-every-day-hour">${everyHr[i]}:00</p>
            <div class="wrapper-every-day-icon">
            <img src="${IMG_URL}/${everyImg[i]}.png" class="wrapper-every-day-img">
            </div>
            <p class="wrapper-every-day-temp">${everyTemp[i]} °C</p>
            <p class="wrapper-every-day-condition">${everyDescription[i]}</p>
            </div>
            `
    }
    wrapperOneDay.innerHTML = wrapperEveryDay;
}









