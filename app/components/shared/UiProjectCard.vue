<script setup lang="ts">
import { defineProps } from 'vue';

const props = defineProps({
    projectData: Object,
    color: String,
});

const config = useRuntimeConfig();
const isHovered = ref(false);
</script>

<template>
    <v-card elevation="10">
        <v-card-item class="py-2 px-6 overflow-visible">
            <div class="d-sm-flex align-center gap-2">
                <div class="flex items-center gap-2 justify-between w-full">
                    <div class="flex items-center gap-2">
                        <div
                            class="w-20 aspect-square bg-bluesea-500 bg-opacity-25 rounded-xl flex justify-center items-center relative"
                        >
                            <v-avatar
                                v-if="
                                    props.projectData &&
                                    props.projectData.customer_str
                                "
                                size="50"
                                rounded="lg"
                                @mouseover="isHovered = true"
                                @mouseleave="isHovered = false"
                            >
                                <v-img
                                    :src="
                                        config.public.apiMedia +
                                        props.projectData.customer_str.logo
                                    "
                                    cover
                                ></v-img>
                            </v-avatar>
                        </div>
                        <div class="flex flex-col">
                            <v-card-title
                                class="text-h5 font-bold leading-3 truncate"
                                >{{ projectData.name }}</v-card-title
                            >
                            <span class="text-xs truncate text-wrap"
                                >{{ projectData.customer_str.name }}
                                <div class="">
                                    <v-chip
                                        :color="color"
                                        size="small"
                                        variant="flat"
                                        class=""
                                        dir="rtl"
                                    >
                                        <div class="px-1">
                                            {{ props.projectData.status }}
                                        </div>
                                    </v-chip>
                                </div>
                            </span>
                        </div>
                    </div>
                </div>
                <slot name="action"></slot>
            </div>
        </v-card-item>
        <v-divider></v-divider>
        <v-card-text>
            <slot />
        </v-card-text>
    </v-card>
</template>
