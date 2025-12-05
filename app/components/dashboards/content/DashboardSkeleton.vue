<template>
    <div class="w-full flex flex-col gap-4">
        <!-- Banner Skeleton -->
        <v-card class="pa-8" elevation="0" rounded="xl" color="grey-lighten-3">
            <div class="d-flex align-end justify-space-between">
                <div class="max-w-2xl">
                    <v-skeleton-loader type="chip" width="150" class="mb-2"></v-skeleton-loader>
                    <v-skeleton-loader type="heading" width="300" class="mb-3"></v-skeleton-loader>
                    <v-skeleton-loader type="button" width="120"></v-skeleton-loader>
                </div>
            </div>
        </v-card>

        <v-row class="gy-4" style="margin:0 !important">
            <!-- Left Column Skeleton -->
            <v-col cols="12" md="7" class="flex flex-col gap-4">
                <!-- Important Project Skeleton -->
                <v-card class="pa-4" elevation="0" rounded="lg" style="border: 1px solid #F4F4F4;">
                    <div class="d-flex align-center justify-space-between">
                        <div class="d-flex align-center ga-4">
                            <v-skeleton-loader type="avatar" width="56" height="56"></v-skeleton-loader>
                            <div>
                                <v-skeleton-loader type="text" width="120" class="mb-1"></v-skeleton-loader>
                                <v-skeleton-loader type="heading" width="200" class="mb-1"></v-skeleton-loader>
                                <v-skeleton-loader type="text" width="150"></v-skeleton-loader>
                            </div>
                        </div>
                        <div class="d-flex flex-column align-end ga-2">
                            <v-skeleton-loader type="text" width="100"></v-skeleton-loader>
                            <v-skeleton-loader type="chip" width="80"></v-skeleton-loader>
                        </div>
                    </div>
                </v-card>

                <!-- Analytics & Summary Grid Skeleton -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <!-- Chart Skeleton -->
                    <v-card class="pa-4" elevation="0" rounded="lg" style="border: 1px solid #F4F4F4;">
                        <v-skeleton-loader type="heading" width="150" class="mb-4"></v-skeleton-loader>
                        <v-skeleton-loader type="image" height="140"></v-skeleton-loader>
                        <div class="grid grid-cols-3 gap-4 mt-4">
                            <div v-for="i in 3" :key="i">
                                <v-skeleton-loader type="text" width="60" class="mb-1"></v-skeleton-loader>
                                <v-skeleton-loader type="heading" width="40"></v-skeleton-loader>
                            </div>
                        </div>
                    </v-card>

                    <!-- Summary Cards Skeleton -->
                    <div class="flex flex-col gap-4">
                        <v-card class="pa-5 flex-1" elevation="0" rounded="lg" style="border: 1px solid #F4F4F4;">
                            <v-skeleton-loader type="heading" width="80" class="mb-4"></v-skeleton-loader>
                            <div class="d-flex ga-8 mb-4">
                                <div v-for="i in 2" :key="i">
                                    <v-skeleton-loader type="text" width="80" class="mb-1"></v-skeleton-loader>
                                    <v-skeleton-loader type="heading" width="40"></v-skeleton-loader>
                                </div>
                            </div>
                            <v-divider class="my-4"></v-divider>
                            <div class="d-flex justify-space-between">
                                <div v-for="i in 3" :key="i">
                                    <v-skeleton-loader type="text" width="70" class="mb-1"></v-skeleton-loader>
                                    <v-skeleton-loader type="heading" width="30"></v-skeleton-loader>
                                </div>
                            </div>
                        </v-card>

                        <v-card class="pa-4 flex-1" elevation="0" rounded="lg" style="border: 1px solid #F4F4F4;">
                            <v-skeleton-loader type="heading" width="150" class="mb-4"></v-skeleton-loader>
                            <div class="d-flex justify-space-between align-center">
                                <div class="d-flex align-center ga-3">
                                    <v-skeleton-loader type="avatar" size="30"></v-skeleton-loader>
                                    <div>
                                        <v-skeleton-loader type="text" width="100" class="mb-1"></v-skeleton-loader>
                                        <v-skeleton-loader type="text" width="80"></v-skeleton-loader>
                                    </div>
                                </div>
                                <div>
                                    <v-skeleton-loader type="text" width="80" class="mb-1"></v-skeleton-loader>
                                    <v-skeleton-loader type="text" width="60"></v-skeleton-loader>
                                </div>
                            </div>
                        </v-card>
                    </div>
                </div>

                <!-- Engineer Workload Skeleton -->
                <v-card class="pa-0" elevation="0" rounded="lg" style="border: 1px solid #F4F4F4;">
                    <div class="pa-4">
                        <v-skeleton-loader type="heading" width="180"></v-skeleton-loader>
                    </div>
                    <v-divider></v-divider>
                    <div class="pa-4">
                        <div v-for="i in 4" :key="i" class="mb-4">
                            <div class="d-flex align-center justify-space-between mb-2">
                                <div class="d-flex align-center ga-3">
                                    <v-skeleton-loader type="avatar" size="48"></v-skeleton-loader>
                                    <div>
                                        <v-skeleton-loader type="text" width="120" class="mb-1"></v-skeleton-loader>
                                        <v-skeleton-loader type="text" width="100"></v-skeleton-loader>
                                    </div>
                                </div>
                                <div class="d-flex flex-column align-end ga-1">
                                    <v-skeleton-loader type="chip" width="50"></v-skeleton-loader>
                                    <v-skeleton-loader type="text" width="80"></v-skeleton-loader>
                                </div>
                            </div>
                            <v-skeleton-loader type="image" height="4"></v-skeleton-loader>
                        </div>
                    </div>
                </v-card>
            </v-col>

            <!-- Right Column: Project List Skeleton -->
            <v-col cols="12" md="5" class="d-flex flex-column md:pr-0">
                <v-card class="pa-0" elevation="0" rounded="lg" style="border: 1px solid #F4F4F4;">
                    <div class="pa-4 d-flex align-center justify-space-between">
                        <v-skeleton-loader type="heading" width="120"></v-skeleton-loader>
                        <v-skeleton-loader type="button" width="120"></v-skeleton-loader>
                    </div>
                    <v-divider></v-divider>
                    
                    <div style="max-height: calc(100vh - 174px); overflow-y: auto;">
                        <div v-for="i in 3" :key="i" class="pa-4" style="border-bottom: 1px solid #f5f5f5;">
                            <!-- Project Header -->
                            <div class="mb-3">
                                <v-skeleton-loader type="heading" width="200" class="mb-2"></v-skeleton-loader>
                                <v-skeleton-loader type="text" width="150" class="mb-2"></v-skeleton-loader>
                                <div class="d-flex align-center ga-2 mb-2">
                                    <v-skeleton-loader type="avatar" size="24"></v-skeleton-loader>
                                    <v-skeleton-loader type="avatar" size="24"></v-skeleton-loader>
                                    <v-skeleton-loader type="text" width="40"></v-skeleton-loader>
                                </div>
                            </div>

                            <!-- PM & Team -->
                            <div class="d-flex align-center justify-space-between mb-3">
                                <div class="d-flex align-center ga-4">
                                    <v-skeleton-loader type="text" width="30"></v-skeleton-loader>
                                    <v-skeleton-loader type="avatar" size="32"></v-skeleton-loader>
                                    <v-skeleton-loader type="text" width="40"></v-skeleton-loader>
                                    <v-skeleton-loader type="avatar" size="32"></v-skeleton-loader>
                                    <v-skeleton-loader type="avatar" size="32"></v-skeleton-loader>
                                </div>
                                <v-skeleton-loader type="chip" width="80"></v-skeleton-loader>
                            </div>

                            <!-- Finance Section -->
                            <div class="mb-4">
                                <v-skeleton-loader type="text" width="60" class="mb-3"></v-skeleton-loader>
                                <div v-for="j in 2" :key="j" class="d-flex align-center ga-3 mb-3">
                                    <div style="width: 4px; height: 48px; background-color: #e0e0e0; border-radius: 2px;"></div>
                                    <div class="flex-grow-1">
                                        <v-skeleton-loader type="text" width="150" class="mb-1"></v-skeleton-loader>
                                        <v-skeleton-loader type="text" width="100"></v-skeleton-loader>
                                    </div>
                                </div>
                            </div>

                            <!-- Project Status -->
                            <div>
                                <v-skeleton-loader type="text" width="100" class="mb-3"></v-skeleton-loader>
                                <div v-for="j in 2" :key="j" class="d-flex align-center ga-3 mb-3">
                                    <div style="width: 4px; height: 48px; background-color: #e0e0e0; border-radius: 2px;"></div>
                                    <div class="d-flex align-center justify-space-between flex-grow-1">
                                        <v-skeleton-loader type="text" width="120"></v-skeleton-loader>
                                        <v-skeleton-loader type="chip" width="70"></v-skeleton-loader>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </v-card>
            </v-col>
        </v-row>
    </div>
</template>

<script setup>
// No props or logic needed - just a presentational component
</script>
