<script setup>
const props = defineProps({
    status: {
        required: false,
        default: 'eksternal',
        type: String,
    },
});

const userStore = useUserStore();

const dialog = ref(false);
const dialogDelete = ref(false);
const clientStore = useClientStore();
const infoShow = ref(false);
const loading = ref(true);
const search = ref(null);
const currentPage = ref(1);

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

onMounted(() => {
    try {
        userStore.fetchUser();
    } catch (e) {}
});

watch(dialog, val => {
    if (!val) close();
});
watch(dialogDelete, val => {
    if (!val) closeDelete();
});

// Reload data when page changes via top chevrons
watch(currentPage, async (page) => {
    await loadItems({ page, itemsPerPage: clients.page.per_page });
});

const loadItems = async ({ page, itemsPerPage }) => {
    loading.value = true;
    currentPage.value = page;

    const clientsData = await clientStore.fetchAll(
        page,
        search.value || '',
        status.value,
        itemsPerPage || clients.page.per_page
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
        1,
        search.value || '',
        status.value,
        clients.page.per_page
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

const pageStart = computed(() => {
    if (clients.page.count_result === 0) return 0;
    return (currentPage.value - 1) * clients.page.per_page + 1;
});
const pageEnd = computed(() => {
    return Math.min(currentPage.value * clients.page.per_page, clients.page.count_result);
});
const totalItems = computed(() => clients.page.count_result);

const goFirst = () => { if (currentPage.value > 1) currentPage.value = 1; };
const goPrev = () => { if (currentPage.value > 1) currentPage.value--; };
const goNext = () => { const maxPage = Math.ceil(totalItems.value / clients.page.per_page); if (currentPage.value < maxPage) currentPage.value++; };
const goLast = () => { const maxPage = Math.ceil(totalItems.value / clients.page.per_page); if (currentPage.value < maxPage) currentPage.value = maxPage; };
</script>

<template>
    <v-row class="gy-4" style="margin:0 !important">
        <v-col cols="12" md="8" class="flex flex-col gap-4">
            <v-data-table-server
                v-model:page="currentPage"
                :headers="headers"
                :items="clients.results"
                :loading="loading"
                :items-length="clients.page.count_result"
                :search="search"
                :hide-default-footer="true"
                show-select
                density="comfortable"
                @update:options="loadItems"
                class="border p-5 rounded-xl"
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
                                    clearable
                                ></v-text-field>
                                <div class="flex items-center gap-1 ml-3 text-xs font-medium">
                                    <span class="text-gray-800">{{ pageStart }}-{{ pageEnd }} of {{ totalItems }}</span>
                                    <v-btn class="h-7 w-7" icon="mdi-chevron-double-left" variant="text" size="x-small" @click="goFirst" :disabled="currentPage === 1" />
                                    <v-btn class="h-7 w-7" icon="mdi-chevron-left" variant="text" size="x-small" @click="goPrev" :disabled="currentPage === 1" />
                                    <v-btn class="h-7 w-7" icon="mdi-chevron-right" variant="text" size="x-small" @click="goNext" :disabled="currentPage * clients.page.per_page >= totalItems" />
                                    <v-btn class="h-7 w-7" icon="mdi-chevron-double-right" variant="text" size="x-small" @click="goLast" :disabled="currentPage * clients.page.per_page >= totalItems" />
                                </div>
                                <v-btn
                                    class="new-btn"
                                    v-bind="props"
                                    rounded="lg"
                                    variant="flat"
                                    :style="{ background:'#111', color:'#fff', fontWeight:600 }"
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
                    <div class="flex flex-col items-center gap-2 w-full">
                        <div class="row-actions flex items-center gap-2">
                            <v-btn icon="mdi-eye" variant="text" size="small" @click="infoItem(item)"></v-btn>
                            <v-btn icon="mdi-pencil" variant="text" size="small" @click="editItem(item)"></v-btn>
                            <v-btn icon="mdi-delete" color="error" variant="text" size="small" @click="deleteItem(item)"></v-btn>
                        </div>
                        <v-btn
                            class="visit-btn"
                            size="x-small"
                            variant="outlined"
                            rounded="lg"
                            @click="infoItem(item)"
                        >Visit</v-btn>
                    </div>
                </template>
                <template v-slot:no-data>
                    <div class="flex flex-col gap-5 items-center p-5">
                        <h1>No data found!</h1>
                        <v-btn color="primary" @click="initialize">Refresh</v-btn>
                    </div>
                </template>
            </v-data-table-server>
        </v-col>
        <v-col cols="12" md="4" class="flex flex-col gap-4">
            <v-card class="client-summary px-5 py-5" rounded="xl" elevation="1">
                <div class="flex items-center gap-4">
                    <v-avatar size="56">
                        <v-img :src="userStore.user?.photo || '/images/profile/user.png'" :alt="userStore.user?.full_name"></v-img>
                    </v-avatar>
                    <div class="flex flex-col mb-4">
                        <b class="font-semibold text-sm leading-4 mb-4">{{ userStore.user?.full_name || '...' }}</b>
                        <span class="text-xs">{{ userStore.user?.role || '' }}</span>
                    </div>
                    <v-btn icon="mdi-chevron-right" variant="text" size="small" class="text-white" @click="infoShow = false"></v-btn>
                </div>
                <div class="mt-3 text-xs opacity-95 truncate">Dasa Apprilindo Sentosa</div>
            </v-card>
            
            <v-card v-if="infoShow" class="details-card p-5 mt-5" rounded="xl" elevation="1">
                <!-- Details card -->
                <DashboardsClientDetail :item="editedItem" />
            </v-card>
            <v-card v-else class="details-card flex items-center justify-center p-8 mt-5" rounded="xl" elevation="1">
                <div class="text-center my-8">
                    <v-icon size="36 text-gray-500">mdi-account-outline</v-icon>
                    <div class="mt-2 font-medium">No {{ status == 'eksternal' ? 'End User' : 'Client' }} selected</div>
                    <div class="text-sm v">Select a {{ status == 'eksternal' ? 'end user' : 'client' }} to read</div>
                </div>
            </v-card>
        </v-col>
    </v-row>
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
.row-actions :deep(.v-btn) {
    border-radius: 8px;
    transition: background-color .15s ease, color .15s ease;
}
.row-actions :deep(.v-btn:hover) {
    background-color: #f3f4f6; /* gray-100 */
}
.visit-btn {
    font-size: 11px;
    line-height: 16px;
    padding: 0 10px;
    border-color: #c9cccf !important;
    color: #444 !important;
    background: #fff !important;
    text-transform: none;
    font-weight: 500;
    transition: background-color .15s ease;
}
.visit-btn:hover {
    background: #f3f4f6 !important;
}
.client-summary {
    background: linear-gradient(90deg, #ff6a00 0%, #ff7a00 100%);
    color: #fff;
    border-radius: 16px;
}
.details-card {
    background: #fff;
    border: 1px solid #eef0f2;
    border-radius: 16px;
    min-height: 260px;
}
</style>
