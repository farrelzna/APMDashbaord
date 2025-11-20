<script setup lang="ts">
import { ref } from 'vue';
import { computed } from 'vue';
import { useTheme } from 'vuetify';
import { DotsVerticalIcon } from 'vue-tabler-icons';
const items = ref([
    { title: 'Action' },
    { title: 'Another action' },
    { title: 'Something else here' },
]);

const theme = useTheme();
const primary = theme.current.value.colors.primary;
const error = theme.current.value.colors.error;
const chartOptions = computed(() => {
    return {
        series: [
            {
                name: 'Complete',
                data: [9, 5, 3],
            },
            {
                name: 'Not Started Yet',
                data: [12, 4, 1, 2, 3],
            },
        ],
        chartOptions: {
            grid: {
                borderColor: 'rgba(0,0,0,0.1)',
                strokeDashArray: 3,
                xaxis: {
                    lines: {
                        show: false,
                    },
                },
            },
            plotOptions: {
                bar: {
                    horizontal: false,
                    columnWidth: '35%',
                    borderRadius: [8],
                },
            },
            colors: [primary, error],
            chart: {
                fontFamily: 'inherit',
                type: 'bar',
                height: 360,
                offsetY: 10,
                toolbar: {
                    show: false,
                },
            },
            dataLabels: {
                enabled: false,
            },
            stroke: {
                show: true,
                width: 5,
                colors: ['transparent'],
            },
            xaxis: {
                type: 'category',
                categories: ['2021', '2022', '2023', '2024', '2025'],
                axisTicks: {
                    show: false,
                },
                axisBorder: {
                    show: false,
                },
                labels: {
                    style: {
                        colors: '#a1aab2',
                    },
                },
            },
            yaxis: {
                labels: {
                    style: {
                        colors: '#a1aab2',
                    },
                },
            },
            fill: {
                opacity: 1,
                colors: [primary, error],
            },
            tooltip: {
                theme: 'dark',
            },
            legend: {
                show: false,
            },
            responsive: [
                {
                    breakpoint: 767,
                    options: {
                        stroke: {
                            show: false,
                            width: 5,
                            colors: ['transparent'],
                        },
                    },
                },
            ],
        },
    };
});
</script>
<template>
    <v-card class="pa-3" elevation="10">
        <v-card-item>
            <div class="d-flex align-center justify-space-between">
                <div>
                    <h5 class="text-h5 mb-1 font-weight-semibold">
                        Projects per year
                    </h5>
                </div>
            </div>

            <v-row>
                <v-col cols="12" class="pt-7">
                    <apexchart
                        type="bar"
                        height="370px"
                        :options="chartOptions.chartOptions"
                        :series="chartOptions.series"
                    >
                    </apexchart>
                </v-col>
            </v-row>
        </v-card-item>
    </v-card>
</template>
