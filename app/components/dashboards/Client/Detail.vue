<template>
    <v-container>
        <v-row>
            <v-col cols="12">
                <div class="w-full h-full flex flex-col justify-center items-center gap-5">
                    <img :src="item.logo" alt="logo" style="width: 150px; height: 150px; object-fit: contain" />
                </div>
            </v-col>
            <v-col cols="12" md="12" sm="12">
                <v-text-field v-model="item.name" label="Full Name *" required readonly
                    variant="underlined"></v-text-field>
            </v-col>
            <v-col cols="12" md="12" sm="12">
                <v-text-field v-model="item.phone" label="Phone Number *" type="tel" required readonly
                    variant="underlined" :rules="[phoneRule]"></v-text-field>
            </v-col>
            <v-col cols="12" md="6" sm="6">
                <v-text-field v-model="item.email" label="Email Address *" type="email" required readonly
                    variant="underlined"></v-text-field>
            </v-col>
            <v-col cols="12" md="6" sm="6">
                <v-text-field v-model="item.web" label="Website URL *" required readonly
                    variant="underlined"></v-text-field>
            </v-col>
            <v-col cols="12" md="12" sm="12">
                <v-textarea v-model="item.address" label="Address *" required readonly no-resize></v-textarea>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup>
const props = defineProps({
    item: {
        type: Object,
        required: true,
    },
});

// Phone number validation rule (simple example, adjust regex as needed)
const phoneRule = v =>
    !v || /^\+?\d{7,15}$/.test(v) || 'Phone number must be valid';
</script>
