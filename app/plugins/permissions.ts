export default defineNuxtPlugin((nuxtApp) => {
  // Helper function to check permission (supports both string and array)
  const checkPermission = (
    permission: string | string[] | undefined,
    userStore: any
  ): boolean => {
    // If no permission required, show element
    if (!permission) return true;

    const userPermissions = userStore.userPermissions || [];
    const role = userStore.user?.role;

    // Admin and super_admin bypass all permission checks
    if (role === "admin" || role === "super_admin") {
      return true;
    }

    // Handle array of permissions (ANY match = true)
    if (Array.isArray(permission)) {
      return permission.some((p) => userPermissions.includes(p));
    }

    // Handle single string permission
    return userPermissions.includes(permission);
  };

  nuxtApp.vueApp.directive("can", {
    mounted(el, binding) {
      // DEVELOPMENT BYPASS
      const { bypassPermissions } = useDevConfig();
      if (bypassPermissions) {
        return; // Show all elements in dev mode
      }

      const userStore = useUserStore();
      const hasPermission = checkPermission(binding.value, userStore);

      // Use CSS class instead of inline styles to prevent forced reflow
      if (!hasPermission) {
        el.classList.add("v-can-hidden");
        el.setAttribute("aria-hidden", "true");
      }
    },
    updated(el, binding) {
      const userStore = useUserStore();
      const hasPermission = checkPermission(binding.value, userStore);

      // Toggle class instead of manipulating styles directly
      if (hasPermission) {
        el.classList.remove("v-can-hidden");
        el.removeAttribute("aria-hidden");
      } else {
        el.classList.add("v-can-hidden");
        el.setAttribute("aria-hidden", "true");
      }
    },
  });
});
