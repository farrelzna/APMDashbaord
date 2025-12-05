export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.directive('can', {
        mounted(el, binding) {
            const userStore = useUserStore();
            const permission = binding.value;
            
            // If no permission required, show element
            if (!permission) {
                return;
            }
            
            // Check if user has permission
            const hasPermission = userStore.user?.permissions?.includes(permission) || 
                                userStore.user?.role === 'admin' || 
                                userStore.user?.role === 'super_admin';
            
            // Hide element if no permission
            if (!hasPermission) {
                el.style.display = 'none';
                // Or completely remove from DOM:
                // el.parentNode?.removeChild(el);
            }
        },
        updated(el, binding) {
            const userStore = useUserStore();
            const permission = binding.value;
            
            if (!permission) {
                el.style.display = '';
                return;
            }
            
            const hasPermission = userStore.user?.permissions?.includes(permission) || 
                                userStore.user?.role === 'admin' || 
                                userStore.user?.role === 'super_admin';
            
            el.style.display = hasPermission ? '' : 'none';
        }
    });
});
