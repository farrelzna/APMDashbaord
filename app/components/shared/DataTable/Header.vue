<template>
    <div class="flex items-center justify-between gap-4">
        <!-- Search Bar -->
        <div class="flex-1 max-w-md">
            <v-text-field
                :model-value="search"
                @update:model-value="$emit('update:search', $event)"
                density="compact"
                :placeholder="searchPlaceholder"
                prepend-inner-icon="mdi-magnify"
                variant="outlined"
                hide-details
                single-line
                clearable
                class="search-input"
            ></v-text-field>
        </div>

        <!-- Right Section: Pagination + Action Button -->
        <div class="flex items-center gap-2">
            <!-- Pagination Controls -->
            <div v-if="showPagination" class="flex items-center gap-2">
                <span class="text-xs font-medium text-gray-500">{{ pageStart }}-{{ pageEnd }} of {{ totalItems }}</span>
                <v-btn 
                    icon="mdi-chevron-double-left" 
                    variant="text" 
                    size="x-small" 
                    @click="$emit('go-first')" 
                    :disabled="currentPage === 1"
                    class="pagination-btn"
                />
                <v-btn 
                    icon="mdi-chevron-left" 
                    variant="text" 
                    size="x-small" 
                    @click="$emit('go-prev')" 
                    :disabled="currentPage === 1"
                    class="pagination-btn"
                />
                <v-btn 
                    icon="mdi-chevron-right" 
                    variant="text" 
                    size="x-small" 
                    @click="$emit('go-next')" 
                    :disabled="currentPage * itemsPerPage >= totalItems"
                    class="pagination-btn"
                />
                <v-btn 
                    icon="mdi-chevron-double-right" 
                    variant="text" 
                    size="x-small" 
                    @click="$emit('go-last')" 
                    :disabled="currentPage * itemsPerPage >= totalItems"
                    class="pagination-btn"
                />
            </div>

            <!-- Export Menu -->
            <v-menu v-if="showExport" offset-y>
                <template v-slot:activator="{ props: menuProps }">
                    <v-btn
                        v-bind="menuProps"                        
                        variant="outlined"                          
                        prepend-icon="mdi-download"                        
                        class="action-btn"
                    >
                        Export
                    </v-btn>
                </template>
                <v-list density="compact" class="py-1">
                    <v-list-item @click="$emit('export', 'csv')" class="cursor-pointer">
                        <template v-slot:prepend>
                            <v-icon size="small" color="success">mdi-file-delimited-outline</v-icon>
                        </template>
                        <v-list-item-title class="text-sm">Export as CSV</v-list-item-title>
                    </v-list-item>
                    <v-list-item @click="$emit('export', 'excel')" class="cursor-pointer">
                        <template v-slot:prepend>
                            <v-icon size="small" color="success">mdi-file-excel-outline</v-icon>
                        </template>
                        <v-list-item-title class="text-sm">Export as Excel</v-list-item-title>
                    </v-list-item>
                </v-list>
            </v-menu>

            <!-- Action Button (customizable) -->
            <v-btn
                v-if="showActionButton"
                @click="$emit('action-click')"
                variant="flat"
                class="action-btn"
                :prepend-icon="actionIcon"                
            >
                {{ actionLabel }}
            </v-btn>
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    search: {
        type: String,
        default: '',
    },
    searchPlaceholder: {
        type: String,
        default: 'Search...',
    },
    currentPage: {
        type: Number,
        default: 1,
    },
    itemsPerPage: {
        type: Number,
        default: 10,
    },
    totalItems: {
        type: Number,
        default: 0,
    },
    pageStart: {
        type: Number,
        default: 0,
    },
    pageEnd: {
        type: Number,
        default: 0,
    },
    showPagination: {
        type: Boolean,
        default: true,
    },
    showActionButton: {
        type: Boolean,
        default: true,
    },
    actionLabel: {
        type: String,
        default: 'New Item',
    },
    actionIcon: {
        type: String,
        default: 'mdi-plus',
    },
    showExport: {
        type: Boolean,
        default: false,
    },
});

defineEmits(['update:search', 'go-first', 'go-prev', 'go-next', 'go-last', 'action-click', 'export']);
</script>

<style scoped>
</style>
