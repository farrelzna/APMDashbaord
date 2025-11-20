<script setup lang="ts">
import { RouterLink } from "vue-router";
import logolightrtl from "/images/logos/logo-2.png";
</script>
<template>
  <div class="logo">
    <NuxtLink to="/">
      <img :src="logolightrtl" alt="home" />
    </NuxtLink>
  </div>
</template>
