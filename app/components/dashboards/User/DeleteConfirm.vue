<template>
  <v-dialog :model-value="showModal" @update:modelValue="$emit('update:showModal', $event)" max-width="500px"
    persistent>
    <v-card>
      <v-card-title class="text-h5 d-flex align-center">
        <v-icon color="warning" class="me-2">mdi-alert-circle-outline</v-icon>
        Confirm Deletion
      </v-card-title>
      <v-card-text>Are you sure you want to delete this user? This action cannot be undone.</v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="grey-darken-1" variant="text" @click="closeAction">Cancel</v-btn>
        <v-btn color="error" variant="flat" @click="deleteAction">Delete</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
defineProps({
  showModal: Boolean,
});
const emit = defineEmits(['update:showModal', 'closeAction', 'deleteAction']);

const closeAction = () => {
  emit('closeAction');
  emit('update:showModal', false);
}
const deleteAction = () => {
  emit('deleteAction');
}
</script>