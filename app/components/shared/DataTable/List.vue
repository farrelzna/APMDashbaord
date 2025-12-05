<template>
    <div class="flex flex-col h-full bg-white border border-gray-200 rounded-xl overflow-hidden">
        <!-- Header -->
        <div class="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <div class="flex items-center gap-2">
                <h3 class="text-base font-semibold text-gray-700">
                    {{ title }}
                </h3>
                <v-btn
                    icon="mdi-refresh"
                    variant="text"
                    size="x-small"
                    @click="$emit('refresh')"
                    :loading="loading"
                    class="refresh-btn"
                />
            </div>
            <div class="flex items-center gap-3">
                <!-- Sort Menu -->
                <v-menu v-if="showSort" offset-y location="bottom end">
                    <template v-slot:activator="{ props: menuProps }">
                        <v-btn
                            v-bind="menuProps"
                            variant="flat"
                            size="small"                            
                            class="text-primary"
                            style="background-color: rgb(255, 247, 237); border-radius: 5px;"
                        >
                            <v-icon>mdi-sort</v-icon>
                            <v-tooltip activator="parent" location="bottom">Sort by</v-tooltip>
                        </v-btn>
                    </template>
                    <v-list density="compact" class="py-1">
                        <v-list-item 
                            v-for="option in sortOptions" 
                            :key="option.value"
                            @click="$emit('sort', option.value)"
                            :active="currentSort === option.value"
                            class="cursor-pointer"
                        >
                            <v-list-item-title class="text-sm">{{ option.label }}</v-list-item-title>
                        </v-list-item>
                    </v-list>
                </v-menu>
                <span class="text-xs text-gray-500">{{ totalItems }} total</span>
            </div>
        </div>

        <!-- List Items -->
        <div class="flex-1 overflow-y-auto relative">
            <slot name="items" :items="items">
                <!-- Default slot - parent can override with custom items -->
            </slot>

            <!-- Loading State -->
            <div v-if="loading && items.length === 0" class="flex flex-col items-center justify-center min-h-[300px] px-5 py-10">
                <v-progress-circular indeterminate color="primary" />
                <span class="text-sm text-gray-500 mt-2">{{ loadingText }}</span>
            </div>

            <!-- Empty State -->
            <div v-else-if="!loading && items.length === 0" class="flex flex-col items-center justify-center min-h-[300px] px-5 py-10">
                <v-icon size="48" class="text-gray-300">{{ emptyIcon }}</v-icon>
                <div class="text-sm font-medium mt-2 text-black">{{ emptyTitle }}</div>
                <div class="text-xs text-gray-500">{{ emptyMessage }}</div>
                <v-btn
                    v-if="showRefresh"
                    size="small"
                    variant="outlined"
                    color="primary"
                    class="mt-4"
                    @click="$emit('refresh')"
                >
                    Refresh
                </v-btn>
            </div>
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    items: {
        type: Array,
        default: () => [],
    },
    loading: {
        type: Boolean,
        default: false,
    },
    title: {
        type: String,
        required: true,
    },
    totalItems: {
        type: Number,
        default: 0,
    },
    loadingText: {
        type: String,
        default: 'Loading...',
    },
    emptyIcon: {
        type: String,
        default: 'mdi-inbox-outline',
    },
    emptyTitle: {
        type: String,
        default: 'No data found',
    },
    emptyMessage: {
        type: String,
        default: 'Try adjusting your search',
    },
    showRefresh: {
        type: Boolean,
        default: true,
    },
    showSort: {
        type: Boolean,
        default: false,
    },
    sortOptions: {
        type: Array,
        default: () => [
            { label: 'Name (A-Z)', value: 'name-asc' },
            { label: 'Name (Z-A)', value: 'name-desc' },
            { label: 'Newest First', value: 'date-desc' },
            { label: 'Oldest First', value: 'date-asc' },
        ],
    },
    currentSort: {
        type: String,
        default: 'name-asc',
    },
});

defineEmits(['refresh', 'sort']);
</script>

<style scoped>
</style>
