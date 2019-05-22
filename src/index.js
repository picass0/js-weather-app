import 'promise-polyfill/src/polyfill';
import 'whatwg-fetch';
import EventDispatcher from './js/service/EventDispatcher';
import CitiesRepository from './js/service/CitiesRepository';
import WeatherDataProvider from './js/service/WeatherDataProvider';
import WeatherList from './js/component/WeatherList';
import WeatherComponent from './js/component/WeatherComponent';
import CityList from "./js/component/CityList";
import cityNameValidator from './js/validator/cityNameValidator';
import parameters from './parameters.json';
import CitiesState from './js/entity/CitiesState';
import CityFinder from './js/service/CityFinder';
import OpenCageGeocoder from './js/service/OpenCageGeocoder';
import FlashComponent from './js/component/FlashComponent';


const days = 4;


//initializing services
const dispatcher = new EventDispatcher(document.body);
const citiesRepo = new CitiesRepository();
const geocoder = new OpenCageGeocoder(parameters.openCageGeocoderApiKey);

//initializing state
let citiesState = citiesRepo.fetchState();
if (!citiesState) {
    citiesState = new CitiesState();
    const cityFinder = new CityFinder(geocoder);

    cityFinder.findCurrentCity().then((city) => {
        let activeCityChanged = false;
        if (citiesState.getActiveCity() === null) {
            activeCityChanged = true
        }
        citiesState.addCity(city, false);

        dispatcher.publish('stateChanged', citiesState);

        if (activeCityChanged) {
            dispatcher.publish('activeCityChanged', citiesState);
        }
    });
}
const weatherDataForCities = {};


//registering components
const weatherComponent = new WeatherComponent(
    new WeatherDataProvider(parameters.apiKey),
    new WeatherList(),
    dispatcher,
);
const weatherComponentDomContainer = document.querySelector('#weather-list');
weatherComponentDomContainer.appendChild(weatherComponent.getDomContainer());
weatherComponent.render(citiesState.getActiveCity(), days);


const cityList = new CityList(dispatcher, cityNameValidator);
const cityListParent = document.querySelector('#cities');
cityListParent.appendChild(cityList.getDomContainer());
cityList.render(citiesState);

const flashComponent = new FlashComponent();
const flashComponentDomContainer = document.body;
flashComponentDomContainer.appendChild(flashComponent.getDomContainer());


//registering event handler(s)
dispatcher.subscribe('addCity', newCityName => {
    geocoder.getCityFromName(newCityName)
        .then((newCity) => {
            citiesState.addCity(newCity);
            dispatcher.publish('stateChanged', citiesState);
            dispatcher.publish('activeCityChanged', citiesState);
        })
        .catch((e) => {
            console.error(e);
            cityList.displayValidationErrors(['Не удалось найти город с переданным именем']);
        });

});

dispatcher.subscribe('clickCity', city => {
    citiesState.setActiveCity(city);
    dispatcher.publish('activeCityChanged', citiesState);
    dispatcher.publish('stateChanged', citiesState);
});

dispatcher.subscribe('deleteCity', city => {
    let activeCityDeleted = false;
    if (citiesState.getActiveCity().id === city.id) {
        activeCityDeleted = true;
    }
    citiesState.removeCity(city);
    dispatcher.publish('stateChanged', citiesState);

    if (activeCityDeleted) {
        dispatcher.publish('activeCityChanged', citiesState);
    } else {
        cityList.render(citiesState);
    }
});

dispatcher.subscribe('stateChanged', state => {
    citiesRepo.persisState(state);
});

dispatcher.subscribe('activeCityChanged', state => {
    const activeCity = state.getActiveCity();
    let weatherList = null;
    if (activeCity && weatherDataForCities[activeCity.getId()]) {
        weatherList = weatherDataForCities[activeCity.getId()];
    }
    weatherComponent.render(activeCity, days, weatherList);
});

dispatcher.subscribe('cannotDisplayWeatherForCity', city => {
    citiesState.removeCity(city);
    dispatcher.publish('stateChanged', citiesState);
    const message = ["Не получилось отобразить погоду для города " + city.getName()];
    if (cityList.isCityBeingAdded()) {
        cityList.displayValidationErrors(message);
        cityList.setCityBeingAdded(false);
    } else {
        flashComponent.render(message);
        cityList.render(citiesState);
    }
    console.error('cannot display weather for city ' + city.name);
});

dispatcher.subscribe('weatherForCityDisplayed', (data) => {
    if (data.city && data.weatherList) {
        weatherDataForCities[data.city.id] = data.weatherList;
    }
    cityList.render(citiesState);
});
