<template>
    <v-container>
        <v-row>
            <v-col cols="12">
                <div class="w-full h-full flex flex-col justify-center items-center gap-5">
                    <v-avatar :image="editedItem.logo" size="150" class="border-2 border-black" />
                    <v-file-input v-model="editedItem.logoFile" label="Logo" prepend-icon="mdi-camera"
                        variant="outlined" class="w-full" @change="handleLogoChange"
                        accept="image/png, image/jpeg, image/bmp" :required="!editedItem.logo" />
                </div>
            </v-col>
            <v-col cols="12" md="12" sm="12">
                <v-text-field v-model="editedItem.name" label="Full Name *" :rules="[rules.required]"
                    required></v-text-field>
            </v-col>
            <v-col cols="12" md="12" sm="12">
                <v-text-field v-model="editedItem.phone" label="Phone Number *" type="tel"
                    :rules="[rules.required, rules.phone, v => /^\d{0,16}$/.test(v || '') || 'Only numbers allowed, max 16 digits.']"
                    required maxlength="16" pattern="^\d{1,16}$"
                    @input="editedItem.phone = (editedItem.phone || '').replace(/\D/g, '').slice(0, 16)"></v-text-field>
            </v-col>
            <v-col cols="12" md="6" sm="6">
                <v-text-field v-model="editedItem.email" label="Email Address *" type="email"
                    :rules="[rules.required, rules.email]" required></v-text-field>
            </v-col>
            <v-col cols="12" md="6" sm="6">
                <v-text-field v-model="editedItem.web" label="Website URL *" :rules="[rules.url]"
                    pattern="[Hh][Tt][Tt][Pp][Ss]?:\/\/(?:(?:[a-zA-Z\u00a1-\uffff0-9]+-?)*[a-zA-Z\u00a1-\uffff0-9]+)(?:\.(?:[a-zA-Z\u00a1-\uffff0-9]+-?)*[a-zA-Z\u00a1-\uffff0-9]+)*(?:\.(?:[a-zA-Z\u00a1-\uffff]{2,}))(?::\d{2,5})?(?:\/[^\s]*)?"
                    required></v-text-field>
            </v-col>
            <v-col cols="12" md="12" sm="12">
                <v-textarea v-model="editedItem.address" label="Address *" :rules="[rules.required]"
                    required></v-textarea>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup>
const props = defineProps({
    editedItem: {
        type: Object,
        required: true,
    },
});

const emit = defineEmits(['update:editedItem']);

const handleLogoChange = event => {
    const file = event.target.files[0];
    if (file) {
        props.editedItem.logoFile = file;
        const reader = new FileReader();
        reader.onload = e => {
            emit('update:editedItem', {
                ...props.editedItem,
                logo: e.target.result,
            });
        };
        reader.readAsDataURL(file);
    } else {
        emit('update:editedItem', { ...props.editedItem, logo: '' });
    }
};

const rules = {
    required: value => !!value || 'Required.',
    email: value => {
        const pattern = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
        return pattern.test(value) || 'Invalid email.';
    },
    phone: value => {
        const pattern = /^(\+\d{1,3}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4,9}$/;
        return pattern.test(value) || 'Invalid phone number.';
    },
    url: value => {
        const pattern =
            /^(https?):\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?$/;
        return pattern.test(value) || 'Invalid URL.';
    },
};
</script>
