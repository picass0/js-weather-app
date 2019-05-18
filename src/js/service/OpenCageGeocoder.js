import {propertyExists} from "../utils/utils";

/**
 * https://opencagedata.com/api
 */
class OpenCageGeocoder {

    constructor (apiKey) {
        this.url = 'https://api.opencagedata.com/geocode/v1/json';
        this.apiKey = apiKey;
    }

    getCityNameFromCoordinates(lat, lng) {
        const url = `${this.url}?q=${lat}+${lng}&key=${this.apiKey}&language=ru`;
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

                if (!propertyExists(result, 'components', 'city') || !result.components.city) {
                    throw {msg: "response.results[0].components.city string should be present in response, and it should not be empty", response: response};
                }

                return result.components.city;
            });
    }
}

export default OpenCageGeocoder;
