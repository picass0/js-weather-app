/**
 * checks if property exists in object, can inspect nested properties
 * @param {*}obj
 * @param {string} level
 * @param {...string} rest
 * @returns {*}
 */
export function propertyExists(obj, level,  ...rest) {
    if (obj === undefined) {
        return false;
    }
    if (rest.length === 0 && obj.hasOwnProperty(level)) {
        return true;
    }
    return propertyExists(obj[level], ...rest)
}

/**
 * Gives russian day string, based on date
 *
 * @param {Date} date
 * @returns {string}
 */
export function getDay(date) {
    const days = ['Воскресенье','Понедельник','Вторник','Среда','Четверг','Пятница','Суббота'];
    return days[ date.getDay()];
}

/**
 * gives short russian day string, based on date
 *
 * @param date
 * @returns {string}
 */
export function getDayShort (date) {
    const days = ['Вс','Пн','Вт','Ср','Чт','Пт','Сб'];
    return days[ date.getDay()];
}

/**
 * adds leading zeroes if value is less then 10,
 * usefull for minutes/hours/seconds formatting
 *
 * @param {int} $value
 * @returns {string}
 */
export function addLeadingZeroForTime($value) {
    return ($value < 10 ? '0' : '') + $value;
}

/**
 * @param arg1
 * @param arg2
 * @param {function} callback
 * @returns {*}
 */
export function executeCallbackIfBothArgsNotNull(arg1, arg2, callback) {
    if (arg1 === null && arg2 === null) {
        return null;
    }

    if (arg1 === null) {
        return arg2;
    }

    if (arg2 === null) {
        return arg1;
    }

    return callback(arg1, arg2);
}

/**
 * @param value1
 * @param value2
 * @returns {*}
 */
export function lowest(value1, value2) {
    return executeCallbackIfBothArgsNotNull(
        value1,
        value2,
        (value1, value2) => (value1 < value2 ? value1 : value2)
    );
}

/**
 * @param value1
 * @param value2
 * @returns {*}
 */
export function sum(value1, value2) {
    return executeCallbackIfBothArgsNotNull(
        value1,
        value2,
        (value1, value2) => (value1 + value2)
    );
}

/**
 * @param value1
 * @param value2
 * @returns {*}
 */
export function average(value1, value2) {
    return executeCallbackIfBothArgsNotNull(
        value1,
        value2,
        (value1, value2) => ((value1 + value2)/2)
    );
}