<template>
    <div class="flex flex-col gap-6">    
        <!-- Logo + Title Section -->
        <div v-if="showLogo" class="flex items-center gap-4 pb-4">
            <div class="logo-wrapper">
                <img 
                    v-if="logoSrc" 
                    :src="logoSrc" 
                    :alt="logoAlt"
                    class="w-full h-full object-cover"
                />
                <div v-else class="flex items-center justify-center w-full h-full">
                    <v-icon size="32" class="text-white">{{ logoPlaceholderIcon }}</v-icon>
                </div>
            </div>
            <div class="flex-1 flex flex-col gap-1">
                <slot name="title">
                    <!-- Default title from first field if available -->
                    <h3 class="text-base font-semibold text-black m-0 leading-tight">{{ fields[0]?.value || 'Client Name' }}</h3>
                    <p class="text-sm text-gray-500 m-0 leading-snug">{{ fields[1]?.value || 'Email' }}</p>
                </slot>
            </div>
        </div>

        <!-- Info Fields -->
        <div class="flex flex-col gap-4">
            <slot name="fields">
                <!-- Default fields - can be overridden -->
                <div v-for="field in fields" :key="field.key" class="flex flex-col gap-1.5">
                    <label class="field-label">{{ field.label }}</label>
                    <div 
                        class="field-value" 
                        :class="{ 'whitespace-pre-line': field.multiline }"
                    >
                        <a 
                            v-if="field.type === 'link' && field.value" 
                            :href="field.value" 
                            target="_blank"
                            class="text-blue-600 hover:underline"
                        >
                            {{ field.value }}
                        </a>
                        <span v-else>{{ field.value || '-' }}</span>
                    </div>
                </div>
            </slot>
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    showLogo: {
        type: Boolean,
        default: false,
    },
    logoSrc: {
        type: String,
        default: '',
    },
    logoAlt: {
        type: String,
        default: 'Logo',
    },
    logoPlaceholderIcon: {
        type: String,
        default: 'mdi-image-outline',
    },
    fields: {
        type: Array,
        default: () => [],
        // Format: [{ key: 'name', label: 'Name', value: 'John', type: 'text', multiline: false }]
    },
});
</script>

<style scoped>
/* Only CSS that can't be done with Tailwind */

.logo-wrapper {
    width: 64px;
    height: 64px;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    overflow: hidden;
    background: #0066FF;
}

.field-label {
    font-size: 12px;
    font-weight: 500;
    color: #8e8e93;
    text-transform: uppercase;
    letter-spacing: 0.05em;
}

.field-value {
    font-size: 14px;
    color: #000;
    padding: 8px 0;
    border-bottom: 1px solid #e5e7eb;
}
</style>
