<template>
    <div 
        class="relative flex items-center gap-3 px-4 py-3 border-b border-gray-200 cursor-pointer transition-colors duration-150 group"
        :class="isSelected ? 'bg-orange-50' : 'hover:bg-gray-50'"
        @click="$emit('select')"
    >
        <!-- Active Indicator (Orange vertical bar) -->
        <div 
            v-if="isSelected"
            class="absolute left-0 top-0 bottom-0 w-1 bg-[#FF5F00] rounded-r-xl"
        ></div>
        <!-- Checkbox (optional) -->
        <v-checkbox
            v-if="showCheckbox"
            :model-value="checked"
            @update:model-value="$emit('update:checked', $event)"
            hide-details
            density="compact"
            class="flex-shrink-0"
            @click.stop
        />

        <!-- Avatar/Logo (optional) -->
        <div v-if="showAvatar" class="flex-shrink-0">
            <v-avatar :size="avatarSize" rounded="lg" class="border border-gray-200">
                <img 
                    v-if="avatarSrc" 
                    :src="avatarSrc" 
                    :alt="title"
                    class="object-contain"
                />
                <div v-else class="text-gray-400 font-semibold text-sm bg-gray-100 w-full h-full flex items-center justify-center">
                    {{ avatarFallback }}
                </div>
            </v-avatar>
        </div>

        <!-- Main Content -->
        <div class="flex-1 min-w-0">
            <slot name="content">
                <!-- Default content - can be overridden -->
                <div class="font-semibold text-sm truncate" style="color: #000;">{{ title }}</div>
                <div v-if="subtitle" class="text-xs text-gray-500 truncate">{{ subtitle }}</div>
            </slot>
        </div>

        <!-- Action Buttons (Hidden, show on hover) -->
        <div v-if="actions.length > 0" class="action-buttons">
            <v-btn
                v-for="action in actions"
                :key="action.id"
                :icon="action.icon"
                variant="text"
                size="small"
                :color="action.color"
                @click.stop="$emit('action', action.id)"
                class="item-action-btn"
            />
        </div>

        <!-- Extra Button (Always visible) -->
        <slot name="extra-button">
            <!-- Optional extra button slot -->
        </slot>
    </div>
</template>

<script setup>
const props = defineProps({
    title: {
        type: String,
        required: true,
    },
    subtitle: {
        type: String,
        default: '',
    },
    isSelected: {
        type: Boolean,
        default: false,
    },
    showCheckbox: {
        type: Boolean,
        default: true,
    },
    checked: {
        type: Boolean,
        default: false,
    },
    showAvatar: {
        type: Boolean,
        default: true,
    },
    avatarSrc: {
        type: String,
        default: '',
    },
    avatarSize: {
        type: Number,
        default: 40,
    },
    avatarFallback: {
        type: String,
        default: '?',
    },
    actions: {
        type: Array,
        default: () => [
            { id: 'view', icon: 'mdi-eye-outline' },
            { id: 'edit', icon: 'mdi-square-edit-outline' },
            { id: 'delete', icon: 'mdi-trash-can-outline'},
        ],
    },
    selectedColor: {
        type: String,
        default: '#FF5F00',
    },
});

defineEmits(['select', 'update:checked', 'action']);
</script>

<style scoped>
/* Action buttons animation - can't be done with Tailwind */
.action-buttons {
    display: flex;
    gap: 4px;
    opacity: 0;
    transform: translateX(-4px);
    transition: opacity 0.15s ease, transform 0.15s ease;
}

.group:hover .action-buttons,
.group:focus-within .action-buttons {
    opacity: 1;
    transform: translateX(0);
}

/* Show actions when selected */
.bg-orange-50 .action-buttons {
    opacity: 1;
    transform: translateX(0);
}
</style>
