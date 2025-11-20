<template>
  <v-tooltip text="View Details" location="top">
    <template v-slot:activator="{ props }">
      <v-icon v-bind="props" size="small" class="me-2" @click="$emit('info-item', item)">mdi-eye-outline</v-icon>
    </template>
  </v-tooltip>
  <v-tooltip text="Edit User" location="top">
    <template v-slot:activator="{ props }">
      <v-icon v-bind="props" size="small" class="me-2" @click="$emit('edit-item', item)">mdi-pencil-outline</v-icon>
    </template>
  </v-tooltip>
  <v-tooltip text="Delete User" location="top">
    <template v-slot:activator="{ props }">
      <v-icon v-bind="props" size="small" @click="$emit('delete-item', item)" color="error">mdi-delete-outline</v-icon>
    </template>
  </v-tooltip>
</template>

<script setup>
defineProps({ item: Object });
defineEmits(['edit-item', 'info-item', 'delete-item']);
</script>