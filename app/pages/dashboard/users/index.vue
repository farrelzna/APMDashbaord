<template>
    <div>
        <UserTable />
    </div>
</template>

<script setup>
import UserTable from '@/components/dashboards/User/Table.vue';
definePageMeta({
    middleware: ['auth']
});
</script>