<script setup>
import { ref } from 'vue';

const username = ref('');
const password = ref('');
const showPassword = ref(false);

const userStore = useUserStore();

const handleLogin = async () => {
    const success = await userStore.login(username.value, password.value);
    if (success) {
        navigateTo('/');
    }
};

const handleKeyPress = async event => {
    if (event.key === 'Enter') {
        await handleLogin();
    }
};

const toggleShowPassword = () => {
    showPassword.value = !showPassword.value;
};
</script>

<template>
    <div>
        <div class="d-flex align-center text-center mb-6">
            <div class="text-h6 w-100 px-5 font-weight-regular auth-divider position-relative">
                <hr />
            </div>
        </div>
        <div>
            <v-row class="mb-3">
                <v-col cols="12">
                    <v-label class="font-weight-medium mb-1">Username</v-label>
                    <v-text-field v-model="username" @keydown="handleKeyPress" variant="outlined" class="pwdInput"
                        hide-details color="primary" placeholder="Username"></v-text-field>
                </v-col>
                <v-col cols="12">
                    <v-label class="font-weight-medium mb-1">Password</v-label>
                    <v-text-field v-model="password" @keydown="handleKeyPress" variant="outlined"
                        class="border-borderColor" :type="showPassword ? 'text' : 'password'" hide-details
                        color="primary" placeholder="Password"
                        :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                        @click:append-inner="toggleShowPassword"></v-text-field>
                </v-col>
                <v-col cols="12">
                    <v-btn size="large" rounded="pill" color="primary" class="rounded-pill" block type="submit" flat
                        @click="handleLogin">
                        Login
                    </v-btn>
                </v-col>
            </v-row>
        </div>
    </div>
</template>
