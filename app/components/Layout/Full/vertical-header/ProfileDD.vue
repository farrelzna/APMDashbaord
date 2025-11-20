<template>
    <v-menu :close-on-content-click="false">
        <template v-slot:activator="{ props }" class="flex">
            <v-btn class="" variant="text" v-bind="props" icon>
                <v-avatar size="35" cover :image="photo" />
            </v-btn>
        </template>
        <v-sheet rounded="xl" width="200" elevation="10" class="mt-2">
            <div class="pt-4 pb-4 px-5 text-center">
                <v-btn
                    color="primary"
                    variant="outlined"
                    class="rounded-pill"
                    block
                    @click="handleLogout"
                    >Logout</v-btn
                >
            </div>
        </v-sheet>
    </v-menu>

    <DialogLogout v-model:show="dialogLogout" />
</template>

<script setup>
import { defineProps, ref } from 'vue';
import DialogLogout from '~/components/auth/DialogLogout.vue';

const props = defineProps({
    photo: String,
});

const dialogLogout = ref(false);

const handleLogout = () => {
    dialogLogout.value = true;
};
</script>
