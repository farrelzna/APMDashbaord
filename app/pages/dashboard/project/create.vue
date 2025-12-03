<script setup>
import { toast } from 'vue-sonner';
definePageMeta({
    middleware: 'auth',
});
const currentStep = ref(1);
const totalSteps = 5;
const projectStore = useProjectStore();
const formData = reactive({
    year: '',
    pid: '',
    name: '',
    status: '',
    customer: '',
    end_user: '',
    remarks: '',
    am: '',
    pm: '',
    sales: '',
    admin_tender: '',
    pic: '',
    start_date: '',
    end_date: '',
    term_of_payment: '',
    scope_of_work: '',
    engineer_eksternal: [],
    project_type: '',
    po_contract_no: '',
    po_contract_date: '',
    amount_inc_tax: '',
    amount_exc_tax: '',
    id: '',
    customer_str: {},
    pm_str: {},
    finances: [],
    project_status: [],
    engineer: [],
    number: '',
});

const errors = ref({
    year: '',
    pid: '',
    name: '',
    status: '',
    customer: '',
    end_user: '',
    remarks: '',
    am: '',
    pm: '',
    sales: '',
    admin_tender: '',
    pic: '',
    start_date: '',
    end_date: '',
    term_of_payment: '',
    scope_of_work: '',
    engineer_eksternal: '',
    project_type: '',
    po_contract_no: '',
    po_contract_date: '',
    amount_inc_tax: '',
    amount_exc_tax: '',
    finances: [],
    project_status: [],
    engineer: [],
});

const formatLabel = key => {
    return key
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, str => str.toUpperCase());
};

const validateForm = () => {
    let valid = true;
    const requiredFields = [
        'year',
        'pid',
        'name',
        'status',
        'customer',
        'end_user',
        'pic',
        'start_date',
        'end_date',
        'term_of_payment',
        'scope_of_work',
        'project_type',
        'po_contract_no',
        'po_contract_date',
        'amount_inc_tax',
        'amount_exc_tax',
    ];

    requiredFields.forEach(field => {
        if (!formData[field]) {
            errors.value[field] = 'Required.';
            valid = false;
        } else {
            errors.value[field] = '';
        }
    });

    return valid;
};

const submitForm = async () => {
    const valid = validateForm();

    if (valid) {
        await projectStore.add(formData);
        navigateTo('/dashboard/project');
    } else {
        toast.error('Form is invalid.');
    }
};

const nextStep = () => {
    if (currentStep.value < totalSteps) {
        currentStep.value += 1;
    } else {
        submitForm();
    }
};

const previousStep = () => {
    if (currentStep.value > 1) {
        currentStep.value -= 1;
    }
};
</script>

<template>
    <v-container class="bg-white shadow rounded">
        <h1 class="text-xl">Create Project</h1>
        <br />
        <v-stepper
            v-model="currentStep"
            :items="[
                'General Informations',
                'Contract Informations',
                'Project Finance',
                'Engineers',
                'Tasks',
            ]"
            hide-actions
            editable="true"
            color="primary"
            class="elevation-0"
        >
            <template v-slot:item.1>
                <v-card flat>
                    <v-card-title class="stepper-title">
                        <dashboards-project-basic-form
                            :form-data="formData"
                            :errors="errors"
                            :is-info="false"
                        />
                    </v-card-title>
                </v-card>
            </template>

            <template v-slot:item.2>
                <v-card flat>
                    <v-card-title class="stepper-title">
                        <dashboards-project-contract-form
                            :form-data="formData"
                            :errors="errors"
                            :is-info="false"
                        />
                    </v-card-title>
                </v-card>
            </template>

            <template v-slot:item.3>
                <v-card flat>
                    <v-card-title class="stepper-title">
                        <dashboards-project-finance-form
                            :form-data="formData"
                            :errors="errors"
                            :is-info="false"
                        />
                    </v-card-title>
                </v-card>
            </template>

            <template v-slot:item.4>
                <v-card flat>
                    <v-card-title class="stepper-title">
                        <dashboards-engineer-form
                            :form-data="formData"
                            :errors="errors"
                            :is-info="false"
                        />
                    </v-card-title>
                </v-card>
            </template>

            <template v-slot:item.5>
                <v-card flat>
                    <v-card-title class="stepper-title">
                        <dashboards-project-task-form
                            :form-data="formData"
                            :errors="errors"
                            :with-template="true"
                        />
                    </v-card-title>
                </v-card>
            </template>
        </v-stepper>

        <v-row justify="space-between" class="p-5">
            <v-btn @click="previousStep" :style="{ color: '#111'}" :disabled="currentStep === 1"
                >Previous</v-btn
            >
            <v-btn @click="nextStep" :style="{ background:'#111', color:'#fff', fontWeight:600 }">
                {{ currentStep === totalSteps ? 'Done' : 'Next' }}
            </v-btn>
        </v-row>
    </v-container>
</template>

<style scoped>
.stepper-title {
    font-size: 1rem;
}
</style>
