<template>
    <v-data-table
        v-model:selection="selected"
        :headers="headers"
        :items="tasks"
        item-value="name"
        items-per-page="5"
        return-object
        expand-on-click
        show-expand
        hover
        :expanded.sync="expanded"
        density="compact"
    >
        <!-- Status column with colored chip -->
        <template v-slot:item.status="{ item }">
            <v-chip size="small" :color="colorByStatus(item.status)">
                {{ item.status }}
            </v-chip>
        </template>

        <!-- Row number -->
        <template v-slot:item.number="{ item }">
            {{ tasks.indexOf(item) + 1 }}
        </template>

        <!-- Checkbox column -->
        <template v-slot:item.checkbox="{ item }">
            <v-checkbox
                :model-value="item.status === 'Complete'"
                density="compact"
                class="h-10"
                hide-details
                disabled
            />
        </template>

        <!-- Expanded row with notes and children -->
        <template v-slot:expanded-row="{ columns, item }">
            <tr v-if="item.note">
                <td :colspan="columns.length">
                    <div class="p-2 bg-bgprimary rounded">
                        <strong>Note : </strong>
                        <span>{{ item.note }}</span>
                    </div>
                </td>
            </tr>
            <tr v-for="child in getChildren(item)" :key="child.name">
                <td>
                    <v-checkbox
                        v-model="child.selected"
                        density="compact"
                        class="h-10"
                    />
                </td>
                <td>{{ child.name }}</td>
                <td>
                    <v-chip size="small" :color="colorByStatus(child.status)">
                        {{ child.status }}
                    </v-chip>
                </td>
                <td>{{ child.note }}</td>
            </tr>
        </template>
    </v-data-table>
</template>

<script setup>
const props = defineProps({
    tasks: Object,
});

const headers = ref([
    { title: '#', key: 'number', width: '1%' },
    { title: '', key: 'checkbox', width: '1%', sortable: false },
    { title: 'Task', key: 'description' },
    { title: 'Status', key: 'status' },
]);

const selected = ref([]);
const expanded = ref([]);

const tasks = computed(() => {
    return props.tasks;
});

function getChildren(parent) {
    return parent.children || [];
}
</script>
