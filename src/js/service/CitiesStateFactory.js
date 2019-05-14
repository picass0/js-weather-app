import CitiesState from "../entity/CitiesState";

class CitiesStateFactory {
    /**
     * @returns {CitiesState}
     */
    createInitialState() {
        //todo coding
        return new CitiesState({});
    }
}

export default CitiesStateFactory;