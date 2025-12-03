<script setup>
import UiProjectCard from '@/components/shared/UiProjectCard.vue';
import AvatarGroup from '@/components/ui-components/avatar/AvatarGroup.vue';
import { colorByStatus } from '@/utils/colorByStatus';

const config = useRuntimeConfig();

const props = defineProps({
    modelValue: Boolean,
    loading: Boolean,
    project: Object,
});

const emit = defineEmits(['update:modelValue', 'close']);

const isClosing = ref(false);

const closeDialog = () => {
    isClosing.value = true;
    setTimeout(() => {
        emit('update:modelValue', false);
        emit('close');
        setTimeout(() => {
            isClosing.value = false;
        }, 50);
    }, 250);
};

// Handle outside click - prevent double animation
const handleOutsideClick = (value) => {
    if (!value && !isClosing.value) {
        closeDialog();
    }
};
</script>

<template>
    <v-dialog
        :model-value="modelValue"
        @update:model-value="handleOutsideClick"
        max-width="900"
        location="right"
        scrim="false"
        scrollable
        transition="none"
        class="dialog-right-fixed"
        :class="{ 'dialog-closing': isClosing }"
    >
            <v-card class="overflow-hidden h-screen position-relative" elevation="0" rounded="0">
                <v-progress-linear v-if="loading" indeterminate color="primary" height="3" />
                
                <!-- Close Button - Absolute Position -->
                <v-btn 
                    icon="mdi-close" 
                    variant="elevated" 
                    size="small" 
                    color="white"
                    class="position-absolute"
                    style="right: 10px; top: 10px; z-index: 10; box-shadow: none;"
                    @click="closeDialog"
                ></v-btn>

                <v-card-text class="pa-8 overflow-y-auto h-full" v-if="project">
                <!-- Header with Logo -->
                <UiProjectCard :projectData="project" :color="colorByStatus(project.status)">
                    <!-- PM, Team, Status Badge Row -->
                    <div class="d-flex align-center justify-space-between mb-4">
                        <div class="d-flex align-center ga-8 flex-wrap">
                            <div class="d-flex align-center ga-2">
                                <span class="text-caption text-grey-darken-1">PM:</span>
                                <v-avatar
                                    v-if="project.pm_str"
                                    size="32"
                                    :image="config.public.apiMedia + project.pm_str.photo"
                                    style="border: 1px solid #f4f4f4;"
                                    loading="lazy"
                                ></v-avatar>
                                <span v-else class="text-caption">-</span>
                            </div>
                            <div class="d-flex align-center ga-2">
                                <span class="text-caption text-grey-darken-1">Team:</span>
                                <AvatarGroup
                                    :users="project.engineer"
                                    :pm="project.pm_str"
                                />
                            </div>
                        </div>
                        <v-chip
                            :color="colorByStatus(project.status)"
                            :variant="['in progress','complete'].includes(project.status.toLowerCase()) ? 'tonal' : 'flat'"
                            size="small"
                            label
                            class="text-caption font-weight-medium"
                        >
                            {{ project.status }}
                        </v-chip>
                    </div>

                    <v-divider class="mb-4"></v-divider>

                    <!-- Finance Section -->
                    <div class="mb-4">
                        <div class="text-caption font-weight-medium text-grey-darken-2 mb-3">Finance:</div>
                        <div class="d-flex flex-column ga-3">
                            <div
                                v-for="finance in (project.finance || project.finances || [])"
                                :key="finance.id || finance.name"
                                class="d-flex align-center ga-3"
                            >
                                <div style="width: 6px; height: 48px; background-color: #FF5F00; border-radius: 2px; flex-shrink: 0;"></div>
                                <div class="d-flex align-center justify-space-between flex-grow-1">
                                    <div class="d-flex flex-column ga-1">
                                        <div class="text-body-2 font-weight-bold">{{ finance.name }}</div>
                                        <div class="text-caption text-grey-darken-1">{{ finance.status }}</div>
                                    </div>
                                    <div class="text-caption text-grey-darken-1" style="white-space: nowrap; margin-top: 4px;">
                                        Due date {{ finance.date_of_payment }}
                                    </div>
                                </div>
                            </div>
                            <div v-if="!(project.finance || project.finances || []).length" class="text-caption text-grey-darken-1 pl-5">
                                No finance data
                            </div>
                        </div>
                    </div>

                    <v-divider class="mb-4"></v-divider>

                    <!-- Project Status Steps -->
                    <div>
                        <div class="text-caption font-weight-medium text-grey-darken-2 mb-3">Project Status:</div>
                        <div class="d-flex flex-column ga-3">
                            <div
                                v-for="status in (project.project_status || [])"
                                :key="status.id || status.description + status.date_submit"
                                class="d-flex align-center ga-3"
                            >
                                <div style="width: 6px; height: 48px; background-color: #3B82F6; border-radius: 2px; flex-shrink: 0;"></div>
                                <div class="d-flex align-center justify-space-between flex-grow-1">
                                    <div class="text-body-2 font-weight-medium">{{ status.description }}</div>
                                    <v-chip
                                        :color="colorByStatus(status.status)"
                                        :variant="['in progress','complete'].includes(status.status.toLowerCase()) ? 'tonal' : 'flat'"
                                        size="x-small"
                                        label
                                        class="text-caption"
                                    >
                                        {{ status.status }}
                                    </v-chip>
                                </div>
                            </div>
                            <div v-if="!(project.project_status || []).length" class="text-caption text-grey-darken-1 pl-5">
                                No project status data
                            </div>
                        </div>
                    </div>
                </UiProjectCard>

                <v-divider class="my-6"></v-divider>

                <!-- Additional Information -->
                <div class="mt-6">
                    <dashboards-project-informations :project="project" />
                </div>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<style scoped>
.dialog-right-fixed :deep(.v-overlay__content) {
    position: fixed !important;
    right: 0 !important;
    top: 0 !important;
    height: 100vh !important;
    max-height: 100vh !important;
    margin: 20px 0 !important;
}

.dialog-right-fixed :deep(.v-overlay__content > .v-card) {
    height: 100vh !important;
    max-height: 100vh !important;
    border-radius: 18px 0 0 18px !important;
    transform: translateX(0);
    animation: slideInFromRight 0.3s cubic-bezier(0.25, 0.8, 0.25, 1) forwards;
}

/* Opening animation */
@keyframes slideInFromRight {
    0% {
        transform: translateX(100%);
        opacity: 0;
    }
    100% {
        transform: translateX(0);
        opacity: 1;
    }
}

/* Closing animation */
.dialog-closing :deep(.v-overlay__content > .v-card) {
    animation: slideOutToRight 0.25s cubic-bezier(0.4, 0, 0.6, 1) forwards !important;
}

@keyframes slideOutToRight {
    0% {
        transform: translateX(0);
        opacity: 1;
    }
    100% {
        transform: translateX(100%);
        opacity: 0;
    }
}
</style>
