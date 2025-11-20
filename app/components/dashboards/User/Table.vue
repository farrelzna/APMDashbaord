<template>
    <v-container fluid>
        <v-data-table-server v-model:items-per-page="tableOptions.itemsPerPage" :headers="headers" :items="users"
            :items-length="totalUsers" :loading="loading" :search="search" class="elevation-1" item-value="id"
            @update:options="loadItems" :items-per-page-options="[{ value: 10, title: '10' }]">
            <template v-slot:top>
                <v-toolbar flat color="containerBg">
                    <v-toolbar-title>Users Table</v-toolbar-title>
                    <v-spacer></v-spacer>
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
                                <UserForm ref="userFormCompRef" v-if="!infoShow" v-model="editedUser"
                                    @update:potential-validity="isFormPotentiallyValid = $event" />
                                <UserDetail v-else :item="editedUser" />
                            </v-card-text>
                            <v-card-actions class="pa-4">
                                <v-spacer></v-spacer>
                                <v-btn color="blue-grey-lighten-1" variant="text" @click="close">
                                    {{ infoShow ? 'Close' : 'Cancel' }}
                                </v-btn>
                                <v-btn v-if="!infoShow" color="primary" variant="flat" @click="save" :loading="saving"
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
                <UserActionButtons :item="item" @edit-item="editItem" @info-item="infoItem" @delete-item="deleteItem" />
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
    </v-container>
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
    { title: 'Email', key: 'email', sortable: true, width: '25%' },
    { title: 'Role', key: 'role', sortable: true, width: '15%' },
    { title: 'Actions', key: 'actions', sortable: false, align: 'end', width: '15%' },
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

const formTitle = computed(() => {
    if (infoShow.value) return 'User Details';
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
    infoShow.value = true;
    dialog.value = true;
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
    infoShow.value = false;
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