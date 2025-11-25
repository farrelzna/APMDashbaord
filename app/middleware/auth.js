// Auth route middleware (Nuxt 3/4 style)
// Redirects unauthenticated users to login
export default defineNuxtRouteMiddleware((to, from) => {
    // Prefer direct cookie access to avoid store hydration timing issues
    const token = useCookie('access_token');
    if (!token.value) {
        return navigateTo('/auth/login');
    }
});