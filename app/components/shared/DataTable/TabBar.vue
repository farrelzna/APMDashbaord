<template>
    <div class="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
        <button
            v-for="tab in tabs"
            :key="tab.value"
            @click="$emit('update:modelValue', tab.value)"
            :class="[
                'px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap',
                modelValue === tab.value
                    ? 'bg-gray-900 text-white shadow-sm'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            ]"
        >
            {{ tab.label }}
            <span v-if="tab.count !== undefined" :class="[
                'ml-2 px-2 py-0.5 rounded-full text-xs',
                modelValue === tab.value ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-600'
            ]">
                {{ tab.count }}
            </span>
        </button>
    </div>
</template>

<script setup>
defineProps({
    tabs: {
        type: Array,
        required: true,
        // Example: [{ label: 'All', value: 'all', count: 10 }]
    },
    modelValue: {
        type: String,
        required: true
    }
});

defineEmits(['update:modelValue']);
</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
    display: none;
}
.scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
}
</style>
