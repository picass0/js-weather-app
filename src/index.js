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


const days = 4;


//initializing services
const dispatcher = new EventDispatcher(document.body);
const citiesRepo = new CitiesRepository();


//initializing state
let citiesState = citiesRepo.fetchState();
if (!citiesState) {
    citiesState = new CitiesState();
    const cityFinder = new CityFinder(
        new OpenCageGeocoder(parameters.openCageGeocoderApiKey)
    );

    cityFinder.findCurrentCity().then((currentCityName) => {
        let activeCityChanged = false;
        if (citiesState.getActiveCity() === null) {
            activeCityChanged = true
        }
        citiesState.addCity({name: currentCityName}, false);

        dispatcher.publish('stateChanged', citiesState);

        if (activeCityChanged) {
            dispatcher.publish('activeCityChanged', citiesState);
        }
    });
}


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


//registering event handler(s)
dispatcher.subscribe('addCity', newCity => {
    citiesState.addCity(newCity);
    dispatcher.publish('stateChanged', citiesState);
    dispatcher.publish('activeCityChanged', citiesState);
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
    weatherComponent.render(state.getActiveCity(), days);
});

dispatcher.subscribe('cannotDisplayWeatherForCity', city => {
    citiesState.removeCity(city);
    dispatcher.publish('stateChanged', citiesState);
    cityList.displayValidationErrors(["Не получилось отобразить погоду для города"]);
    console.error('cannot display weather for city ' + city.name);
});

dispatcher.subscribe('weatherForCityDisplayed', () => {
    cityList.render(citiesState);
});
