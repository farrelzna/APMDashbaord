<script setup lang="ts">
const props = defineProps({
    title: String,
    imageUrl: String,
});
</script>

// ===============================|| Ui Parent
Card||=============================== //
<template>
    <v-card elevation="10">
        <v-card-item class="py-4 px-6">
            <div class="d-sm-flex align-center items-center">
                <v-card-title class="text-h5 font-weight-semibold">{{
                    title
                    }}</v-card-title>
                <!-- <template v-slot:append> -->
                <slot name="action"></slot>
                <!-- </template> -->
            </div>
        </v-card-item>
        <v-divider></v-divider>
        <v-card-text>
            <slot />
        </v-card-text>
    </v-card>
</template>
