/**
 * todo - check if city exists for real
 * @returns {{result: boolean, errors: Array}}
 */
export default function cityNameValidator(cityName) {
    let success = true;
    const errors = [];

    let cleanedCityName = cityName.trim();

    if (cleanedCityName.length === 0) {
        success = false;
        errors.push("Название города не может быть пустым");
    }

    return {
        success: success,
        errors: errors
    }
};
