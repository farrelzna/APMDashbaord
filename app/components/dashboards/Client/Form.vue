<template>
    <v-container>
        <v-row class="items-start">
            <!-- Left: Avatar with overlay and caption -->
            <v-col cols="12" md="4" class="flex flex-col items-center gap-4">
                <div class="relative">
                    <v-avatar size="150" class="bg-gray-100">
                        <template v-if="editedItem.logo">
                            <v-img :src="editedItem.logo" alt="Client logo" />
                        </template>
                        <template v-else>
                            <v-icon size="180" color="grey">mdi-account-circle</v-icon>
                        </template>
                    </v-avatar>
                    <v-btn icon="mdi-pencil" class="absolute" variant="flat" size="small"
                          :style="{ right: '-8px', bottom: '-8px', borderRadius: '50%', background:'#eee' }"
                          @click="triggerFileSelect"></v-btn>
                </div>
                <div class="text-center text-sm text-gray-500">
                    Click to upload profile photo
                    <div class="text-xs">PNG, JPG up to 5MB</div>
                </div>
                <input ref="fileInputRef" type="file" class="hidden"
                       accept="image/png, image/jpeg"
                       @change="handleLogoChange" />
            </v-col>

            <!-- Right: Two-column fields -->
            <v-col cols="12" md="8">
                <v-row>
                    <v-col cols="12" md="6">
                        <v-text-field v-model="editedItem.name" label="Full Name *" :rules="[rules.required]" required variant="underlined" />
                    </v-col>
                    <v-col cols="12" md="6">
                        <v-text-field v-model="editedItem.web" label="Website URL *" :rules="[rules.url]"
                                      pattern="[Hh][Tt][Tt][Pp][Ss]?:\/\/(?:(?:[a-zA-Z\u00a1-\uffff0-9]+-?)*[a-zA-Z\u00a1-\uffff0-9]+)(?:\.(?:[a-zA-Z\u00a1-\uffff0-9]+-?)*[a-zA-Z\u00a1-\uffff0-9]+)*(?:\.(?:[a-zA-Z\u00a1-\uffff]{2,}))(?::\d{2,5})?(?:\/[^\s]*)?"
                                      required variant="underlined" />
                    </v-col>
                    <v-col cols="12" md="6">
                        <v-text-field v-model="editedItem.phone" label="Phone Number *" type="tel"
                                      :rules="[rules.required, rules.phone, v => /^\d{0,16}$/.test(v || '') || 'Only numbers allowed, max 16 digits.']"
                                      required maxlength="16" pattern="^\d{1,16}$"
                                      @input="editedItem.phone = (editedItem.phone || '').replace(/\D/g, '').slice(0, 16)" variant="underlined" />
                    </v-col>
                    <v-col cols="12" md="6">
                        <v-text-field v-model="editedItem.email" label="Email Address *" type="email"
                                      :rules="[rules.required, rules.email]" required variant="underlined" />
                    </v-col>
                    <v-col cols="12" md="12">
                        <v-textarea v-model="editedItem.address" label="Address *" :rules="[rules.required]" required variant="underlined" />
                    </v-col>
                </v-row>
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

const emit = defineEmits(['update:editedItem','submit','cancel']);
const fileInputRef = ref(null);

const triggerFileSelect = () => {
    fileInputRef.value?.click();
};

const handleLogoChange = event => {
    const file = event.target.files && event.target.files[0];
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
