<template>
    <v-row class="p-2">
        <v-col cols="4" sm="12" md="12" lg="4">
            <v-text-field v-model="formData.year" label="Year *" :rules="[requiredRule, yearRule]"
                :error-messages="errors.year" :readonly="isInfo" :variant="isInfo ? 'underlined' : 'outlined'"
                hide-details></v-text-field>
            <div class="mt-2">
                <v-text-field v-model="formData.name" label="Project Name *" :rules="[requiredRule]"
                    :error-messages="errors.name" :readonly="isInfo" :variant="isInfo ? 'underlined' : 'outlined'"
                    hide-details></v-text-field>
            </div>
            <div class="mt-2">
                <v-select label="Status *" :items="projectStatus" v-model="formData.status" :rules="[requiredRule]"
                    :error-messages="errors.status" :readonly="isInfo" :variant="isInfo ? 'underlined' : 'outlined'"
                    hide-details></v-select>
            </div>
            <div class="mt-2">
                <v-text-field v-model="formData.project_type" label="Project Type *" :rules="[requiredRule]"
                    :error-messages="errors.project_type" :readonly="isInfo"
                    :variant="isInfo ? 'underlined' : 'outlined'" hide-details></v-text-field>
            </div>
            <div class="mt-2">
                <v-textarea v-model="formData.remarks" label="Remarks" rows="4" :readonly="isInfo"
                    :variant="isInfo ? 'underlined' : 'outlined'" hide-details></v-textarea>
            </div>
        </v-col>
        <v-col cols="8" sm="12" md="12" lg="8">
            <v-row dense>
                <v-col>
                    <v-text-field v-model="formData.pic" label="PIC *" :rules="[requiredRule]"
                        :error-messages="errors.pic" :readonly="isInfo" :variant="isInfo ? 'underlined' : 'outlined'"
                        hide-details></v-text-field>
                </v-col>
                <v-col>
                    <v-text-field v-model="formData.pid" label="PID *" :rules="[requiredRule]"
                        :error-messages="errors.pid" :readonly="isInfo" :variant="isInfo ? 'underlined' : 'outlined'"
                        hide-details></v-text-field>
                </v-col>
            </v-row>
            <v-row dense>
                <v-col>
                    <v-date-input v-model="date.start_date" label="Start Date" prepend-icon=""
                        prepend-inner-icon="$calendar" :error-messages="errors.start_date" placeholder="YYYY-MM-DD"
                        :readonly="isInfo" :variant="isInfo ? 'underlined' : 'outlined'" hide-details
                        @input="formatDate"></v-date-input>
                </v-col>
                <v-col>
                    <v-date-input v-model="date.end_date" label="End Date" prepend-icon=""
                        prepend-inner-icon="$calendar" :error-messages="errors.end_date" placeholder="YYYY-MM-DD"
                        :readonly="isInfo" :variant="isInfo ? 'underlined' : 'outlined'" hide-details
                        @input="formatDate"></v-date-input>
                </v-col>
            </v-row>
            <v-row dense>
                <v-col>
                    <v-autocomplete v-model="formData.am" label="AM" :items="userByRole.pm" :readonly="isInfo"
                        :variant="isInfo ? 'underlined' : 'outlined'" hide-details></v-autocomplete>
                </v-col>
                <v-col>
                    <v-autocomplete v-model="formData.pm" label="PM" :items="userByRole.pm" :readonly="isInfo"
                        :variant="isInfo ? 'underlined' : 'outlined'" hide-details></v-autocomplete>
                </v-col>
            </v-row>
            <v-row dense>
                <v-col>
                    <v-autocomplete v-model="formData.sales" label="Sales" :items="userByRole.sales" :readonly="isInfo"
                        :variant="isInfo ? 'underlined' : 'outlined'" hide-details></v-autocomplete>
                </v-col>
                <v-col>
                    <v-autocomplete v-model="formData.admin_tender" :items="userByRole.admin_tender"
                        label="Admin Tender" :readonly="isInfo" :variant="isInfo ? 'underlined' : 'outlined'"
                        hide-details></v-autocomplete>
                </v-col>
            </v-row>
            <v-row dense>
                <v-col>
                    <v-autocomplete v-model="formData.customer" :items="userByRole.customers" label="Client"
                        :rules="[requiredRule]" :error-messages="errors.customer" :readonly="isInfo"
                        :variant="isInfo ? 'underlined' : 'outlined'" hide-details></v-autocomplete>
                </v-col>
                <v-col>
                    <v-autocomplete v-model="formData.end_user" label="End User *" :rules="[requiredRule]"
                        :error-messages="errors.end_user" :items="userByRole.end_user" :readonly="isInfo"
                        :variant="isInfo ? 'underlined' : 'outlined'" hide-details></v-autocomplete>
                </v-col>
            </v-row>
            <div class="mt-2">
                <v-autocomplete v-model="formData.engineer_eksternal" label="Engineer Eksternal"
                    :items="userByRole.engineer_eksternal" multiple :readonly="isInfo"
                    :variant="isInfo ? 'underlined' : 'outlined'" hide-details></v-autocomplete>
            </div>
        </v-col>
    </v-row>
</template>

<script setup>
const userStore = useUserStore();
const clientStore = useClientStore();
const props = defineProps({
    formData: Object,
    errors: Object,
    isInfo: Boolean,
});

const date = ref({
    start_date: null,
    end_date: null,
});

const { formData, errors } = toRefs(props);
const userByRole = ref({
    am: [],
    pm: [],
    sales: [],
    admin_tender: [],
    customers: [],
    end_user: [],
});

const projectStatus = [
    'Complete',
    'In Progress',
    'PM / CM',
    'On Hold',
    'Waiting Payment',
    'Almost Due',
    'Not Started Yet',
    'Maintenance',
];

async function initUsers() {
    const userRoles = ['AM', 'PM', 'Sales', 'Admin Tender', 'Engineer'];
    const clientsData = await clientStore.all();
    const clients = clientsData;
    const allUser = await userStore.getAll();

    // Initialize the date values only if they exist in formData
    date.value.start_date = formData.value.start_date
        ? new Date(formData.value.start_date)
        : null;
    date.value.end_date = formData.value.end_date
        ? new Date(formData.value.end_date)
        : null;

    userByRole.value = userRoles.reduce((acc, role) => {
        let formattedRole = role.toLowerCase().replace(/ /g, '_');

        if (role === 'Engineer') {
            const engineers = allUser.filter(user => user.role === 'Engineer');

            acc['engineer_eksternal'] = engineers
                .filter(user => user.status === 'Eksternal')
                .map(user => ({
                    title: `${user.first_name} ${user.last_name}`,
                    value: user.id,
                }));

            acc['engineer_internal'] = engineers
                .filter(user => user.status === 'Internal')
                .map(user => ({
                    title: `${user.first_name} ${user.last_name}`,
                    value: user.id,
                }));
        } else {
            acc[formattedRole] = allUser
                .filter(user => user.role === role)
                .map(user => ({
                    title: `${user.first_name} ${user.last_name}`,
                    value: user.id,
                }));
        }
        return acc;
    }, {});

    userByRole.value.customers = clients
        .filter(client => client.status === 'internal')
        .map(client => ({
            value: client.id,
            title: client.name,
        }));
    userByRole.value.end_user = clients
        .filter(client => client.status === 'eksternal')
        .map(client => ({
            value: client.id,
            title: client.name,
        }));
}

const requiredRule = value => !!value || 'Required.';
const yearRule = value =>
    (value && value > 1900 && value <= new Date().getFullYear()) ||
    'Invalid year.';

onMounted(async () => {
    await initUsers();
});

const formatDate = date => {
    if (!date) return '';
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

watch(
    () => date.value.start_date,
    newValue => {
        formData.value.start_date = formatDate(newValue);
    }
);

watch(
    () => date.value.end_date,
    newValue => {
        formData.value.end_date = formatDate(newValue);
    }
);

watch(
    () => formData.value.engineer_eksternal,
    newValue => {
        const filteredValues = newValue.filter(value => value !== '');
        if (filteredValues.length !== newValue.length) {
            formData.value.engineer_eksternal = filteredValues;
        }
    }
);
</script>
