<template>
  <div class="flex w-full h-auto px-5 p-3 rounded-xs items-center gap-5">
    <div class="profile flex gap-2 justify-center items-center w-1/2">
      <UAvatar
        size="lg"
        src="https://avatars.githubusercontent.com/u/739984?v=4"
        alt="Avatar"
        class="outline outline-black"
      />
      <div class="info">
        <h1 class="leading-5 font-bold">{{ props.name }}</h1>
        <span class="font-light text-sm">{{ props.job }}</span>
      </div>
    </div>
    <div class="w-full flex justify-center items-center gap-5">
      <UProgress :value="props.workload" animation="carousel" />
      <span>{{ props.workload }}%</span>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  name: String,
  job: String,
  workload: Number,
});
</script>
