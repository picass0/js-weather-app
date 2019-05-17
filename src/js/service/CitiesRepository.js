import CitiesState from '../entity/CitiesState';

class CitiesRepository {

    /**
     * todo mb make static
     * todo validation
     * @returns {CitiesState}
     */
    fetchState() {
        const jsonString = localStorage.getItem('CitiesState');

        if (!jsonString) {
            return null;
        }

        const parsedJson = JSON.parse(jsonString);

        return new CitiesState(parsedJson);
    }

    persisState(state) {
        localStorage.setItem('CitiesState', state.toJson());
    }
}

export default CitiesRepository;