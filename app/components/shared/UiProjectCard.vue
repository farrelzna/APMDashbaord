<script setup lang="ts">

const props = defineProps({
    projectData: Object,
    color: String,
});

const config = useRuntimeConfig();
const isHovered = ref(false);
</script>

<template>
    <v-card-item class="pa-4">
        <div class="flex items-start justify-between w-full mb-3">
            <div class="flex items-center gap-3 flex-1 min-w-0">
                <v-avatar size="48" color="grey-lighten-4" rounded="xl" class="border border-gray-100">
                    <template v-if="props.projectData?.customer_str?.logo">
                        <v-img :src="config.public.apiMedia + props.projectData.customer_str.logo" cover />
                    </template>
                    <template v-else>
                        <span class="text-grey-darken-2 font-weight-medium text-h6">{{ (projectData?.name || '?').charAt(0) }}</span>
                    </template>
                </v-avatar>
                <div class="flex flex-col min-w-0 flex-1">
                    <div class="text-h6 font-weight-bold truncate leading-tight">{{ projectData?.name }}</div>
                    <span class="text-caption text-grey-darken-1 uppercase tracking-wider">{{ projectData?.customer_str?.name }}</span>
                </div>
            </div>
            <div class="text-caption text-grey-darken-1 whitespace-nowrap mt-1">
                Due date {{ props.projectData?.end_date }}
            </div>
        </div>
        <slot />
    </v-card-item>
</template>
