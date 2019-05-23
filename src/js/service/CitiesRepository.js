import CitiesState from '../entity/CitiesState';
import CitiesStateFactory from './CitiesStateFactory';

class CitiesRepository {

    /**
     * @returns {CitiesState}
     */
    fetchState() {
        const jsonString = localStorage.getItem('CitiesState');

        if (!jsonString) {
            return null;
        }

        const parsedJson = JSON.parse(jsonString);

        return CitiesStateFactory.createFromRawJson(parsedJson);
    }

    persisState(state) {
        const json = state.toJson();
        localStorage.setItem('CitiesState', JSON.stringify(json));
    }
}

export default CitiesRepository;