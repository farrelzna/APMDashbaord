<script setup>
const dialog = ref(false);
const dialogDelete = ref(false);
const projectStore = useProjectStore();
const infoShow = ref(false);
const loading = ref(true);
const search = ref(null);
const tableOptions = reactive({ page: 1, itemsPerPage: 10 });
const totalProjects = computed(() => projects.page.count_result || 0);
const pageStart = computed(() => {
    if (!totalProjects.value) return 0;
    return (tableOptions.page - 1) * tableOptions.itemsPerPage + 1;
});
const pageEnd = computed(() => Math.min(tableOptions.page * tableOptions.itemsPerPage, totalProjects.value));
import { colorByStatus } from '@/utils/colorByStatus';

const headers = [
    { title: 'PID', key: 'pid', sortable: false },
    { title: 'Project Name', key: 'name', sortable: false },
    { title: 'User', key: 'customer_str.name', sortable: false },
    { title: 'End-User', key: 'end_user_str.name', sortable: false },
    { title: 'PM', key: 'pm_str.full_name', sortable: false },
    { title: 'Progress', key: 'progress', sortable: false },
    { title: 'Actions', key: 'actions', sortable: false },
];

const projects = reactive({
    page: { per_page: 10, count_result: 0 },
    results: [],
});
const editedIndex = ref(-1);

const deletedItem = ref(null);

const editedItem = reactive({
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
    finance: [],
    project_status: [],
    engineer: [],
    number: '',
});

const defaultItem = {
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
    finance: [],
    project_status: [],
    engineer: [],
    number: '',
};

watch(dialog, val => {
    if (!val) close();
});
watch(dialogDelete, val => {
    if (!val) closeDelete();
});

const loadItems = async ({ page, itemsPerPage }) => {
    loading.value = true;
    const projectsData = await projectStore.fetchAll(page, search.value || '');
    projects.results = projectsData.results.map((client, index) => {
        return {
            ...client,
            number: index + 1 + itemsPerPage * (page - 1),
            progress: {
                task_total: client.project_status.length,
                task_complete: client.project_status.filter(
                    status => status.status === 'Complete'
                ).length,
            },
        };
    });
    projects.page.count_result = projectsData.page.count_result;
    loading.value = false;
};

const initialize = async () => {
    loading.value = true;
    const projectsData = await projectStore.fetchAll();
    projects.page.count_result = projectsData.page.count_result;
    projects.results = projectsData.results.map((client, index) => {
        return {
            ...client,
            number: index + 1 + projects.page.count_result * 0,
            progress: {
                task_total: client.project_status.length,
                task_complete: client.project_status.filter(
                    status => status.status === 'Complete'
                ).length,
            },
        };
    });
    loading.value = false;
};

const editItem = item => {
    editedIndex.value = projects.results.indexOf(item);
    Object.assign(editedItem, item);
    dialog.value = true;
};

const deleteItem = item => {
    editedIndex.value = projects.results.indexOf(item);
    Object.assign(editedItem, item);
    deletedItem.value = item;
    dialogDelete.value = true;
};

const deleteItemConfirm = async () => {
    await projectStore.destroy(deletedItem.value.id);
    await initialize();
    closeDelete();
};

const close = () => {
    dialog.value = false;
    infoShow.value = false;
    Object.assign(editedItem, defaultItem);
    editedIndex.value = -1;
};

const closeDelete = () => {
    dialogDelete.value = false;
    Object.assign(editedItem, defaultItem);
    editedIndex.value = -1;
};

onMounted(() => {
    initialize();
});

provide('refreshData', initialize);
</script>

<template>
    <v-data-table-server
        v-model:page="tableOptions.page"
        v-model:items-per-page="tableOptions.itemsPerPage"
        :headers="headers"
        :items="projects.results"
        :loading="loading"
        :items-length="projects.page.count_result"
        :search="search"
        show-select
        :items-per-page-options="[{ value: 10, title: '10' }, { value: 25, title: '25' }, { value: 50, title: '50' }]"
        :hide-default-footer="true"
        @update:options="loadItems"
        class="border p-5 rounded-xl"
    >
        <template v-slot:item.progress="{ item }">
            <v-progress-linear
                v-if="item.progress"
                :model-value="item.progress.task_complete"
                :max="item.progress.task_total"
            ></v-progress-linear>
        </template>

        
        <template v-slot:top>
            <v-toolbar flat color="containerBg">
                <v-toolbar-title>Projects Table</v-toolbar-title>
                <v-text-field
                    v-model="search"
                    density="compact"
                    label="Search"
                    prepend-inner-icon="mdi-magnify"
                    flat
                    hide-details
                    single-line
                ></v-text-field>
                <div class="flex items-center gap-1 ml-3 text-xs font-medium">
                    <span class="text-gray-800">{{ pageStart }}-{{ pageEnd }} of {{ totalProjects }}</span>
                    <v-btn class="h-7 w-7" icon="mdi-chevron-double-left" variant="text" size="x-small" @click="tableOptions.page = 1" :disabled="tableOptions.page === 1" />
                    <v-btn class="h-7 w-7" icon="mdi-chevron-left" variant="text" size="x-small" @click="tableOptions.page > 1 && tableOptions.page--" :disabled="tableOptions.page === 1" />
                    <v-btn class="h-7 w-7" icon="mdi-chevron-right" variant="text" size="x-small" @click="tableOptions.page * tableOptions.itemsPerPage < totalProjects && tableOptions.page++" :disabled="tableOptions.page * tableOptions.itemsPerPage >= totalProjects" />
                    <v-btn class="h-7 w-7" icon="mdi-chevron-double-right" variant="text" size="x-small" @click="tableOptions.page = Math.ceil(totalProjects / tableOptions.itemsPerPage)" :disabled="tableOptions.page * tableOptions.itemsPerPage >= totalProjects" />
                </div>

                <v-btn
                    class="mx-5"
                    :style="{ background:'#111', color:'#fff', fontWeight:600 }"
                    variant="flat"
                    dark
                    v-can="pagePermission.project.add"
                    @click="navigateTo('/dashboard/project/create')"
                >
                    New Project
                </v-btn>
                <DashboardsFormsDeleteConfirm
                    :showModal="dialogDelete"
                    @update:showModal="dialogDelete = $event"
                    :closeAction="closeDelete"
                    :deleteAction="deleteItemConfirm"
                />
            </v-toolbar>
        </template>
        <template v-slot:item.name="{ item }">
            <p class="w-56">{{ item.name }}</p>
        </template>
        <template v-slot:item.number="{ index }">
            {{ (tableOptions.page - 1) * tableOptions.itemsPerPage + index + 1 }}
        </template>
        <template v-slot:item.actions="{ item }">
            <div class="flex flex-col items-start gap-2 w-full">
                <div class="row-actions flex items-center gap-2">
                    <nuxt-link :to="`/dashboard/project/${item.id}`" class="inline-flex items-center">
                        <v-icon size="small">mdi-eye</v-icon>
                    </nuxt-link>
                    <nuxt-link :to="`/dashboard/project/update/${item.id}`" class="inline-flex items-center">
                        <v-icon size="small">mdi-pencil</v-icon>
                    </nuxt-link>
                    <button class="inline-flex items-center" @click="deleteItem(item)">
                        <v-icon size="small" color="error">mdi-delete</v-icon>
                    </button>
                </div>
                <v-btn
                    class="visit-btn"
                    size="x-small"
                    :color="colorByStatus(item.status)"
                    variant="tonal"
                    rounded="lg"
                    @click="navigateTo(`/dashboard/project/${item.id}`)"
                >{{ item.status }}</v-btn>
            </div>
        </template>
        <template v-slot:no-data>
            <div class="flex flex-col gap-5 items-center p-5">
                <h1>No data found!</h1>
                <v-btn color="primary" @click="initialize">Refresh</v-btn>
            </div>
        </template>
    </v-data-table-server>
</template>

<style scoped>
.row-actions {
    opacity: 0;
    transform: translateY(-2px);
    transition: opacity .15s ease, transform .15s ease;
}
:deep(tbody tr:hover .row-actions),
:deep(tbody tr:focus-within .row-actions) {
    opacity: 1;
    transform: translateY(0);
}
.visit-btn {
    font-size: 11px;
    line-height: 16px;
    padding: 0 10px;
    text-transform: none;
    font-weight: 500;
    transition: background-color .15s ease;
}
.visit-btn:hover {
    filter: brightness(0.98);
}
</style>
