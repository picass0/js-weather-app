export function propertyExists(obj, level,  ...rest) {
    if (obj === undefined) {
        return false;
    }
    if (rest.length === 0 && obj.hasOwnProperty(level)) {
        return true;
    }
    return propertyExists(obj[level], ...rest)
}

export function getDay(date) {
    const days = ['Воскресенье','Понедельник','Вторник','Среда','Четверг','Пятница','Суббота'];
    return days[ date.getDay()];
}

export function getDayShort (date) {
    const days = ['Вс','Пн','Вт','Ср','Чт','Пт','Сб'];
    return days[ date.getDay()];
}