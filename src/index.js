import 'promise-polyfill/src/polyfill';
import 'whatwg-fetch';
import './global-assets';
import EventDispatcher from './js/service/EventDispatcher';
import CitiesRepository from './js/service/CitiesRepository';
import ApixuWeatherDataProvider from './js/service/ApixuWeatherDataProvider';
import WeatherComponent from './js/component/WeatherComponent';
import CityList from "./js/component/CityList";
import cityNameValidator from './js/validator/cityNameValidator';
import parameters from './parameters.json';
import CitiesState from './js/entity/CitiesState';
import CityFinder from './js/service/CityFinder';
import OpenCageGeocoder from './js/service/OpenCageGeocoder';
import FlashComponent from './js/component/FlashComponent';
import CitiesStateFactory from './js/service/CitiesStateFactory';
import City from "./js/entity/City";


//initializing services
const dispatcher = new EventDispatcher(document.body);
const citiesRepo = new CitiesRepository();
const geocoder = new OpenCageGeocoder(parameters.openCageGeocoderApiKey);

//initializing state
let globalState = citiesRepo.fetchState();
if (!globalState) {
    const defaultCity = new City(parameters.defaultCity);
    globalState = new CitiesState([defaultCity], defaultCity, defaultCity);
    const cityFinder = new CityFinder(geocoder);

    cityFinder.findCurrentCity()
        .then((city) => {
            let state = globalState;
            const defaultCity = globalState.getDefaultCity();
            if (defaultCity) {
                state = CitiesStateFactory.removeCity(state, defaultCity);
            }

            let activeCityChanged = false;
            if (state.getActiveCity() === null) {
                activeCityChanged = true
            }

            const newState = CitiesStateFactory.addCity(state, city, false);

            dispatcher.publish('stateChanged', newState);

            if (activeCityChanged) {
                dispatcher.publish('displayWeatherForActiveCity', newState);
            }
        });
}
const weatherDataForCities = {};


//registering components
const weatherComponentDomContainer = document.querySelector('#weather-list');
const weatherComponent = new WeatherComponent(
    weatherComponentDomContainer,
    new ApixuWeatherDataProvider(parameters.apixuApiKey),
);
weatherComponent.render(globalState.getActiveCity(), parameters.days);


const cityList = new CityList(dispatcher, cityNameValidator);
const cityListParent = document.querySelector('#cities');
cityListParent.appendChild(cityList.getDomContainer());
cityList.render(globalState);

const flashComponent = new FlashComponent();
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
            cityList.displayValidationErrors([message]);
        });

});

dispatcher.subscribe('clickCity', city => {
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
    weatherComponent.render(activeCity, parameters.days, weatherList)
        .then((weatherList) => {
            dispatcher.publish('weatherForCityDisplayed', {citiesState: state, weatherList: weatherList});
        })
        .catch(() => {
            dispatcher.publish('cannotDisplayWeatherForCity', activeCity);
        });
});

dispatcher.subscribe('cannotDisplayWeatherForCity', city => {
    if (cityList.isCityBeingAdded()) {
        cityList.displayValidationErrors(["Не получилось отобразить погоду для города " + city.getNameOrStateIfNotExists()]);
        cityList.setCityBeingAdded(false);
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
    if (data.citiesState.getCities() && data.weatherView && data.weatherView.length > 0) {
        weatherDataForCities[data.citiesState.getActiveCity().getId()] = data.weatherView;
    }

    if (!globalState.equals(data.citiesState)) {
        dispatcher.publish('stateChanged', data.citiesState);
    }
});

dispatcher.subscribe('stateChanged', (state) => {
    globalState = state;
    cityList.render(state);
    citiesRepo.persisState(globalState);
});