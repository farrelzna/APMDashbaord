<script setup>
const props = defineProps({
    finances: Object,
});

const headers = [
    { title: 'Invoice Number', value: 'invoice_number', sortable: false },
    { title: 'Name', value: 'name', sortable: false },
    { title: 'PO', value: 'po', sortable: false },
    { title: 'Status', value: 'status', sortable: false },
    { title: 'Date Of Payment', value: 'date_of_payment', sortable: false },
];
</script>

<template>
    <v-data-table
        :items="finances"
        :headers="headers"
        item-value="id"
        :items-per-page-options="[]"
        show-expand
    >
        <template v-slot:item.status="{ item }">
            <v-chip size="small" :color="colorByStatus(item.status)">{{
                item.status
            }}</v-chip>
        </template>

        <template v-slot:expanded-row="{ columns, item }">
            <tr>
                <td :colspan="columns.length">
                    <strong>Note : </strong>
                    <span>{{ item.note }}</span>
                </td>
            </tr>
        </template>
    </v-data-table>
</template>
