import 'promise-polyfill/src/polyfill';
import 'whatwg-fetch';
import './global-assets';
import EventDispatcher from './js/service/EventDispatcher';
import CitiesRepository from './js/service/CitiesRepository';
import ApixuWeatherDataProvider from './js/service/ApixuWeatherDataProvider';
import WeatherMain from './js/component/weather/WeatherMain';
import CitiesMain from "./js/component/cities/CitiesMain";
import cityNameValidator from './js/validator/cityNameValidator';
import parameters from '../parameters.json';
import CitiesState from './js/entity/CitiesState';
import Geolocator from './js/service/Geolocator';
import OpenCageGeocoder from './js/service/OpenCageGeocoder';
import Flash from './js/component/flash/Flash';
import CitiesStateFactory from './js/service/CitiesStateFactory';
import City from "./js/entity/City";

const days = 4;

//initializing services
const dispatcher = new EventDispatcher(document.body);
const citiesRepo = new CitiesRepository();
const geocoder = new OpenCageGeocoder(parameters.openCageGeocoderApiKey);

//initializing state
let globalState = citiesRepo.fetchState();
if (!globalState) {
    const defaultCity = new City({
        name: "Москва",
        state: "Москва",
        country: "РФ",
        lat: 55.7504461,
        lng: 37.6174943
    });

    globalState = new CitiesState([defaultCity], defaultCity, defaultCity);
    const geolocator = new Geolocator(geocoder);

    geolocator.findCurrentCity()
        .then((city) => {
            if (globalState.cityExists(city)) {
                return;
            }

            let state = globalState;
            if (state.cityExists(defaultCity)) {
                state = CitiesStateFactory.removeCity(state, defaultCity);
            }

            const newState = CitiesStateFactory.addCity(state, city, true);

            dispatcher.publish('stateChanged', newState);
            dispatcher.publish('displayWeatherForActiveCity', newState);
        });
}
const weatherDataForCities = {};


//registering components
const citiesDomContainer = document.querySelector('#cities');
const mainCitiesComponent = new CitiesMain(dispatcher, cityNameValidator, citiesDomContainer);
mainCitiesComponent.render(globalState);

const weatherComponentDomContainer = document.querySelector('#weather');
const weatherComponent = new WeatherMain(
    weatherComponentDomContainer,
    new ApixuWeatherDataProvider(parameters.apixuApiKey),
);
weatherComponent.render(globalState.getActiveCity(), days);

const flashComponent = new Flash();
const flashComponentDomContainer = document.body;
flashComponentDomContainer.appendChild(flashComponent.getDomContainer());


//registering event handler(s)
dispatcher.subscribe('addCity', newCityName => {
    geocoder.getCityFromName(newCityName)
        .then((newCity) => {
            if (globalState.cityExists(newCity)) {
                throw {messageForUser: 'город уже есть в списке'};
            }

            const newState = CitiesStateFactory.addCity(globalState, newCity);
            dispatcher.publish('displayWeatherForActiveCity', newState);
        })
        .catch((e) => {
            let message = e.messageForUser;
            if (!message) {
                message = 'Не удалось найти город с переданным именем';
                console.error(e);
            }
            mainCitiesComponent.displayValidationErrors([message]);
        });

});

dispatcher.subscribe('clickCity', city => {
    if (city.getId() === globalState.getActiveCity().getId()) {
        return;
    }
    const newState = CitiesStateFactory.setActiveCity(globalState, city);
    dispatcher.publish('displayWeatherForActiveCity', newState);
});

dispatcher.subscribe('deleteCity', city => {
    let activeCityDeleted = false;
    if (globalState.getActiveCity().getId() === city.getId()) {
        activeCityDeleted = true;
    }
    const newState = CitiesStateFactory.removeCity(globalState, city);

    if (activeCityDeleted) {
        dispatcher.publish('displayWeatherForActiveCity', newState);
    } else {
        dispatcher.publish('stateChanged', newState);
    }
});

dispatcher.subscribe('displayWeatherForActiveCity', state => {
    const activeCity = state.getActiveCity();
    let weatherList = null;
    if (activeCity && weatherDataForCities[activeCity.getId()]) {
        weatherList = weatherDataForCities[activeCity.getId()];
    }
    weatherComponent.render(activeCity, days, weatherList)
        .then((weatherList) => {
            dispatcher.publish('weatherForCityDisplayed', {citiesState: state, weatherList: weatherList});
        })
        .catch(() => {
            dispatcher.publish('cannotDisplayWeatherForCity', activeCity);
        });
});

dispatcher.subscribe('cannotDisplayWeatherForCity', city => {
    if (mainCitiesComponent.isCityBeingAdded()) {
        mainCitiesComponent.displayValidationErrors(["Не получилось отобразить погоду для города " + city.getNameOrStateIfNotExists()]);
        mainCitiesComponent.setCityBeingAdded(false);
        const activeCity = globalState.getActiveCity();
        if (activeCity) {
            dispatcher.publish('displayWeatherForActiveCity', globalState);
        }
    }
});

dispatcher.subscribe('cannotDisplayWeatherForCity', city => {
    if (globalState.cityExists(city)) {
        const newState = CitiesStateFactory.removeCity(globalState, city);
        flashComponent.render(["Не получилось отобразить погоду для города " + city.getNameOrStateIfNotExists()]);
        dispatcher.publish('stateChanged', newState);
    }
});


dispatcher.subscribe('weatherForCityDisplayed', (data) => {
    if (data.citiesState.getCities() && data.weatherList && data.weatherList.length > 0) {
        weatherDataForCities[data.citiesState.getActiveCity().getId()] = data.weatherList;
    }

    if (!globalState.equals(data.citiesState)) {
        dispatcher.publish('stateChanged', data.citiesState);
    }
});

dispatcher.subscribe('stateChanged', (state) => {
    globalState = state;
    mainCitiesComponent.render(state);
    citiesRepo.persisState(globalState);
});