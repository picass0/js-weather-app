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

    /**
     *
     * @param {CitiesState} citiesState
     * @returns {boolean}
     */
    equals(citiesState) {
        const cities = citiesState.getCities();
        for (let i = 0; i < cities.length; i++) {
            if (!this.cityExists(cities[i])) {
                return false
            }
        }

        const thisActiveCityId = this.getActiveCity() ? this.getActiveCity().getId() : null;
        const passedActiveCityId = citiesState.getActiveCity() ? citiesState.getActiveCity().getId() : null;

        if (thisActiveCityId !== passedActiveCityId) {
            return false;
        }

        if (this.getDefaultCity().getId() !== citiesState.getDefaultCity().getId()) {
            return false;
        }

        return true;
    }
}

export default CitiesState;