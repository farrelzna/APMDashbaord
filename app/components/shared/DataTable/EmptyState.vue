<template>
    <div class="flex flex-col items-center justify-center min-h-[300px] px-5 py-10 text-center">
        <v-icon :size="iconSize" class="text-gray-300">{{ icon }}</v-icon>
        <div class="text-sm font-medium mt-3 text-black">{{ title }}</div>
        <div class="text-xs text-gray-500 mt-1">{{ message }}</div>
        
        <slot name="action">
            <!-- Optional action button slot -->
        </slot>
    </div>
</template>

<script setup>
const props = defineProps({
    icon: {
        type: String,
        default: 'mdi-inbox-outline',
    },
    iconSize: {
        type: Number,
        default: 64,
    },
    title: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        default: '',
    },
});
</script>

<style scoped>
/* No custom CSS needed - all done with Tailwind! */
</style>
