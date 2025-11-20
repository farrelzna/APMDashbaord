<script setup>
const dialog = ref(false);
const dialogDelete = ref(false);
const projectStore = useProjectStore();
const infoShow = ref(false);
const loading = ref(true);
const search = ref(null);

const headers = [
    { title: '#', key: 'number', sortable: false },
    { title: 'PID', key: 'pid', sortable: false },
    { title: 'Project Name', key: 'name', sortable: false },
    { title: 'User', key: 'customer_str.name', sortable: false },
    { title: 'End-User', key: 'end_user_str.name', sortable: false },
    { title: 'PM', key: 'pm_str.full_name', sortable: false },
    { title: 'Progress', key: 'progress', sortable: false },
    { title: 'Status', key: 'status', sortable: false },
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
        v-model:items-per-page="projects.page.per_page"
        :headers="headers"
        :items="projects.results"
        :loading="loading"
        :items-length="projects.page.count_result"
        :search="search"
        :items-per-page-options="[]"
        @update:options="loadItems"
    >
        <template v-slot:item.progress="{ item }">
            <v-progress-linear
                v-if="item.progress"
                :model-value="item.progress.task_complete"
                :max="item.progress.task_total"
            ></v-progress-linear>
        </template>

        <template v-slot:item.status="{ item }">
            <v-chip
                :color="colorByStatus(item.status)"
                class="text-uppercase"
                size="small"
                label
            >
                <strong>{{ item.status }}</strong>
            </v-chip>
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

                <v-btn
                    class="mx-5"
                    color="primary"
                    variant="outlined"
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
        <template v-slot:item.actions="{ item }">
            <v-menu location="start">
                <template v-slot:activator="{ props }">
                    <v-icon
                        v-bind="props"
                        size="large"
                        icon="mdi-dots-vertical"
                    ></v-icon>
                </template>
                <v-list>
                    <v-list-item key="" value="">
                        <nuxt-link :to="`/dashboard/project/${item.id}`">
                            <div class="flex gap-2 items-center">
                                <v-icon size="small">mdi-eye</v-icon>
                                <v-list-item-title>Details</v-list-item-title>
                            </div>
                        </nuxt-link>
                    </v-list-item>
                    <v-list-item key="" value="" @click="editItem(item)">
                        <nuxt-link :to="`/dashboard/project/update/${item.id}`">
                            <div class="flex gap-2 items-center">
                                <v-icon size="small">mdi-pencil</v-icon>
                                <v-list-item-title>Edit</v-list-item-title>
                            </div>
                        </nuxt-link>
                    </v-list-item>
                    <v-list-item key="" value="" @click="deleteItem(item)">
                        <div class="flex gap-2 items-center">
                            <v-icon size="small">mdi-delete</v-icon>
                            <v-list-item-title>Delete</v-list-item-title>
                        </div>
                    </v-list-item>
                </v-list>
            </v-menu>
        </template>
        <template v-slot:no-data>
            <div class="flex flex-col gap-5 items-center p-5">
                <h1>No data found!</h1>
                <v-btn color="primary" @click="initialize">Refresh</v-btn>
            </div>
        </template>
    </v-data-table-server>
</template>
