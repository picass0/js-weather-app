import City from "../entity/City";

/**
 * https://opencagedata.com/api
 */
class OpenCageGeocoder {

    /**
     *
     * @param {string} apiKey
     */
    constructor (apiKey) {
        this.url = 'https://api.opencagedata.com/geocode/v1/json';
        this.apiKey = apiKey;
    }

    /**
     * @param {string} cityName
     * @returns {Promise}
     */
    getCityFromName (cityName) {
        return this.createCityQuery(cityName);
    }

    /**
     * @param {number} lat
     * @param {number} lng
     * @returns {Promise}
     */
    getCityFromCoordinates(lat, lng) {
        return this.createCityQuery(`${lat} + ${lng}`);
    }

    /**
     * @param query
     * @returns {Promise}
     */
    createCityQuery(query) {
        const url = `${this.url}?q=${query}&key=${this.apiKey}&language=ru`;
        return fetch(url)
            .then((response) => {
                if (!response.ok) {
                    throw response;
                }

                return response.json()
            }).then((response) => {
                if (!response.hasOwnProperty('results') || !Array.isArray(response.results) || response.results.length <= 0) {
                    throw {msg:"response.results array should be present in response, and should contain at least one item", response: response};
                }

                const result = response.results[0];

                 if (!result.hasOwnProperty('components')) {
                     throw {msg:"response.results[0].components should be present in response", response: response};
                 }

                 const components = result.components;

                 let city = components.city || null;
                 if (!city && components.town) {
                     city = components.town;
                 }

                 if (!city && components.village) {
                     city = components.village;
                 }

                 const state = components.state || null;
                 const country = components.country || null;

                 if (!country || (!state && !city)) {
                     throw {msg: "not enough information in response.results[0].components object", response: response};
                 }


                return new City({
                    state: state,
                    name: city,
                    country: country
                });
            });
    }
}

export default OpenCageGeocoder;
