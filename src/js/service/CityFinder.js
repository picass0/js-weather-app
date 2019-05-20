import OpenCageGeocoder from './OpenCageGeocoder';

class CityFinder {
    /**
     *
     * @param {OpenCageGeocoder} geocoder
     */
    constructor (geocoder) {
        this.geocoder = geocoder;
    }

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

    errorHandler (error) {
        console.error(error)
    }
}

export default CityFinder;