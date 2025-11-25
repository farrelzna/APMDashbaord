// Utility function to check if two arrays are equal
function arraysEqual(arr1, arr2) {
    if (arr1.length !== arr2.length) return false;
    for (let i = 0; i < arr1.length; i++) {
        if (arr1[i] !== arr2[i]) return false;
    }
    return true;
}

// Utility function to check if two objects are equal
function objectsEqual(obj1, obj2) {
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);
    if (keys1.length !== keys2.length) return false;
    for (let key of keys1) {
        if (obj1[key] !== obj2[key]) return false;
    }
    return true;
}

// Function to find differences between data and defaultItem based on fields, excluding specified fields
export function filterData(data, defaultItem, fields, excludeFields = []) {
    fields.forEach(key => {
        if (!excludeFields.includes(key)) {
            if (data.hasOwnProperty(key) && defaultItem.hasOwnProperty(key)) {
                if (Array.isArray(data[key]) && Array.isArray(defaultItem[key])) {
                    if (!arraysEqual(data[key], defaultItem[key])) {
                        result[key] = data[key];
                    }
                } else if (typeof data[key] === 'object' && typeof defaultItem[key] === 'object') {
                    if (!objectsEqual(data[key], defaultItem[key])) {
                        result[key] = data[key];
                    }
                } else if (data[key] !== defaultItem[key]) {
                    result[key] = data[key];
                }
            }
        } else {
            result[key] = data[key];
        }
    });

    return result;
}
