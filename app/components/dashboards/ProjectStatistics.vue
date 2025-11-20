<template>
    <v-card elevation="10" class="withbg pa-3 h-5/6 max-sm:h-full">
        <v-skeleton-loader
            :loading="loading"
            class="pa-3"
            :loading-text="'Loading...'"
        >
            <template v-slot:default>
                <v-card-item>
                    <v-row>
                        <v-col cols="12" md="7" sm="7">
                            <div
                                class="d-sm-flex align-center justify-space-between"
                            >
                                <v-card-title class="text-h5">
                                    Projects Statistic
                                </v-card-title>
                            </div>
                            <div class="mt-2">
                                <v-row>
                                    <v-col cols="6" sm="6">
                                        <div
                                            class="flex flex-col justify-center relative pl-5"
                                        >
                                            <span>Maintenance</span>
                                            <span class="font-bold text-3xl">{{
                                                props.data['Maintenance'] ?? 0
                                            }}</span>
                                            <span
                                                class="absolute -left-0 w-2 bg-bluesea-500 h-[90%] rounded-xl"
                                            ></span>
                                        </div>
                                    </v-col>
                                    <v-col cols="6" sm="6">
                                        <div
                                            class="flex flex-col justify-center relative pl-5"
                                        >
                                            <span>Complete</span>
                                            <span class="font-bold text-3xl">{{
                                                props.data['Complete'] ?? 0
                                            }}</span>
                                            <span
                                                class="absolute -left-0 w-2 bg-emerald-500 h-[90%] rounded-xl"
                                            ></span>
                                        </div>
                                    </v-col>
                                </v-row>
                                <v-row>
                                    <v-col cols="6" sm="6">
                                        <div
                                            class="flex flex-col justify-center relative pl-5"
                                        >
                                            <span>On-going</span>
                                            <span class="font-bold text-3xl">{{
                                                props.data['In Progress'] ?? 0
                                            }}</span>
                                            <span
                                                class="absolute -left-0 w-2 bg-amber-500 h-[90%] rounded-xl"
                                            ></span>
                                        </div>
                                    </v-col>
                                    <v-col cols="6" sm="6">
                                        <div
                                            class="flex flex-col justify-center relative pl-5"
                                        >
                                            <span>Almost Due</span>
                                            <span class="font-bold text-3xl">{{
                                                props.data['Almost Due'] ?? 0
                                            }}</span>
                                            <span
                                                class="absolute -left-0 w-2 bg-rose-500 h-[90%] rounded-xl"
                                            ></span>
                                        </div>
                                    </v-col>
                                </v-row>
                            </div>
                        </v-col>
                        <v-col
                            cols="12"
                            md="5"
                            sm=""
                            class="pl-lg-0 flex justify-center items-center"
                        >
                            <div
                                class="d-flex align-center flex-shrink-0 justify-center items-center flex"
                            >
                                <apexchart
                                    type="pie"
                                    height="150"
                                    :options="chartOptions"
                                    :series="chartSeries"
                                ></apexchart>
                            </div>
                        </v-col>
                    </v-row>
                </v-card-item>
            </template>
        </v-skeleton-loader>
    </v-card>
</template>

<script setup>
import { computed, defineProps, ref, watch } from 'vue';
import { VSkeletonLoader } from 'vuetify/components';

const props = defineProps({
    data: {
        type: Object,
        required: true,
    },
});

const loading = ref(true); // Set to false when data is loaded

const chartSeries = ref([
    props.data['Maintenance'] || 0,
    props.data['Complete'] || 0,
    props.data['In Progress'] || 0,
    props.data['Almost Due'] || 0,
]);

watch(
    () => props.data,
    newData => {
        chartSeries.value = [
            newData['Maintenance'] || 0,
            newData['Complete'] || 0,
            newData['In Progress'] || 0,
            newData['Almost Due'] || 0,
        ];
        loading.value = false; // Set loading to false when data is loaded
    },
    { deep: true, immediate: true }
);

const chartOptions = computed(() => ({
    labels: ['Maintenance', 'Complete', 'On-going', 'Almost Due'],
    chart: {
        height: 170,
        type: 'pie',
        fontFamily: "Plus Jakarta Sans', sans-serif",
        foreColor: '#c6d1e9',
    },
    colors: ['#139AED', '#10B981', '#F59E0B', '#F43F5E'],
    dataLabels: {
        enabled: false,
    },
    legend: {
        show: false,
    },
    stroke: {
        show: false,
    },
    responsive: [
        {
            breakpoint: 991,
            options: {
                chart: {
                    width: 150,
                },
            },
        },
    ],
    plotOptions: {
        pie: {
            donut: {
                size: '80%',
                background: 'none',
                labels: {
                    show: false,
                    name: {
                        show: true,
                        fontSize: '12px',
                        color: undefined,
                        offsetY: 5,
                    },
                    value: {
                        show: false,
                        color: '#98aab4',
                    },
                },
            },
        },
    },
}));

const projectList = ref(null);
</script>
