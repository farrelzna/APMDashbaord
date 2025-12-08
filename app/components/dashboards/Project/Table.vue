<script setup>
import { colorByStatus } from '@/utils/colorByStatus';

const dialog = ref(false);
const dialogDelete = ref(false);
const projectStore = useProjectStore();
const infoShow = ref(false);
const loading = ref(true);
const search = ref('');
const tableOptions = reactive({ page: 1, itemsPerPage: 10 });
const totalProjects = computed(() => projects.page.count_result || 0);
const pageStart = computed(() => {
    if (!totalProjects.value) return 0;
    return (tableOptions.page - 1) * tableOptions.itemsPerPage + 1;
});
const pageEnd = computed(() => Math.min(tableOptions.page * tableOptions.itemsPerPage, totalProjects.value));

function goFirst() { 
    if (tableOptions.page > 1) tableOptions.page = 1;
}

function goPrev() { 
    if (tableOptions.page > 1) tableOptions.page--;
}

function goNext() {
    const maxPage = Math.ceil(totalProjects.value / tableOptions.itemsPerPage);
    if (tableOptions.page < maxPage) tableOptions.page++;
}

function goLast() {
    const maxPage = Math.ceil(totalProjects.value / tableOptions.itemsPerPage);
    if (tableOptions.page < maxPage) tableOptions.page = maxPage;
}

// Tab filter state 
const activeTab = ref('all');

// Sort functionality
const currentSortValue = ref('date-desc'); // Default: newest first

const handleSort = (sortValue) => {
    currentSortValue.value = sortValue;
    const sorted = [...projects.results];
    
    switch (sortValue) {
        case 'name-asc':
            sorted.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
            break;
        case 'name-desc':
            sorted.sort((a, b) => (b.name || '').localeCompare(a.name || ''));
            break;
        case 'date-desc':
            sorted.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
            break;
        case 'date-asc':
            sorted.sort((a, b) => new Date(a.created_at || 0) - new Date(b.created_at || 0));
            break;
        case 'status-asc':
            sorted.sort((a, b) => (a.status || '').localeCompare(b.status || ''));
            break;
        case 'status-desc':
            sorted.sort((a, b) => (b.status || '').localeCompare(a.status || ''));
            break;
    }
    
    projects.results = sorted;
};

// Filter displayed results based on tab (client-side filter only)
const filteredProjects = computed(() => {
    if (activeTab.value === 'all') return projects.results;
    return projects.results.filter(project => {
        const status = project.status?.toLowerCase() || '';
        switch(activeTab.value) {
            case 'in-progress': return status === 'in progress';
            case 'pm-cm': return status === 'pm / cm' || status === 'pm' || status === 'cm';
            case 'on-hold': return status === 'on hold';
            case 'waiting-payment': return status === 'waiting payment';
            case 'almost-due': return status === 'almost due';
            case 'not-started': return status === 'not started yet';
            case 'maintenance': return status === 'maintenance';
            case 'opti': return status === 'opti';
            default: return true;
        }
    });
});

// Count projects per tab for badges
const tabCounts = computed(() => {
    const counts = {
        all: projects.results.length,
        'in-progress': 0,
        'pm-cm': 0,
        'on-hold': 0,
        'waiting-payment': 0,
        'almost-due': 0,
        'not-started': 0,
        'maintenance': 0,
        'opti': 0,
    };
    
    projects.results.forEach(project => {
        const status = project.status?.toLowerCase() || '';
        if (status === 'in progress') counts['in-progress']++;
        if (status === 'pm / cm' || status === 'pm' || status === 'cm') counts['pm-cm']++;
        if (status === 'on hold') counts['on-hold']++;
        if (status === 'waiting payment') counts['waiting-payment']++;
        if (status === 'almost due') counts['almost-due']++;
        if (status === 'not started yet') counts['not-started']++;
        if (status === 'maintenance') counts['maintenance']++;
        if (status === 'opti') counts['opti']++;
    });
    
    return counts;
});

// Tab configuration
const tabs = computed(() => [
    { label: 'All', value: 'all', count: tabCounts.value.all },
    { label: 'In Progress', value: 'in-progress', count: tabCounts.value['in-progress'] },
    { label: 'PM / CM', value: 'pm-cm', count: tabCounts.value['pm-cm'] },
    { label: 'On Hold', value: 'on-hold', count: tabCounts.value['on-hold'] },
    { label: 'Waiting Payment', value: 'waiting-payment', count: tabCounts.value['waiting-payment'] },
    { label: 'Almost Due', value: 'almost-due', count: tabCounts.value['almost-due'] },
    { label: 'Not Started Yet', value: 'not-started', count: tabCounts.value['not-started'] },
    { label: 'Maintenance', value: 'maintenance', count: tabCounts.value['maintenance'] },
    { label: 'Opti', value: 'opti', count: tabCounts.value['opti'] },
]);

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

// Watch search changes - reload data when user searches
watch(search, async () => {
    tableOptions.page = 1; // Reset to first page
    await loadItems({ page: 1, itemsPerPage: tableOptions.itemsPerPage });
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

// Export functionality
const exportData = (format) => {
    const data = projects.results.map(project => ({
        'PID': project.pid || '',
        'Project Name': project.name || '',
        'Client': project.customer_str?.name || '',
        'End User': project.end_user_str?.name || '',
        'PM': project.pm_str?.full_name || '',
        'Status': project.status || '',
        'Progress': project.progress ? `${project.progress.task_complete}/${project.progress.task_total}` : '',
    }));

    if (format === 'csv') {
        // CSV Export
        const headers = Object.keys(data[0]);
        const csvContent = [
            headers.join(','),
            ...data.map(row => headers.map(header => `"${row[header] || ''}"`).join(','))
        ].join('\n');
        
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `projects-${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
    } else if (format === 'excel') {
        // Excel Export (TSV with .xls extension)
        const headers = Object.keys(data[0]);
        const csvContent = [
            headers.join('\t'),
            ...data.map(row => headers.map(header => row[header] || '').join('\t'))
        ].join('\n');
        
        const blob = new Blob([csvContent], { type: 'application/vnd.ms-excel' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `projects-${new Date().toISOString().split('T')[0]}.xls`;
        link.click();
    }
};

onMounted(() => {
    initialize();
});

provide('refreshData', initialize);
</script>

<template>
    <div class="flex flex-col gap-4">
        <!-- Header Section with Search and Actions -->
        <SharedDataTableHeader
            :search="search"
            search-placeholder="Search projects..."
            :current-page="tableOptions.page"
            :items-per-page="tableOptions.itemsPerPage"
            :total-items="totalProjects"
            :page-start="pageStart"
            :page-end="pageEnd"
            action-label="New Project"
            action-icon="mdi-plus"
            :show-export="true"
            @update:search="search = $event"
            @go-first="goFirst"
            @go-prev="goPrev"
            @go-next="goNext"
            @go-last="goLast"
            @action-click="navigateTo('/dashboard/project/create')"
            @export="exportData"
        />

        <!-- Tab Bar Filter -->
        <div v-if="tabs.length > 0">
            <SharedDataTableTabBar v-model="activeTab" :tabs="tabs" />
        </div>

        <!-- Project List using SharedDataTableList -->
        <SharedDataTableList
            :items="filteredProjects"
            :loading="loading"
            title="Project List"
            :total-items="totalProjects"
            loading-text="Loading projects..."
            empty-icon="mdi-file-document-multiple-outline"
            empty-title="No projects found"
            empty-message="Try adjusting your search or filter"
            :show-sort="true"
            :current-sort="currentSortValue"
            @refresh="initialize"
            @sort="handleSort"
        >
            <template #items>
                <SharedDataTableListItem
                    v-for="project in filteredProjects"
                    :key="project.id"
                    :title="`${project.name}${project.pid ? ` (${project.pid})` : ''}`"
                    :subtitle="`Client: ${project.customer_str?.name || 'N/A'} • End User: ${project.end_user_str?.name || 'N/A'}`"
                    :is-selected="false"
                    :avatar-src="null"
                    :avatar-fallback="project.name?.charAt(0)?.toUpperCase() || '?'"
                    :show-checkbox="false"
                    :show-avatar="false"
                    :actions="[
                        { id: 'view', icon: 'mdi-eye-outline' },
                        { id: 'edit', icon: 'mdi-square-edit-outline' },
                        { id: 'delete', icon: 'mdi-trash-can-outline' }
                    ]"
                    @select="navigateTo(`/dashboard/project/${project.id}`)"
                    @action="(actionId) => {
                        if (actionId === 'view') navigateTo(`/dashboard/project/${project.id}`);
                        else if (actionId === 'edit') navigateTo(`/dashboard/project/update/${project.id}`);
                        else if (actionId === 'delete') deleteItem(project);
                    }"
                >
                    <template #content>
                        <div class="flex-1 min-w-0">
                            <div class="font-semibold text-sm truncate text-gray-900">{{ project.name }}</div>
                            <div class="flex flex-col gap-1 text-xs text-gray-500 mt-1">
                                <div class="flex items-center gap-2">
                                    <span class="font-medium">Client:</span>
                                    <span>{{ project.customer_str?.name || 'N/A' }}</span>
                                </div>
                                <div class="flex items-center gap-2">
                                    <span class="font-medium">End User:</span>
                                    <span>{{ project.end_user_str?.name || 'N/A' }}</span>
                                </div>
                                <div class="flex items-center gap-2">
                                    <span class="font-medium">PM:</span>
                                    <span>{{ project.pm_str?.full_name || 'Unassigned' }}</span>
                                </div>
                            </div>
                            <div class="flex items-center gap-2 mt-2">
                                <v-progress-linear
                                    v-if="project.progress"
                                    :model-value="project.progress.task_complete"
                                    :max="project.progress.task_total"
                                    color="primary"
                                    height="4"
                                    rounded
                                    class="flex-1 max-w-[150px]"
                                />
                                <span v-if="project.progress" class="text-xs text-gray-500">
                                    {{ project.progress.task_complete }}/{{ project.progress.task_total }}
                                </span>
                            </div>
                        </div>
                    </template>

                    <template #extra-button>
                        <div class="flex flex-col items-end gap-3">
                            <span v-if="project.pid" class="text-xs font-mono bg-gray-100 text-gray-700 px-2 py-0.5 rounded">
                                {{ project.pid }}
                            </span>
                            <v-btn
                                size="x-small"
                                :color="colorByStatus(project.status)"
                                variant="tonal"
                                rounded="lg"
                                @click.stop="navigateTo(`/dashboard/project/${project.id}`)"
                                class="whitespace-nowrap"
                            >
                                {{ project.status }}
                            </v-btn>
                        </div>
                    </template>
                </SharedDataTableListItem>
            </template>
        </SharedDataTableList>
    </div>

    <!-- Delete Confirmation Dialog -->
    <DashboardsFormsDeleteConfirm
        :showModal="dialogDelete"
        @update:showModal="dialogDelete = $event"
        :closeAction="closeDelete"
        :deleteAction="deleteItemConfirm"
        title="Project"
    />
</template>

<style scoped>
/* Styles inherited from SharedDataTableListItem component */
</style>
