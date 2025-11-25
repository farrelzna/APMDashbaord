// colorByStatus.js

/**
 * Returns a color class based on the status value using defined theme colors.
 * @param {string} status - The status value.
 * @returns {string} - The color class associated with the status.
 */
export function colorByStatus(status) {
    const statusColors = {
        'Complete': 'success',         // Using theme color 'success'
        'In Progress': 'primary',      // Using theme color 'primary'
        'PM / CM': 'indigo',           // Using theme color 'indigo'
        'On Hold': 'warning',          // Using theme color 'warning'
        'Waiting Payment': 'error',    // Using theme color 'error'
        'Almost Due': 'info',          // Using theme color 'info'
        'Not Started Yet': 'grey200',  // Using theme color 'grey200'
        'Maintenance': 'bgdark', // Using theme color 'lightprimary'
        'Opti': 'bgdark',      // Using theme color 'lightsecondary'
    };

    return statusColors[status] || 'textSecondary'; // Return 'textSecondary' if status is not found
}
