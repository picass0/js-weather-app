
/**
 * Entity holds information about city
 */
class City {

    /**
     * param {*} rawJsonData
     */
    constructor (rawJsonData) {
        this.name = rawJsonData.name || null;
        this.state = rawJsonData.state || null;
        this.country = rawJsonData.country || null;
        this.lat = rawJsonData.hasOwnProperty('lat') ? rawJsonData.lat : null;
        this.long = rawJsonData.hasOwnProperty('long') ? rawJsonData.long : null;

        this.id = (this.name ? this.name : '') + (this.state ? this.state : '') + (this.country ? this.country : '');
    }

    /**
     *
     * @returns {*}
     */
    toJson () {
        return{
            name: this.name,
            state: this.state,
            country: this.country,
            lat: this.lat,
            long: this.long
        };
    }

    /**
     * @returns {number}
     */
    getLat () {
        return this.lat;
    }

    /**
     * @returns {number}
     */
    getLong () {
        return this.long
    }

    /**
     * @returns {string}
     */
    getCountry () {
        return this.country;
    }

    /**
     * @returns {string|null}
     */
    getState () {
        return this.state;
    }

    /**
     * @returns {string|null}
     */
    getName () {
        return this.name;
    }

    /**
     * @returns {string}
     */
    getId() {
        return this.id;
    }

    /**
     * @returns {string}
     */
    getNameOrStateIfNotExists() {
        return !!this.name ? this.name : this.state;
    }

}

export default City;