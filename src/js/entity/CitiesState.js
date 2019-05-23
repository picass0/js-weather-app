import City from './City';

/**
 * Object holds application state related to cities
 */
class CitiesState {

    /**
     *
     */
    constructor(cities = [], activeCity = null, defaultCity = null) {
        this.cities = cities;
        this.activeCity = activeCity;
        this.defaultCity = defaultCity;
    }

    getCities () {
        return this.cities;
    }

    cityExists (cityToCheck) {
        let result = false;
        this.cities.forEach((city) => {
            if (cityToCheck.getId() === city.getId()) {
                result = true;
            }
        });

        return result;
    }

    /*
     * @returns {City}
     */
    getDefaultCity () {
        return this.defaultCity;
    }

    /**
     * @returns {*}
     */
    getActiveCity () {
        return this.activeCity;
    }

    /**
     * @returns {string}
     */
    toJson() {
        return {
            cities: this.cities.map((city) => city.toJson()),
            activeCityId: !!this.activeCity ? this.activeCity.id : null
        };
    }
}

export default CitiesState;