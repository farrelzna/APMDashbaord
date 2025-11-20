<template>
    <v-row class="p-5">
        <v-col cols="6">
            <v-text-field
                v-model="formData.amount_inc_tax"
                label="Amount Inc. Tax"
                :rules="[requiredRule, amountRule]"
                :error-messages="errors.amount_inc_tax"
                hide-details
            ></v-text-field>
            <div class="mt-3">
                <v-text-field
                    v-model="formData.amount_exc_tax"
                    label="Amount Exc. Tax"
                    :rules="[requiredRule, amountRule]"
                    :error-messages="errors.amount_exc_tax"
                    hide-details
                ></v-text-field>
            </div>
            <div class="mt-3">
                <v-textarea
                    v-model="formData.scope_of_work"
                    label="Scope of Work"
                    :rules="[requiredRule]"
                    :error-messages="errors.scope_of_work"
                    hide-details
                ></v-textarea>
            </div>
        </v-col>
        <v-col cols="6">
            <v-date-input
                v-model="formatedDate"
                :error-messages="errors.po_contract_date"
                label="PO/Contract Date"
                variant="outlined"
                hide-details
                prepend-icon=""
            ></v-date-input>
            <div class="mt-3">
                <v-text-field
                    v-model="formData.po_contract_no"
                    label="PO/Contract No"
                    :rules="[requiredRule]"
                    :error-messages="errors.po_contract_no"
                    hide-details
                    class="capitalize-input"
                ></v-text-field>
            </div>
            <div class="mt-3">
                <v-text-field
                    v-model="formData.term_of_payment"
                    label="Term of Payment"
                    :rules="[requiredRule]"
                    :error-messages="errors.term_of_payment"
                    hide-details
                ></v-text-field>
            </div>
        </v-col>
    </v-row>
</template>

<script setup>
const props = defineProps({
    formData: Object,
    errors: Object,
    isInfo: Boolean,
});

const formatedDate = ref(
    new Date(formatDateForInput(props.formData.po_contract_date))
);
const { formData, errors } = toRefs(props);

const requiredRule = value => !!value || 'Required.';
const amountRule = value => !isNaN(value) || 'Invalid amount.';

watch(formatedDate, (newValue, oldValue) => {
    formData.value.po_contract_date = formatDateForInput(newValue);
});
</script>

<style scoped>
.capitalize-input {
    text-transform: capitalize !important;
}
</style>
