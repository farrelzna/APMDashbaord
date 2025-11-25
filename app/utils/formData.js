export function createFormData(data, fields) {
    const formData = new FormData();

    const appendToFormData = (key, value) => {
        if (Array.isArray(value)) {
            value.forEach((item, index) => {
                if (isObject(item)) {
                    Object.keys(item).forEach(subKey => {
                        appendToFormData(`${key}[${index}][${subKey}]`, item[subKey]);
                    });
                } else {
                    formData.append(`${key}[${index}]`, item);
                }
            });
        } else if (isObject(value)) {
            Object.keys(value).forEach(subKey => {
                appendToFormData(`${key}[${subKey}]`, value[subKey]);
            });
        } else if (value !== null && value !== undefined) {
            formData.append(key === 'logoFile' ? 'logo' : key, value);
        }
    };

    const isObject = (value) => {
        return typeof value === 'object' && value !== null && !Array.isArray(value) && !(value instanceof File);
    };

    fields.forEach(field => {
        if (data[field] !== undefined && data[field] !== null) {
            appendToFormData(field, data[field]);
        }
    });

    return formData;
}
