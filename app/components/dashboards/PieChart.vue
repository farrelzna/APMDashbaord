<script setup>
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "vue-chartjs";

ChartJS.register(ArcElement, Tooltip, Legend);

const props = defineProps({
  data: Object,
  options: Object,
});
</script>

<template>
  <Pie :data="props.data" :options="props.options" />
</template>
