<template>
    <v-row class="gy-4" style="margin:0 !important">
        <v-col cols="12" md="8" class="flex flex-col gap-4">
            <v-data-table-server
                v-model:page="tableOptions.page"
                :headers="headers"
                :items="users"
                :items-length="totalUsers"
                :loading="loading"
                :search="search"
                item-value="id"
                show-select
                :hide-default-footer="true"
                @update:options="loadItems"
                :items-per-page-options="[{ value: 10, title: '10' }]"
                class="border p-5 rounded-xl"
            >
                <template v-slot:top>
                    <v-toolbar flat color="containerBg">
                        <v-toolbar-title>Users Table</v-toolbar-title>
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
                            <span class="text-gray-800">{{ pageStart }}-{{ pageEnd }} of {{ totalUsers }}</span>
                            <v-btn class="h-7 w-7" icon="mdi-chevron-double-left" variant="text" size="x-small" @click="goFirst" :disabled="tableOptions.page === 1" />
                            <v-btn class="h-7 w-7" icon="mdi-chevron-left" variant="text" size="x-small" @click="goPrev" :disabled="tableOptions.page === 1" />
                            <v-btn class="h-7 w-7" icon="mdi-chevron-right" variant="text" size="x-small" @click="goNext" :disabled="tableOptions.page * tableOptions.itemsPerPage >= totalUsers" />
                            <v-btn class="h-7 w-7" icon="mdi-chevron-double-right" variant="text" size="x-small" @click="goLast" :disabled="tableOptions.page * tableOptions.itemsPerPage >= totalUsers" />
                        </div>
                        <v-dialog v-model="dialog" max-width="700px" persistent>
                            <template v-slot:activator="{ props }">
                                <v-btn class="mx-5" color="primary" variant="outlined" dark v-bind="props"
                                    @click="openNewUserDialog">
                                    New User
                                </v-btn>
                            </template>
                            <v-card>
                                <v-card-title class="pa-4">
                                    <span class="text-h5">{{ formTitle }}</span>
                                </v-card-title>
                                <v-card-text class="pt-0">
                                    <UserForm ref="userFormCompRef" v-model="editedUser"
                                        @update:potential-validity="isFormPotentiallyValid = $event" />
                                </v-card-text>
                                <v-card-actions class="pa-4">
                                    <v-spacer></v-spacer>
                                    <v-btn color="blue-grey-lighten-1" variant="text" @click="close">
                                        Cancel
                                    </v-btn>
                                    <v-btn color="primary" variant="flat" @click="save" :loading="saving"
                                        :disabled="!isFormPotentiallyValid || saving">
                                        Save
                                    </v-btn>
                                </v-card-actions>
                            </v-card>
                        </v-dialog>
                        <UserDeleteConfirm :showModal="dialogDelete" @update:showModal="dialogDelete = $event"
                            @close-action="closeDelete" @delete-action="deleteItemConfirm" />
                    </v-toolbar>
                </template>

                <template v-slot:item.photo="{ item }">
                    <v-avatar size="40" class="my-1">
                        <v-img :src="item.photo || '/images/profile/user.png'"
                            :alt="`${item.first_name || ''} ${item.last_name || ''}`.trim()"></v-img>
                    </v-avatar>
                </template>

                <template v-slot:item.full_name="{ item }">
                    {{ `${item.first_name || ''} ${item.last_name || ''}`.trim() }}
                </template>

                <template v-slot:item.actions="{ item }">
                    <div class="flex flex-col items-start gap-2">
                        <div class="row-actions flex items-center gap-2">
                            <UserActionButtons :item="item" @edit-item="editItem" @info-item="infoItem" @delete-item="deleteItem" />
                        </div>
                        <v-btn
                            class="visit-btn"
                            size="x-small"
                            variant="outlined"
                            rounded="lg"
                            @click="infoItem(item)"
                        >{{ item.role}}</v-btn>
                    </div>
                </template>

                <template v-slot:item.number="{ index }">
                    {{ (tableOptions.page - 1) * tableOptions.itemsPerPage + index + 1 }}
                </template>

                <template v-slot:no-data>
                    <div class="d-flex flex-column align-center justify-center pa-4">
                        <v-icon size="x-large" color="grey-lighten-1" class="mb-2">mdi-database-off-outline</v-icon>
                        <div class="text-subtitle-1 grey--text text--darken-1 mb-2">No users found.</div>
                        <v-btn color="primary" @click="refreshTable">Refresh</v-btn>
                    </div>
                </template>
                <template v-slot:loading>
                    <v-skeleton-loader type="table-row@10"></v-skeleton-loader>
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
            <v-card v-if="infoShow" class="details-card mt-5" rounded="xl" elevation="1">
                <!-- Details card -->
                <UserDetail :item="editedUser" />
            </v-card>
            <v-card v-else class="details-card flex items-center justify-center p-8 mt-5" rounded="xl" elevation="1">
                <div class="text-center my-8">
                    <v-icon size="36 text-gray-500">mdi-account-outline</v-icon>
                    <div class="mt-2 font-medium">No User selected</div>
                    <div class="text-sm v">Select a user to read</div>
                </div>
            </v-card>
        </v-col>
    </v-row>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue';
import { useUserStore } from '@/stores/User';
import UserForm from '@/components/dashboards/User/Form.vue';
import UserDetail from '@/components/dashboards/User/Detail.vue';
import UserActionButtons from '@/components/dashboards/User/ActionButton.vue';
import UserDeleteConfirm from '@/components/dashboards/User/DeleteConfirm.vue';

const userStore = useUserStore();

const dialog = ref(false);
const dialogDelete = ref(false);
const infoShow = ref(false);
const loading = ref(true);
const saving = ref(false);
const search = ref('');
const userFormCompRef = ref(null);
const isFormPotentiallyValid = ref(false);

const headers = [
    { title: '#', key: 'number', sortable: false, width: '5%' },
    { title: 'Photo', key: 'photo', sortable: false, width: '10%' },
    { title: 'Full Name', key: 'full_name', sortable: true, width: '25%' },
    { title: 'Email', key: 'email', sortable: true, width: '35%' },
    { title: 'Actions', key: 'actions', sortable: false, width: '25%' },
];

const users = ref([]);
const totalUsers = ref(0);
const editedIndex = ref(-1);

const defaultUser = {
    id: null,
    username: '',
    first_name: '',
    last_name: '',
    email: '',
    role: '',
    photo: null,
    photoFile: null,
    // password: '' // Removed
};
const editedUser = ref({ ...defaultUser });
const userToDelete = ref(null);

const tableOptions = reactive({
    page: 1,
    itemsPerPage: 10,
    sortBy: [],
});

const pageStart = computed(() => {
    if (totalUsers.value === 0) return 0;
    return (tableOptions.page - 1) * tableOptions.itemsPerPage + 1;
});
const pageEnd = computed(() => {
    return Math.min(tableOptions.page * tableOptions.itemsPerPage, totalUsers.value);
});

function goFirst() { if (tableOptions.page > 1) tableOptions.page = 1; }
function goPrev() { if (tableOptions.page > 1) tableOptions.page--; }
function goNext() {
    const maxPage = Math.ceil(totalUsers.value / tableOptions.itemsPerPage);
    if (tableOptions.page < maxPage) tableOptions.page++;
}
function goLast() {
    const maxPage = Math.ceil(totalUsers.value / tableOptions.itemsPerPage);
    if (tableOptions.page < maxPage) tableOptions.page = maxPage;
}

watch(() => tableOptions.page, async (page) => {
    await loadItems({ page, itemsPerPage: tableOptions.itemsPerPage, sortBy: tableOptions.sortBy });
});

const formTitle = computed(() => {
    const name = editedUser.value.id ? `${editedUser.value.first_name || ''} ${editedUser.value.last_name || ''}`.trim() : 'New User';
    return editedIndex.value === -1 ? 'New User' : `Edit ${name || 'User'}`;
});

watch(dialog, (val) => {
    if (!val) close();
});
watch(dialogDelete, (val) => val || closeDelete());

async function loadItems(options) {
    loading.value = true;
    tableOptions.page = options.page;
    tableOptions.itemsPerPage = options.itemsPerPage;
    tableOptions.sortBy = options.sortBy;

    let apiSortBy = [];
    if (options.sortBy && options.sortBy.length > 0) {
        apiSortBy = options.sortBy.map(sort => sort.key === 'full_name' ? { ...sort, key: 'first_name' } : sort);
    }

    try {
        const data = await userStore.getUsers(
            '', // role
            '', // status
            {
            page: options.page,
            itemsPerPage: options.itemsPerPage,
            sortBy: apiSortBy,
            search: search.value,
            }
        );
        users.value = data.items;
        totalUsers.value = data.totalItems;
    } catch (err) {
        console.error("Failed to load users:", err);
        users.value = [];
        totalUsers.value = 0;
    } finally {
        loading.value = false;
    }
}

function refreshTable() {
    loadItems(tableOptions);
}

function openNewUserDialog() {
    editedIndex.value = -1;
    editedUser.value = { ...defaultUser }; // defaultUser no longer contains password
    infoShow.value = false;
    dialog.value = true;
}

function editItem(item) {
    editedIndex.value = users.value.findIndex(u => u.id === item.id);
    editedUser.value = { ...defaultUser, ...item, photoFile: null }; // defaultUser no longer contains password
    infoShow.value = false;
    dialog.value = true;
}

function infoItem(item) {
    editedUser.value = { ...defaultUser, ...item }; // defaultUser no longer contains password
    infoShow.value = true; // show details on the right panel only
}

function deleteItem(item) {
    userToDelete.value = { ...item };
    dialogDelete.value = true;
}

async function deleteItemConfirm() {
    if (!userToDelete.value?.id) return;
    try {
        await userStore.deleteUser(userToDelete.value.id);
        closeDelete();
        loadItems(tableOptions);
    } catch (error) {
        console.error("Failed to delete user:", error);
    }
}

function close() {
    dialog.value = false;
    // keep info panel state; only reset form-related state
    isFormPotentiallyValid.value = false;
    setTimeout(() => {
        editedUser.value = { ...defaultUser };
        editedIndex.value = -1;
    }, 300);
}

function closeDelete() {
    dialogDelete.value = false;
    setTimeout(() => {
        userToDelete.value = null;
    }, 300);
}

async function save() {
    if (infoShow.value) {
        close();
        return;
    }

    saving.value = true;

    if (userFormCompRef.value) {
        const isValid = await userFormCompRef.value.validateAndCheck();
        if (!isValid) {
            saving.value = false;
            return;
        }
    } else {
        console.error("UserForm component reference is not available.");
        saving.value = false;
        return;
    }

    try {
        const payload = { ...editedUser.value };
        if (!(payload.photoFile instanceof File)) {
            delete payload.photoFile;
        }
        // No password logic to handle here anymore

        if (editedIndex.value > -1 && editedUser.value.id) {
            await userStore.updateUser(editedUser.value.id, payload);
        } else {
            // For new users, your backend will need to handle password generation
            // or set a default if it's required.
            await userStore.addUser(payload);
        }
        close();
        loadItems(tableOptions);
    } catch (error) {
        console.error("Failed to save user:", error);
    } finally {
        saving.value = false;
    }
}
</script>

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