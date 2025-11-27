<script setup lang="ts">
import { ref } from 'vue';
import LayoutMain from '@/components/Layout/Main.vue';
const title = ref('APM Median');

useHead({
    meta: [{ content: title }],
    titleTemplate: titleChunk => `${titleChunk} - Dashboard`
});
</script>

<template>
    <v-locale-provider>
        <v-app>
            <!-- Sidebar & Topbar -->
            <LayoutMain />
            <!-- Main content area -->
            <v-main class="bg-white min-h-screen rounded-tl-3xl">
                <v-container fluid class="page-wrapper px-sm-5 px-4 pt-6">
                    <div>
                        <NuxtPage />
                    </div>
                </v-container>
            </v-main>
        </v-app>
    </v-locale-provider>
</template>
