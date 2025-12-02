<script setup>
definePageMeta({ middleware: ['auth'] });
</script>
<template>
  <v-row>
    <v-col cols="12" sm="12" lg="12">
      <DashboardsClientTable status="internal" />
    </v-col>
  </v-row>
</template>