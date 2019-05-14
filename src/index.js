import EventDispatcher from './js/service/EventDispatcher';
import CitiesRepository from './js/service/CitiesRepository';
import CitiesStateFactory from './js/service/CitiesStateFactory';
import WeatherDataProvider from './js/service/WeatherDataProvider';
import WeatherList from './js/component/WeatherList';
import WeatherService from './js/service/WeatherService';
import CityList from "./js/component/CityList";
import cityNameValidator from './js/validator/cityNameValidator';

const days = 3;


//initializing services
const dispatcher = new EventDispatcher(document.body);
const citiesRepo = new CitiesRepository();

const weatherListComponent = new WeatherList();
const weatherListDomContainer = document.querySelector('#weather-list');
weatherListDomContainer.appendChild(weatherListComponent.getDomContainer());

const weatherService = new WeatherService(
    new WeatherDataProvider(),
    weatherListComponent,
    dispatcher
);


//initializing state
let citiesState = citiesRepo.fetchState();
if (!citiesState) {
    const citiesStateFactory = new CitiesStateFactory();
    citiesState = citiesStateFactory.createInitialState();
}
weatherService.displayWeatherForCity(citiesState.getActiveCity(), days);


//registering event handler(s)
dispatcher.subscribe('stateChanged', state => {
    citiesRepo.persisState(state);
});
dispatcher.subscribe('activeCityChanged', state => {
    weatherService.displayWeatherForCity(state.getActiveCity(), days);
});


//registering statefull component(s)
const cityList = new CityList(citiesState, dispatcher, cityNameValidator);
const cityListParent = document.querySelector('#cities');
cityListParent.appendChild(cityList.getDomContainer());
cityList.render();


