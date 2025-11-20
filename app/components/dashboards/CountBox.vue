<script setup>
const props = defineProps({
  title: String,
  value: Number,
  icon: String,
  background: String,
  color: String,
});

const bg = "bg-" + props.background + "-400";
const color = "text-" + props.color;
</script>

<template>
  <div
    class="box p-5 text-center rounded-md shadow-md place-content-center border"
    :class="bg + ' ' + color"
  >
    <div class="block text-xl font-bold">{{ props.title }}</div>
    <div class="flex justify-center items-center w-full gap-2">
      <UIcon :name="props.icon" class="text-4xl" />
      <span class="text-4xl">{{ props.value }}</span>
    </div>
  </div>
</template>
