<script setup>
import { pagePermission } from "@/utils/permissions";

definePageMeta({
  middleware: ["auth", "permission"],
  permission: pagePermission.project.view,
});
</script>
<template>
  <v-row>
    <v-col cols="12" sm="12" lg="12">
      <DashboardsProjectTable />
    </v-col>
  </v-row>
</template>
