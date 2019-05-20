import City from './City';

/**
 * Object holds application state related to cities
 */
class CitiesState {

    /**
     *
     * @param {Object} rawJsonData
     */
    constructor(rawJsonData = null) {
        this.cities = [];
        this.activeCity = null;

        if (rawJsonData !== null) {
            this.cities = rawJsonData.cities.map(rawCity => new City(rawCity));
            this.cities.forEach((city) => {
                if (city.id === rawJsonData.activeCityId) {
                    this.activeCity = city;
                }
            });
        }
    }

    /**
     * @param {Object} city
     * @param {boolean} isActive
     */
    addCity (city, isActive = true) {
        if (isActive || this.cities.length === 0) {
            this.activeCity = city;
        }

        this.cities.push(city);
    }

    getCities () {
        return this.cities;
    }

    setActiveCity (activeCity) {
        this.activeCity = activeCity;
    }

    removeCity (cityToDelete) {
        this.cities.every((city, index) => {
            if (city.id === cityToDelete.id) {
                this.cities.splice(index, 1);
                return false;
            }

            return true;
        });

        if (cityToDelete.id === this.activeCity.id) {
            let newActiveCity = null;
            if (this.cities[0]) {
                newActiveCity = this.cities[0];
            }

            this.activeCity = newActiveCity;
        }
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