import CitiesState from "../entity/CitiesState";
import City from "../entity/City";

class CitiesStateFactory {

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

        return new CitiesState(cities, activeCity);
    }


    static addCity(currentState, newCity, isActive = true) {
        const currentStateJson = currentState.toJson();

        if(isActive ||currentStateJson.cities.length === 0) {
            currentStateJson.activeCityId = newCity.getId();
        }

        currentStateJson.cities.push(newCity.toJson());

        return CitiesStateFactory.createFromRawJson(currentStateJson);
    }

    static setActiveCity(currentState, newActiveCity) {
        const currentStateJson = currentState.toJson();
        currentStateJson.activeCityId = newActiveCity.getId();

        return CitiesStateFactory.createFromRawJson(currentStateJson);
    }

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