/**
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

    if (!/[a-zA-ZА-Яа-я]/.test(cleanedCityName)) {
        success = false;
        errors.push("Название города должно иметь как минимум 1 букву");
    }

    return {
        success: success,
        errors: errors
    }
};
