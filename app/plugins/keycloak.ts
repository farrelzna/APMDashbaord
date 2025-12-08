// import Keycloak from 'keycloak-js'

// export default defineNuxtPlugin(async () => {
//     const config = useRuntimeConfig()
//     const keycloakUrl = config.public.keycloakUrl;
//     const keycloak = new Keycloak({
//         url: keycloakUrl,
//         realm: 'project-monitoring',
//         clientId: 'apm-dashboard'
//     });

//     try {
//         await keycloak.init({ onLoad: 'login-required' });
//         console.log(`User is ${keycloak.authenticated ? 'authenticated' : 'not authenticated'}`);
//     } catch (error) {
//         console.error('Failed to initialize adapter:', error);
//     }

//     return {
//         provide: {
//             authenticate: keycloak
//         }
//     }
// })  