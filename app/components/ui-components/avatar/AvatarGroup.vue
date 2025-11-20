<template>
    <div class="flex items-center -space-x-4">
        <div v-for="(user, index) in displayedUsers" :key="index">
            <v-avatar
                v-if="user && user.engineer"
                :image="
                    user.engineer.photo
                        ? apiMedia + user.engineer.photo
                        : apiMedia + '/images/profile/user-1.jpg'
                "
                class="border-black border-2"
            >
            </v-avatar>
            <div v-else class="w-full flex justify-center items-center">
                <span>No Engineers</span>
            </div>
        </div>
        <div
            v-if="remainingUsersCount > 0"
            class="relative w-10 h-10 border-black border-2 bg-gray-200 text-center text-black font-semibold rounded-full flex items-center justify-center"
        >
            +{{ remainingUsersCount }}
        </div>
    </div>
</template>

<script setup>
import { computed, defineProps, onMounted, ref } from 'vue';
const config = useRuntimeConfig();
const apiMedia = config.public.apiMedia;

const props = defineProps({
    users: {
        type: Array,
        required: true,
    },
    pm: Object,
});

const isMobile = ref(window.innerWidth <= 640); // 640px corresponds to typical mobile breakpoints

const updateIsMobile = () => {
    isMobile.value = window.innerWidth <= 640;
};

onMounted(() => {
    window.addEventListener('resize', updateIsMobile);
    updateIsMobile();
});

const displayedUsers = computed(() => {
    const maxUsers = isMobile.value ? 2 : 5;
    return props.users.slice(0, maxUsers);
});

const remainingUsersCount = computed(() => {
    const maxUsers = isMobile.value ? 2 : 5;
    return Math.max(props.users.length - maxUsers, 0);
});
</script>
