/**
 * Object holds application state related to cities
 */
class CitiesState {

    /**
     *
     * @param {Object} rawJsonData
     */
    constructor(rawJsonData) {
        this.cities = rawJsonData.cities;
        this.cities.forEach((city) => {
            if (city.id === rawJsonData.activeCityId) {
                this.activeCity = city;
            }

            if (city.id === rawJsonData.homeCityId) {
                this.homeCity = city;
            }
        });
    }

    /**
     * @param {Object} city
     * @param {bool} isActive
     */
    addCity (city, isActive = true) {

        if (!city.id) {
            //todo generate guid
            city.id = '' + Math.floor(Math.random()*1000);
        }

        if (isActive) {
            this.activeCity = city;
        }

        this.cities.push(city);
    }

    getCities () {
        return this.cities;
    }

    setActiveCity (activeCity) {
        //todo check if city exists
        this.activeCity = activeCity;
    }

    removeCity (cityToDelete) {
        if (cityToDelete.id === this.homeCity.id) {
            throw error('home city cannot be deleted');
        }

        if (cityToDelete.id === this.activeCity.id) {
            this.activeCity = this.homeCity;
        }

        this.cities.every((city, index) => {
            if (city.id === cityToDelete.id) {
                this.cities.splice(index, 1);
                return false;
            }

            return true;
        })
    }

    /**
     * @returns {*}
     */
    getHomeCity () {
        return this.homeCity;
    }

    /**
     * @returns {*}
     */
    getActiveCity () {
        return this.activeCity;
    }
}

export default CitiesState;