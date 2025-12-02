<script setup>
import { computed } from 'vue';

const props = defineProps({
    project: Object,
});

const projectLoaded = computed(
    () => !!props.project && Object.keys(props.project).length > 0
);

const formatCurrency = value => {
    return value
        ? new Intl.NumberFormat('id-ID', {
              style: 'currency',
              currency: 'IDR',
          }).format(value)
        : '-';
};

const information = computed(() => [
    { icon: 'mdi-tune', label: 'PID', value: props.project?.pid || '-' },
    {
        icon: 'mdi-folder-multiple',
        label: 'Project Type',
        value: props.project?.project_type || '-',
    },
    {
        icon: 'mdi-domain',
        label: 'User',
        value: props.project?.customer_str?.name || '-',
    },
    {
        icon: 'mdi-account-tie',
        label: 'PIC',
        value: props.project?.pic || '-',
    },
    {
        icon: 'mdi-account-cash-outline',
        label: 'AM',
        value: props.project?.am_str.full_name || '-',
    },
    {
        icon: 'mdi-briefcase',
        label: 'PM',
        value: props.project?.pm_str?.full_name || '-',
    },
    {
        icon: 'mdi-cash-register',
        label: 'Sales',
        value: props.project?.sales_str.full_name || '-',
    },
    {
        icon: 'mdi-file-document',
        label: 'Admin Tender',
        value: props.project?.admin_tender_str.full_name || '-',
    },
]);

const contractInformation = computed(() => [
    {
        icon: 'mdi-map',
        label: 'Scope of work',
        value: props.project?.scope_of_work,
    },
    {
        icon: 'mdi-wallet',
        label: 'Term of payment',
        value: props.project?.term_of_payment,
    },
    {
        icon: 'mdi-cash-plus',
        label: 'Amount Inc. Tax',
        value: formatCurrency(props.project?.amount_inc_tax),
    },
    {
        icon: 'mdi-cash-minus',
        label: 'Amount Exc. Tax',
        value: formatCurrency(props.project?.amount_exc_tax),
    },
    {
        icon: 'mdi-file-document-outline',
        label: 'PO Contract No',
        value: props.project?.po_contract_no || '-',
    },
    {
        icon: 'mdi-calendar-outline',
        label: 'PO Contract Date',
        value: props.project?.po_contract_date || '-',
    },
]);
</script>

<template>
    <div v-if="projectLoaded">
        <v-card elevation="0" rounded="lg" style="border: 1px solid #F4F4F4;" class="pa-4">
            <h4 class="text-body-1 font-weight-semibold mb-4">Informations</h4>
            <v-divider class="mb-4"></v-divider>
            
            <div class="d-flex flex-column ga-3">
                <div
                    v-for="(item, index) in information"
                    :key="index"
                    class="d-flex align-center justify-space-between"
                >
                    <div class="d-flex align-center ga-2">
                        <v-icon size="18" class="text-grey-darken-1">{{ item.icon }}</v-icon>
                        <span class="text-body-2 text-grey-darken-2">{{ item.label }}</span>
                    </div>
                    <span class="text-body-2 font-weight-medium text-grey-darken-3">
                        {{ item.value || '-' }}
                    </span>
                </div>
            </div>
        </v-card>

        <v-card elevation="0" rounded="lg" style="border: 1px solid #F4F4F4;" class="pa-4 mt-4">
            <h4 class="text-body-1 font-weight-semibold mb-4">Contract Informations</h4>
            <v-divider class="mb-4"></v-divider>
            
            <div class="d-flex flex-column ga-3">
                <div
                    v-for="(item, index) in contractInformation"
                    :key="index"
                    class="d-flex align-center justify-space-between"
                >
                    <div class="d-flex align-center ga-2">
                        <v-icon size="18" class="text-grey-darken-1">{{ item.icon }}</v-icon>
                        <span class="text-body-2 text-grey-darken-2">{{ item.label }}</span>
                    </div>
                    <span class="text-body-2 font-weight-medium text-grey-darken-3">
                        {{ item.value || '-' }}
                    </span>
                </div>
            </div>
        </v-card>
    </div>

    <div v-else class="d-flex flex-column ga-2">
        <v-skeleton-loader type="card" />
        <v-skeleton-loader type="card" />
    </div>
</template>

<style scoped>
/* No custom styles needed - using Vuetify utility classes */
</style>
