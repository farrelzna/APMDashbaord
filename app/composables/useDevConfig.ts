/**
 * Development Configuration
 *
 * Set DISABLE_PERMISSIONS=true untuk bypass semua permission checks
 * ⚠️ JANGAN AKTIFKAN DI PRODUCTION!
 */
export const useDevConfig = () => {
  const config = useRuntimeConfig();
  const isDevMode = import.meta.dev; // Nuxt's built-in dev mode check

  return {
    isDevMode,
    disablePermissions: config.public.disablePermissions,
    // Bypass all permission checks in dev mode if flag is set
    bypassPermissions: isDevMode && config.public.disablePermissions,
  };
};
