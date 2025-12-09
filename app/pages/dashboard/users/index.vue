<template>
  <div>
    <UserTable />
  </div>
</template>

<script setup>
import { pagePermission } from "@/utils/permissions";
import UserTable from "@/components/dashboards/User/Table.vue";

definePageMeta({
  middleware: ["auth", "permission"],
  permission: pagePermission.users.view,
});
</script>
