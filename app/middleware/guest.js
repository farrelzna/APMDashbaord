// Guest middleware: redirect authenticated users away from guest-only pages
export default defineNuxtRouteMiddleware((to, from) => {
    const token = useCookie('access_token');
    if (token.value) {
        return navigateTo('/');
    }
});