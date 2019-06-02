import CitiesState from "../entity/CitiesState";
import City from "../entity/City";

/**
 * Factory for CityState
 * always returns new state
 */
class CitiesStateFactory {

    /**
     * @param {*} rawJsonData
     * @returns {CitiesState}
     */
    static createFromRawJson(rawJsonData = null) {
        let cities = [];
        let activeCity =  null;

        if (rawJsonData !== null) {
            cities = rawJsonData.cities.map(rawCity => new City(rawCity));
            cities.forEach((city) => {
                if (city.getId() === rawJsonData.activeCityId) {
                    activeCity = city;
                }
            });
        }

        let defaultCity = null;
        if (rawJsonData.defaultCity) {
            defaultCity = new City(rawJsonData.defaultCity);
        }

        return new CitiesState(cities, activeCity, defaultCity);
    }

    /**
     * @param {CitiesState} currentState
     * @param {City} newCity
     * @param {boolean} isActive
     * @returns {CitiesState}
     */
    static addCity(currentState, newCity, isActive = true) {
        const currentStateJson = currentState.toJson();

        if(isActive ||currentStateJson.cities.length === 0) {
            currentStateJson.activeCityId = newCity.getId();
        }

        currentStateJson.cities.push(newCity.toJson());

        return CitiesStateFactory.createFromRawJson(currentStateJson);
    }

    /**
     * @param {CitiesState} currentState
     * @param {City} newActiveCity
     * @returns {CitiesState}
     */
    static setActiveCity(currentState, newActiveCity) {
        const currentStateJson = currentState.toJson();
        currentStateJson.activeCityId = newActiveCity.getId();

        return CitiesStateFactory.createFromRawJson(currentStateJson);
    }

    /**
     *
     * @param {CitiesState} currentState
     * @param {City} cityToDelete
     * @returns {CitiesState}
     */
    static removeCity(currentState, cityToDelete) {
        let newActiveCity = null;
        if (cityToDelete.getId() === currentState.getActiveCity().getId()) {
            newActiveCity = this.findNewActiveCity(currentState, cityToDelete);
        }

        const currentStateJson = currentState.toJson();
        currentState.getCities().forEach((city, index) => {
            if (city.id === cityToDelete.id) {
                currentStateJson.cities.splice(index, 1);
                return false;
            }

            return true;
        });

        if (newActiveCity) {
            currentStateJson.activeCityId = newActiveCity.getId();
        }

        return CitiesStateFactory.createFromRawJson(currentStateJson);
    }

    /**
     * private method for finding new active city if current city was deleted.
     *
     * if city is deleted, then first city in city list becomes active.
     *
     * handles special case, when first city is the one being deleted
     * in this case second city becomes active.
     *
     * actually better approach would be to first remove city, and then start
     * searching for active city, but this one works fine, so its ok.
     *
     * @param currentState
     * @param cityToDelete
     * @returns {*}
     */
    static findNewActiveCity(currentState, cityToDelete) {
        let newActiveCity = null;
        for (let i = 0; i < currentState.getCities().length; i++) {
            if (currentState.getCities()[i].getId() !== cityToDelete.getId()) {
                newActiveCity = currentState.getCities()[i];
                break;
            }
        }
        return newActiveCity;
    }
}

export default CitiesStateFactory;