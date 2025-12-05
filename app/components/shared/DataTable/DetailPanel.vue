<template>
    <div class="flex flex-col gap-4 h-full">        
        <div class="flex-shrink-0">
            <slot name="user-card">
                <!-- Optional: fallback if no user card provided -->
            </slot>
        </div>

        <!-- Detail Content -->
        <div class="flex-1 bg-white border border-gray-200 rounded-xl p-6 overflow-y-auto">
            <slot name="content">
                <!-- Empty state when no item selected -->
                <SharedDataTableEmptyState
                    icon="mdi-information-outline"
                    title="No item selected"
                    message="Select an item from the list to view details"
                />
            </slot>
        </div>
    </div>
</template>

<script setup lang="ts"></script>

<style scoped>
/* All styles converted to Tailwind */
</style>
