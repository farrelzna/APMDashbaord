<template>
    <v-dialog 
        v-model="dialogVisible" 
        max-width="600" 
        persistent
        :scrim="true"
    >
        <v-card elevation="0" class="rounded-lg" style="border: 1px solid #e0e0e0;">
            <v-card-text class="pa-6">
                <div class="mb-4">
                    <h3 class="text-h6 font-weight-bold mb-3">Are You sure ?</h3>
                    <p class="text-body-2 text-grey-darken-1 mb-0">
                        Do you really want to logout from your account? 
                        <br />
                        <strong>This action cannot be undone.</strong>
                    </p>
                </div>
            </v-card-text>
            <v-card-actions class="pa-4 pt-0 d-flex ga-3 justify-end">
                <v-btn
                    variant="outlined"
                    color="grey-darken-1"
                    @click="closeDialog"
                    class="text-none px-6 rounded-lg"
                    size="default"
                >
                    Cancel
                </v-btn>
                <v-btn
                    variant="flat"                    
                    @click="confirmLogout"
                    class="text-none px-6 rounded-lg"
                    size="default"
                    style="background: black; color: white;"
                >
                    Logout
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
