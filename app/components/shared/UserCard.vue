<template>
    <div class="relative rounded-xl p-5 text-white overflow-hidden" :style="{ background: backgroundColor }">
        <!-- Background Banner Image -->
        <img 
            src="/images/backgrounds/banner.png" 
            alt="Banner Background" 
            class="absolute right-0 top-1/2 -translate-y-1/2 h-full w-auto z-0"
        />
        
        <div class="flex items-center gap-3 relative z-10">
            <v-avatar :size="avatarSize" class="flex-shrink-0">
                <img 
                    :src="user?.photo || defaultAvatar" 
                    :alt="user?.full_name || 'User'"
                    class="object-cover"
                />
            </v-avatar>
            
            <div class="flex-1 min-w-0">
                <div class="font-semibold text-sm text-white leading-tight mb-1">
                    {{ user?.full_name || 'User' }}
                </div>
                <div class="text-xs text-white/80">
                    {{ user?.role || 'Role' }}
                </div>
            </div>

            <v-menu 
                v-if="showChevron"
                :close-on-content-click="false" 
                location="bottom end" 
                offset="8"
            >
                <template v-slot:activator="{ props: menuProps }">
                    <v-btn
                        icon="mdi-chevron-right"
                        variant="text"
                        size="small"
                        class="text-white flex-shrink-0"
                        v-bind="menuProps"
                    />
                </template>
                
                <div class="rounded-lg" style="min-width: 220px; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1); background: #141414;">
                    <button 
                        @click="handleLogout" 
                        class="w-100 d-flex align-center ga-3 pa-3 rounded-lg text-left"
                        style="background: rgba(239, 68, 68, 0.05); border: 1px solid rgba(239, 68, 68, 0.2); cursor: pointer; transition: all 0.2s;"
                        @mouseenter="$event.target.style.background = 'rgba(239, 68, 68, 0.1)'"
                        @mouseleave="$event.target.style.background = 'rgba(239, 68, 68, 0.05)'"
                    >
                        <v-icon icon="mdi-logout-variant" color="error" size="20" />
                        <div class="d-flex flex-column flex-1">
                            <span class="text-body-2 font-weight-medium text-error">Logout Account</span>
                            <span class="text-caption text-white" style="opacity: 0.7;">Sign out from dashboard</span>
                        </div>
                    </button>
                </div>
            </v-menu>
        </div>

        <div v-if="companyName" class="mt-3 text-[11px] opacity-90 font-medium tracking-wide relative z-10">
            {{ companyName }}
        </div>

        <slot name="extra">
            <!-- Optional extra content slot -->
        </slot>
    </div>
    
    <AuthDialogLogout v-model:show="dialogLogout" />
</template>

<script setup>
const props = defineProps({
    user: {
        type: Object,
        default: () => ({}),
    },
    backgroundColor: {
        type: String,
        default: '#FF5F00',
    },
    avatarSize: {
        type: Number,
        default: 56,
    },
    defaultAvatar: {
        type: String,
        default: '/images/profile/user.png',
    },
    showChevron: {
        type: Boolean,
        default: true,
    },
    companyName: {
        type: String,
        default: 'Dasa Aprindo Sentosa',
    },
});

defineEmits(['click']);

const dialogLogout = ref(false);

const handleLogout = () => {
    dialogLogout.value = true;
};
</script>

<style scoped>
/* All styles converted to Tailwind */
</style>
