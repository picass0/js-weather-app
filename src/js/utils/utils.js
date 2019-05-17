export function propertyExists(obj, level,  ...rest) {
    if (obj === undefined) {
        return false;
    }
    if (rest.length === 0 && obj.hasOwnProperty(level)) {
        return true;
    }
    return propertyExists(obj[level], ...rest)
}