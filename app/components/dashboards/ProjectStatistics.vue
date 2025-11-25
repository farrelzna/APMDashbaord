<template>
    <v-skeleton-loader
        :loading="loading"
        class="pa-3"
        :loading-text="'Loading...'"
    >
        <template v-slot:default>
            <v-card-item>
                <v-col>
                    <v-raw cols="12" md="7" sm="7">
                        <div class="flex mt-2">
                            <v-col>
                                <v-row cols="6" sm="6" class="mb-5">
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
                                </v-row>
                                <v-row cols="6" sm="6">
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
                                </v-row>
                            </v-col>
                            <v-col>
                                <v-row cols="6" sm="6" class="mb-5">
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
                                </v-row>
                                <v-row cols="6" sm="6">
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
                                </v-row>
                            </v-col>
                        </div>
                    </v-raw>
                    <v-raw
                        cols="12"
                        md="5"
                        sm=""
                        class=" flex justify-center items-center mt-5"
                    >
                        <div
                            class="d-flex align-center flex-shrink-0 justify-center items-center flex"
                        >
                            <apexchart
                                type="area"
                                height="250"
                                :options="chartOptions"
                                :series="chartSeries"
                            ></apexchart>
                        </div>
                    </v-raw>
                </v-col>
            </v-card-item>
        </template>
    </v-skeleton-loader>
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
    {
        name: 'Projects',
        data: [
            props.data['Maintenance'] || 0,
            props.data['Complete'] || 0,
            props.data['In Progress'] || 0,
            props.data['Almost Due'] || 0,
        ]
    }
]);

watch(
    () => props.data,
    newData => {
                chartSeries.value = [{
                    name: 'Projects',
                    data: [
                        newData['Maintenance'] || 0,
                        newData['Complete'] || 0,
                        newData['In Progress'] || 0,
                        newData['Almost Due'] || 0,
                    ]
                }];
        loading.value = false; // Set loading to false when data is loaded
    },
    { deep: true, immediate: true }
);

const chartOptions = computed(() => ({
    chart: {
        height: 170,
        type: 'area',
        fontFamily: "Plus Jakarta Sans', sans-serif",
        toolbar: { show: false },
    },
    xaxis: {
        categories: ['Maintenance', 'Complete', 'On-going', 'Almost Due'],
        labels: { style: { colors: '#6b7280', fontSize: '11px' } },
    },
    yaxis: {
        labels: { style: { colors: '#6b7280', fontSize: '11px' } },
        min: 0,
        forceNiceScale: true,
    },
    stroke: {
        curve: 'smooth',
        width: 2,
        colors: ['#ff7d00']
    },
    fill: {
        type: 'gradient',
        gradient: {
            shade: 'light',
            type: 'vertical',
            shadeIntensity: 0.3,
            gradientToColors: ['#FFA640'],
            inverseColors: false,
            opacityFrom: 0.55,
            opacityTo: 0.05,
            stops: [0, 80, 100]
        }
    },
    markers: {
        size: 6,
        strokeWidth: 2,
        strokeColors: '#ffffff',
        colors: ['#139AED', '#10B981', '#F59E0B', '#F43F5E'],
        hover: { size: 7 }
    },
    dataLabels: {
        enabled: true,
        style: { fontSize: '11px', fontWeight: 600 }
    },
    tooltip: {
        theme: 'light'
    },
    grid: {
        strokeDashArray: 4,
        padding: { left: 10, right: 10 }
    },
}));

const projectList = ref(null);
</script>
