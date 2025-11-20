<script setup>
const props = defineProps({
    status: {
        required: false,
        default: 'eksternal',
        type: String,
    },
});

const dialog = ref(false);
const dialogDelete = ref(false);
const clientStore = useClientStore();
const infoShow = ref(false);
const loading = ref(true);
const search = ref(null);

const headers = [
    { title: '#', key: 'number', sortable: false },
    { title: 'Name', key: 'name', sortable: true },
    { title: 'Phone', key: 'phone', sortable: false },
    { title: 'Email', key: 'email', sortable: false },
    { title: 'Website', key: 'web', sortable: false },
    { title: 'Actions', key: 'actions', sortable: false },
];

const clients = reactive({
    page: { per_page: 10, count_result: 0 },
    results: [],
});
const editedIndex = ref(-1);

const editedItem = reactive({
    logo: '',
    logoFile: null,
    name: '',
    phone: '',
    email: '',
    web: '',
    address: '',
    status: props.status
});

const defaultItem = {
    logo: '',
    logoFile: null,
    name: '',
    phone: '',
    email: '',
    web: '',
    address: '',
    status: props.status
};

const deletedItem = ref(null);

const formTitle = computed(() => {
    if (editedIndex.value === -1) {
        return props.status === 'eksternal' ? 'Add End User' : 'Add Client';
    }
    return props.status === 'eksternal' ? 'Edit End User' : 'Edit Client';
});

const status = ref(props.status);

watch(dialog, val => {
    if (!val) close();
});
watch(dialogDelete, val => {
    if (!val) closeDelete();
});

const loadItems = async ({ page, itemsPerPage }) => {
    loading.value = true;

    const clientsData = await clientStore.fetchAll(
        page,
        search.value || '',
        status.value
    );
    clients.page.count_result = clientsData.page.count_result;

    clients.results = clientsData.results.map((client, index) => ({
        ...client,
        number: index + 1 + itemsPerPage * (page - 1),
    }));
    loading.value = false;
};

const initialize = async () => {
    loading.value = true;
    status.value = props.status;
    const clientsData = await clientStore.fetchAll(
        page,
        search.value || '',
        status.value
    );
    clients.page.count_result = clientsData.page.count_result;

    clients.results = clientsData.results.map((client, index) => ({
        ...client,
        number: index + 1 + clients.page.count_result * 0,
    }));
    loading.value = false;
};

const editItem = item => {
    editedIndex.value = clients.results.indexOf(item);
    Object.assign(editedItem, item);
    dialog.value = true;
};

const infoItem = item => {
    editedIndex.value = clients.results.indexOf(item);
    Object.assign(editedItem, item);
    dialog.value = true;
    infoShow.value = true;
};

const deleteItem = item => {
    editedIndex.value = clients.results.indexOf(item);
    Object.assign(editedItem, item);
    deletedItem.value = item;
    dialogDelete.value = true;
};

const deleteItemConfirm = async () => {
    await clientStore.destroy(deletedItem.value.id);
    await initialize();
    closeDelete();
};

const close = () => {
    dialog.value = false;
    infoShow.value = false;
    Object.assign(editedItem, defaultItem);
    editedIndex.value = -1;
    search.value = '';
};

const closeDelete = () => {
    dialogDelete.value = false;
    Object.assign(editedItem, defaultItem);
    editedIndex.value = -1;
};

const save = async () => {
    if (editedIndex.value > -1) {
        const client = clients.results[editedIndex.value];
        Object.assign(client, editedItem);
        clientStore.update(client.id, editedItem);
    } else {
        clients.results.push({ ...editedItem });
        clientStore.add({ ...editedItem });
    }
    close();
    await initialize(); // Refresh the table after save
};

const updateEditedItem = item => {
    Object.assign(editedItem, item);
};

onMounted(() => {
    initialize();
});
</script>

<template>
    <v-data-table-server
        v-model:items-per-page="clients.page.per_page"
        :headers="headers"
        :items="clients.results"
        :loading="loading"
        :items-length="clients.page.count_result"
        :search="search"
        :items-per-page-options="[]"
        @update:options="loadItems"
    >
        <template v-slot:top>
            <v-toolbar flat color="containerBg">
                <v-toolbar-title>{{ status == 'eksternal' ? 'End User' : 'Client' }} Table</v-toolbar-title>
                <v-dialog v-model="dialog" max-width="800px">
                    <template
                        v-slot:activator="{ props }"
                        v-can="pagePermission.client.add"
                    >
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
                            v-bind="props"
                        >
                            New {{ status == "eksternal" ? 'End User' : 'Client' }}
                        </v-btn>
                    </template>
                    <v-card>
                        <v-card-title>
                            <span class="text-h5">{{
                                infoShow ? 'Info User' : formTitle
                            }}</span>
                        </v-card-title>
                        <v-card-text class="w-full">
                            <form
                                @submit.prevent="save"
                                v-if="!infoShow"
                                enctype="multipart/form-data"
                            >
                                <DashboardsClientForm
                                    :editedItem="editedItem"
                                    @update:editedItem="updateEditedItem"
                                />
                                <v-card-actions>
                                    <v-spacer></v-spacer>
                                    <v-btn
                                        color="error"
                                        variant="outlined"
                                        @click="close"
                                    >
                                        Cancel
                                    </v-btn>
                                    <v-btn
                                        color="primary"
                                        variant="outlined"
                                        type="submit"
                                    >
                                        Save
                                    </v-btn>
                                </v-card-actions>
                            </form>
                            <div v-else>
                                <DashboardsClientDetail :item="editedItem" />
                                <v-card-actions>
                                    <v-spacer></v-spacer>
                                    <v-btn
                                        color="primary"
                                        variant="outlined"
                                        @click="close"
                                    >
                                        Close
                                    </v-btn>
                                </v-card-actions>
                            </div>
                        </v-card-text>
                    </v-card>
                </v-dialog>
                <DashboardsFormsDeleteConfirm
                    :showModal="dialogDelete"
                    @update:showModal="dialogDelete = $event"
                    :closeAction="closeDelete"
                    :deleteAction="deleteItemConfirm"
                />
            </v-toolbar>
        </template>
        <template v-slot:item.actions="{ item }">
            <DashboardsFormsActionButtons
                :item="item"
                data="client"
                @edit-item="editItem"
                @info-item="infoItem"
                @delete-item="deleteItem"
            />
        </template>
        <template v-slot:no-data>
            <div class="flex flex-col gap-5 items-center p-5">
                <h1>No data found!</h1>
                <v-btn color="primary" @click="initialize">Refresh</v-btn>
            </div>
        </template>
    </v-data-table-server>
</template>
