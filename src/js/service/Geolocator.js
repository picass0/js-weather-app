import OpenCageGeocoder from './OpenCageGeocoder';

/**
 * Allows finding current city for user
 * works only if user gives consent for geolocation
 */
class Geolocator {
    /**
     *
     * @param {OpenCageGeocoder} geocoder
     */
    constructor (geocoder) {
        this.geocoder = geocoder;
    }

    /**
     * @returns {Promise}
     */
    findCurrentCity() {
        return new Promise((resolve, reject) => {
            try {
                if (!"geolocation" in navigator) {
                    throw "geolocation is not available";
                }

                navigator.geolocation.getCurrentPosition((position) => {
                    return this.geocoder
                        .getCityFromCoordinates(position.coords.latitude, position.coords.longitude)
                        .then(resolve);
                }, this.errorHandler);
            } catch (e) {
                this.errorHandler(e);
            }
        });
    }

    /**
     * @param {*} error
     */
    errorHandler (error) {
        console.error(error)
    }
}

export default Geolocator;