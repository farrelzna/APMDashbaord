<script setup lang="ts">

const props = defineProps({
    projectData: Object,
    color: String,
});

const config = useRuntimeConfig();
const isHovered = ref(false);
</script>

<template>
    <v-card-item class="py-4 px-6">
        <div class="flex items-start justify-between w-full">
            <div class="flex items-center gap-4 min-w-0">
                <v-avatar size="50" color="grey-lighten-2" rounded="lg">
                    <template v-if="props.projectData?.customer_str?.logo">
                        <v-img :src="config.public.apiMedia + props.projectData.customer_str.logo" cover />
                    </template>
                    <template v-else>
                        <span class="text-grey-darken-1 font-medium text-lg">{{ (projectData?.name || '?').charAt(0) }}</span>
                    </template>
                </v-avatar>
                <div class="flex flex-col truncate">
                    <div class="font-bold text-lg leading-5 truncate">{{ projectData?.name }}</div>
                    <span class="text-xs uppercase tracking-wide truncate">{{ projectData?.customer_str?.name }}</span>
                </div>
            </div>
            <div class="flex items-start gap-3">
                <span class="text-sm whitespace-nowrap mt-1">Due date {{ props.projectData?.end_date }}</span>
                <slot name="action"></slot>
            </div>
        </div>
    </v-card-item>
    <v-card-text>
        <slot />
    </v-card-text>
    <v-divider></v-divider>
</template>
