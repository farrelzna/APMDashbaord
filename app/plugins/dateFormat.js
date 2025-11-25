export default defineNuxtPlugin(nuxtApp => {
    return {
        provide: {
            formatDate: (inputDate) => {
                if (inputDate) {
                    const dateParts = inputDate.split('-');
                    const formattedDate = new Date(`${dateParts[0]}-${dateParts[1]}-${dateParts[2]}`).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                    });
                    return formattedDate;
                }
            },
            getDayName: (inputDate) => {
                const date = new Date(inputDate)
                const formatDate = date.toLocaleDateString('en-GB', {
                    weekday: "long"
                })

                return formatDate
            }
        }
    }
})