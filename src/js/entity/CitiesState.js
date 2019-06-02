import City from './City'

/**
 * Object holds application state related to cities
 */
class CitiesState {

    /**
     * @param {City[]} cities
     * @param {City|null} activeCity
     */
    constructor(cities = [], activeCity = null) {
        this.cities = cities;
        this.activeCity = activeCity;
    }

    /**
     * @returns {City[]}
     */
    getCities () {
        return this.cities;
    }

    /**
     * @param {City} cityToCheck
     * @returns {boolean}
     */
    cityExists (cityToCheck) {
        let result = false;
        this.cities.forEach((city) => {
            if (cityToCheck.getId() === city.getId()) {
                result = true;
            }
        });

        return result;
    }

    /**
     * @returns {City|null}
     */
    getActiveCity () {
        return this.activeCity;
    }

    /**
     * @returns {Object}
     */
    toJson() {
        return {
            cities: this.cities.map((city) => city.toJson()),
            activeCityId: !!this.activeCity ? this.activeCity.id : null
        };
    }

    /**
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

        return true;
    }
}

export default CitiesState;