import CitiesState from '../entity/CitiesState';

class CitiesRepository {

    /**
     * @returns {CitiesState}
     */
    fetchState() {
        //todo mb make static
        //todo fetching from local storage
        //todo validation of cities

        return new CitiesState({
            cities : [
                {id: '2', name: 'Izhevsk'},
                {id: '1', name: 'Moscow'},
                {id: '3', name: 'Paris'},
            ],
            activeCityId: '1',
            homeCityId: '2'
        });
    }

    persisState(state) {
        //todo saving to local storage
        console.log('state persisted');
        console.log(state);
    }
}

export default CitiesRepository