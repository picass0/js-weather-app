class City {

    /**
     * param {*} rawJsonData
     */
    constructor (rawJsonData) {
        this.name = rawJsonData.name || null;
        this.state = rawJsonData.state || null;
        this.country = rawJsonData.country || null;

        this.id = (this.name ? this.name : '') + (this.state ? this.state : '') + (this.country ? this.country : '');
    }

    toJson () {
        return{
            name: this.name,
            state: this.state,
            country: this.country
        };
    }

    getCountry () {
        return this.country;
    }

    getState () {
        return this.state;
    }

    getName () {
        return this.name;
    }

    getId() {
        return this.id;
    }

    getNameOrStateIfNotExists() {
        return !!this.name ? this.name : this.state;
    }

}

export default City;