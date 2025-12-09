/**
 * Permission Helper Composable
 * Provides helper functions for permission checking in script setup
 *
 * @example
 * const { can, canAny, hasRole } = usePermissionHelpers();
 * if (can('client.view_client')) { ... }
 */
export const usePermissionHelpers = () => {
  const userStore = useUserStore();

  /**
   * Check if user has a specific permission
   * @param permission - Permission string (e.g., 'client.view_client')
   * @returns true if user has permission or is admin/super_admin
   */
  const can = (permission: string): boolean => {
    if (!permission) return true;

    const userPermissions = userStore.userPermissions || [];
    const role = (userStore.user as any)?.role;

    // Admin and super_admin bypass all permission checks
    if (role === "admin" || role === "super_admin") {
      return true;
    }

    return userPermissions.includes(permission);
  };

  /**
   * Check if user has ANY of the provided permissions (OR logic)
   * @param permissions - Array of permission strings
   * @returns true if user has at least one permission
   */
  const canAny = (permissions: string[]): boolean => {
    if (!permissions || permissions.length === 0) return true;

    const role = (userStore.user as any)?.role;
    if (role === "admin" || role === "super_admin") {
      return true;
    }

    return permissions.some((p) => can(p));
  };

  /**
   * Check if user has ALL of the provided permissions (AND logic)
   * @param permissions - Array of permission strings
   * @returns true if user has all permissions
   */
  const canAll = (permissions: string[]): boolean => {
    if (!permissions || permissions.length === 0) return true;

    const role = (userStore.user as any)?.role;
    if (role === "admin" || role === "super_admin") {
      return true;
    }

    return permissions.every((p) => can(p));
  };

  /**
   * Check if user has a specific role or any of the roles
   * @param role - Single role string or array of roles
   * @returns true if user has the role
   */
  const hasRole = (role: string | string[]): boolean => {
    const userRole = (userStore.user as any)?.role;
    if (!userRole) return false;

    if (Array.isArray(role)) {
      return role.includes(userRole);
    }

    return userRole === role;
  };

  /**
   * Get all user permissions
   * @returns Array of permission strings
   */
  const getAllPermissions = (): string[] => {
    return userStore.userPermissions || [];
  };

  /**
   * Check if user is admin or super admin
   * @returns true if user is admin or super_admin
   */
  const isAdmin = (): boolean => {
    return hasRole(["admin", "super_admin"]);
  };

  return {
    can,
    canAny,
    canAll,
    hasRole,
    getAllPermissions,
    isAdmin,
  };
};
