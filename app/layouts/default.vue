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
            <v-main>
                <v-container fluid class="page-wrapper px-sm-5 px-4 pt-6 bg-white rounded-xl">
                    <div class="maxWidth">
                        <NuxtPage />
                    </div>
                </v-container>
            </v-main>
        </v-app>
    </v-locale-provider>
</template>
