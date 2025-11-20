<template>
    <v-container>
        <v-row>
            <v-col cols="12" md="12">
                <v-card class="elevation-0">
                    <v-card-title>Task Form</v-card-title>
                    <v-card-text>
                        <v-form v-model="valid">
                            <v-text-field
                                label="Description"
                                v-model="task.description"
                            ></v-text-field>

                            <v-select
                                label="Status"
                                v-model="task.status"
                                :items="statuses"
                            ></v-select>

                            <v-textarea
                                label="Note"
                                v-model="task.note"
                            ></v-textarea>

                            <v-btn color="primary" @click="saveTask">
                                {{ isEditing ? 'Save Task' : 'Add Task' }}
                            </v-btn>
                        </v-form>
                    </v-card-text>
                </v-card>
            </v-col>

            <!-- <v-col cols="12" md="6">
                <v-card class="elevation-0">
                    <v-card-title>Subtask Form</v-card-title>
                    <v-card-text>
                        <v-form v-model="validsub">
                            <v-text-field
                                label="Description"
                                v-model="sub.description"
                            ></v-text-field>

                            <v-select
                                label="Status"
                                v-model="sub.status"
                                :items="statuses"
                            ></v-select>

                            <v-textarea
                                label="Note"
                                v-model="sub.note"
                            ></v-textarea>

                            <v-btn color="primary" @click="addSubtask"
                                >Add Subtask</v-btn
                            >
                        </v-form>
                    </v-card-text>
                </v-card>
            </v-col> -->
        </v-row>

        <v-divider></v-divider>

        <v-row>
            <v-col cols="12">
                <v-data-table
                    :headers="headers"
                    :items="formData.project_status"
                    item-value="description"
                    show-expand
                    class="elevation-0"
                    expand-on-click
                >
                    <template v-slot:item.checkbox="{ item }">
                        <v-checkbox
                            :model-value="item.status === 'Complete'"
                            density="compact"
                            class="h-10"
                            hide-details
                            disabled
                        />
                    </template>
                    <template v-slot:item.status="{ item }">
                        <v-chip :color="colorByStatus(item.status)">
                            {{ item.status }}
                        </v-chip>
                    </template>

                    <template v-slot:item.actions="{ item, index }">
                        <v-btn
                            variant="plain"
                            class="mb-5"
                            color="warning"
                            icon="mdi-pencil-outline"
                            @click="editTask(index)"
                        ></v-btn>
                        <v-btn
                            variant="plain"
                            class="mb-5"
                            color="error"
                            icon="mdi-minus-circle"
                            @click="deleteTask(item, index)"
                        ></v-btn>
                    </template>
                </v-data-table>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup>
const props = defineProps({
    formData: Object, // Expecting `formData` as a prop
    errors: Object, // If there are validation errors
    withTemplate: Boolean,
});

const defaultTasks = [
    {
        description: 'Initiate Project',
        status: 'In Progress',
        note: '',
    },
    {
        description: 'Plan Project',
        status: 'In Progress',
        note: '',
    },
    {
        description: 'Execute Project',
        status: 'In Progress',
        note: '',
    },
    {
        description: 'Monitor Project',
        status: 'In Progress',
        note: '',
    },
    {
        description: 'Close Project',
        status: 'In Progress',
        note: '',
    },
];

const task = ref({
    description: '',
    status: '',
    note: '',
});

const sub = ref({
    description: '',
    status: '',
});

const isEditing = ref(false); // Track if a task is being edited
const editingIndex = ref(null); // Store the index of the task being edited

const statuses = [
    'Complete',
    'In Progress',
    'PM / CM',
    'On Hold',
    'Waiting Payment',
    'Almost Due',
    'Not Started Yet',
    'Maintenance',
    'Opti',
];

const headers = [
    { title: '', key: 'checkbox', width: '1%' },
    { title: 'Description', key: 'description' },
    { title: 'Status', key: 'status' },
    { title: 'Actions', key: 'actions' },
];

const valid = ref(false);
const validsub = ref(false);

const addTask = () => {
    if (valid.value) {
        if (!props.formData.project_status) {
            props.formData.project_status = [];
        }

        props.formData.project_status.push({ ...task.value });

        task.value.description = '';
        task.value.status = '';
        task.value.note = '';
    }
};

// Function to save task (either edit or add)
const saveTask = () => {
    if (valid.value) {
        if (isEditing.value) {
            // Update the task
            props.formData.project_status[editingIndex.value] = {
                ...task.value,
            };
            isEditing.value = false;
            editingIndex.value = null;
        } else {
            // Add new task
            addTask();
        }

        // Clear the form
        task.value.description = '';
        task.value.status = '';
        task.value.note = '';
    }
};

// Function to edit a task
const editTask = index => {
    // Populate the form with the selected task data
    task.value = { ...props.formData.project_status[index] };
    isEditing.value = true;
    editingIndex.value = index;
};

// Function to mark a task for deletion by adding delete_id
const deleteTask = (item, index) => {
    if (!props.formData.project_status.delete_id) {
        props.formData.project_status.delete_id = [];
    }

    if (item.id) {
        props.formData.project_status.delete_id.push(item.id);
    }

    // Optionally, you can still remove the task from the UI (or leave it visible)
    props.formData.project_status.splice(index, 1);
};

onMounted(() => {
    // Check if formData.project_status is empty and assign default tasks if so
    if (
        !props.formData.project_status ||
        props.formData.project_status.length === 0
    ) {
        props.formData.project_status = [...defaultTasks];
    }
});
</script>
