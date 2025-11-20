<template>
    <v-dialog v-model="dialogVisible" max-width="500">
        <v-card class="p-5">
            <v-card-title class="leading-3 text-center mt-5">
                Logout Confirmation
            </v-card-title>
            <v-card-text class="text-center">
                Are you sure you want to logout?
            </v-card-text>
            <v-card-actions class="flex justify-center items-center mb-5">
                <v-btn
                    text
                    @click="closeDialog"
                    color="error"
                    variant="outlined"
                >
                    Cancel
                </v-btn>
                <v-btn color="error" variant="flat" @click="confirmLogout">
                    Confirm
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script setup>
const props = defineProps({
    show: Boolean,
})

const dialogVisible = ref(props.show)

watch(
    () => props.show,
    (newVal) => {
        dialogVisible.value = newVal
    }
)

const userStore = useUserStore()

const closeDialog = () => {
    dialogVisible.value = false
}

const confirmLogout = () => {
    userStore.logout()
    closeDialog()
}
</script>
