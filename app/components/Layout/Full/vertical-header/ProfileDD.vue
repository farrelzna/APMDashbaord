<template>
    <v-menu :close-on-content-click="false" location="top" offset="8">
        <template v-slot:activator="{ props }">
            <slot name="activator" :props="props">
                <v-btn class="" variant="text" v-bind="props" icon>
                    <v-avatar size="35" cover :image="photo" />
                </v-btn>
            </slot>
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

    <DialogLogout v-model:show="dialogLogout" />
</template>

<script setup>
import { ref } from 'vue';
import DialogLogout from '~/components/auth/DialogLogout.vue';
import { useUserStore } from '@/stores/User';

const props = defineProps({
    photo: String,
});

const userStore = useUserStore();
const dialogLogout = ref(false);

const handleLogout = () => {
    dialogLogout.value = true;
};
</script>
