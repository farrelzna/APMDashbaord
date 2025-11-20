<script setup lang="ts">
import { RouterLink } from 'vue-router'
import logodark from '/images/logos/logo-2.png'
</script>
<template>
    <div class="logo">
        <NuxtLink to="/">
            <img :src="logodark" alt="home" width="150" />
        </NuxtLink>
    </div>
</template>
