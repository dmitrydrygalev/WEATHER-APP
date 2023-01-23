import conditions from "./conditions.js";
const apiKey = 'fed5ebaf68c44416b9692104232001';


// Получаем запрашиваемый город из формы

const form = document.querySelector('.form'),
      input = document.querySelector('.input'),
      header = document.querySelector('.header');
      


// Получаем условия 


// Слушаем отправку формы
form.onsubmit = async function (e) {    
    e.preventDefault();

    // trim обрезает пробелы в начале и в конце
    let city = input.value.trim();    

    const data = await getWeatherData(city);
    console.log(data);
    
    // Если вернулась ошибка
    if (data.error) {

        removeCards();
    
        showError(data.error.message);                
    }        
    
    else {
        removeCards();          

        const info = conditions.find((el) => el.code === data.current.condition.code);
        console.log(info);


        const filePath = "./img/" + (data.current.is_day ? 'day' : 'night') + "/";
        const nameOfImage = (data.current.is_day ? info.day : info.night) + '.png';        
        const imgPath = filePath + nameOfImage;

        const weatherData = {
            name: data.location.name,
            country: data.location.country,
            temp: Math.round(data.current.temp_c),
            condition: data.current.is_day ? info.languages[23]["day_text"]
                                           : info.languages[23]["night_text"],
            imgPath: imgPath
        };

        showCard(weatherData);
    }        

};


function removeCards () {
    const prevCard = document.querySelector('.card');
                if (prevCard) {
                    prevCard.remove();
                }
}

function showError (errMessage) {
    const errorHtml = `<div class="card">${errMessage}</div>`;
    header.insertAdjacentHTML('afterend', errorHtml);
}

function showCard ({name, country, temp, condition, imgPath}) {
    const htmlCard = `<div class="card">
        <h2 class="card_city">${name}<span>${country}</span></h2>

        <div class="card_weather">
            <div class="card_value">${temp}<sup>°c</sup> </div>
            <img class="card_img" src="${imgPath}" alt="">
        </div>
        
        <div class="card_description">${condition}</div>
    </div>`;

    //
    header.insertAdjacentHTML('afterend', htmlCard);
}

async function getWeatherData (city) {
    const url = `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`;

    const response = await fetch (url);
    const data = await response.json();

    // console.log(data);
    return data;    
}


