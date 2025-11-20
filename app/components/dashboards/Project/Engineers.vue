<script setup>
const props = defineProps({
    engineers: Object,
    engineer_eksternal: Object,
});

const config = useRuntimeConfig();
const search = ref('');

const combinedEngineers = computed(() => {
    return props.engineers.concat(props.engineer_eksternal);
});

const items = computed(() =>
    combinedEngineers.value.map((engineer, index) => ({
        no: index + 1,
        engineer: engineer.engineer,
        role: engineer.engineer || '-',
        workload: engineer.workload || '-',
        status: engineer.workload_status || '-',
    }))
);

const headers = ref([
    { title: 'No', key: 'no', sortable: true },
    { title: 'Engineer', key: 'engineer', sortable: false },
    { title: 'Role', key: 'role.job_titles', sortable: false },
    { title: 'Workload', key: 'workload', sortable: true },
    { title: 'Status', key: 'status', sortable: true },
]);
</script>

<template>
    <v-card flat v-if="items">
        <v-card-title class="d-flex align-center pe-2">
            <span class="text-sm font-bold">Engineers</span>
            <v-spacer></v-spacer>
        </v-card-title>

        <v-divider></v-divider>

        <v-data-table
            v-model:search="search"
            :items="items"
            :headers="headers"
            item-key="no"
            class="elevation-1"
        >
            <template v-slot:item.engineer="{ index, item }">
                <div class="flex gap-3">
                    <v-avatar v-if="item.engineer">
                        <v-img
                            :src="
                                config.public.apiMedia +
                                '/' +
                                item.engineer.photo
                            "
                            cover
                        ></v-img>
                    </v-avatar>
                    <div class="flex flex-col" v-if="item.engineer">
                        <span class="text-xs font-bold">
                            {{ item.engineer.full_name }}
                        </span>
                        <span class="text-xs font-thin text-gray-400">
                            {{
                                item.engineer.role + ' ' + item.engineer.status
                            }}
                        </span>
                    </div>
                    <div class="flex flex-col" v-else>
                        <span class="text-xs font-bold">
                            {{ combinedEngineers[index].full_name }}
                        </span>
                        <span class="text-xs font-thin text-gray-400">
                            Engineer Eksternal
                        </span>
                    </div>
                </div>
            </template>

            <template v-slot:item.status="{ item }">
                <v-chip :color="colorByStatus(item.status)" size="small">{{
                    item.status
                }}</v-chip>
            </template>
        </v-data-table>
    </v-card>
</template>
