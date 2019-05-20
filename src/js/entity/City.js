class City {

    /**
     * param {*} rawJsonData
     */
    constructor (rawJsonData) {
        this.id = rawJsonData.name + rawJsonData.state + rawJsonData.country;
        this.name = rawJsonData.name;
        this.state = rawJsonData.state;
        this.country = rawJsonData.country;
    }

    toJson () {
        return{
            name: this.name,
            state: this.state,
            country: this.country
        };
    }

    getId() {
        return this.id;
    }

}

export default City;