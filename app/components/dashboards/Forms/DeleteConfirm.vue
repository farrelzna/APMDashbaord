<template>
    <v-dialog
        :model-value="showModal"
        @update:model-value="updateModalValue"
        max-width="500px"
    >
        <v-card>
            <v-toolbar dark dense flat>
                <v-toolbar-title class="font-weight-bold text-red-500">
                    Are you sure?
                </v-toolbar-title>
            </v-toolbar>
            <v-card-text class="font-thin">
                This action <strong>CANNOT</strong> be undone. Please be
                absolutely certain you want to proceed before confirming.
            </v-card-text>
            <v-card-actions class="pt-3">
                <v-spacer></v-spacer>
                <v-btn
                    color="grey"
                    text
                    class="body-2 font-weight-bold"
                    @click="closeAction"
                    >Cancel</v-btn
                >
                <v-btn
                    color="error"
                    class="body-2 font-weight-bold"
                    variant="outlined"
                    @click="deleteAction"
                    >Confirm</v-btn
                >
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script setup>

const props = defineProps({
    showModal: Boolean,
    closeAction: Function,
    deleteAction: Function,
});

const emit = defineEmits(['update:showModal']);

const updateModalValue = value => {
    emit('update:showModal', value);
};
</script>
