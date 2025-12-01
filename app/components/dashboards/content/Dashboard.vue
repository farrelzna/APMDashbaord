<script setup>
import UiProjectCard from '@/components/shared/UiProjectCard.vue';
import UiParentCard from '@/components/shared/UiParentCard.vue';
import AvatarGroup from '@/components/ui-components/avatar/AvatarGroup.vue';
import ProjectStatistics from '@/components/dashboards/ProjectStatistics.vue';
import { toast } from 'vue-sonner';

const config = useRuntimeConfig();
const apiMedia = config.public.apiMedia;
const dashboardStore = useDashboardStore();
const projectStore = useProjectStore();
const { $formatDate, $getDayname } = useNuxtApp();
const userStore = useUserStore();
const dialogLogout = ref(false);
const isDashboard = ref(userStore.userGroupPermissions.includes('Dashboard'));
const props = defineProps({
    isScroll: Boolean, // Change to Boolean if it's a boolean prop
});

// Data
const dashboardData = ref(null);
const standupMeet = ref(null);
const standupDate = ref(null);
const projectsData = ref([]);
const items = ref([]);
const datas = ref([]);
// Grouped metrics summary
const summaryMetrics = computed(() =>
    datas.value.filter(d => ['Total Client', 'Total Project', 'Total User'].includes(d.title))
);
const teamMetrics = computed(() =>
    datas.value.filter(d => ['Engineer Internal', 'Engineer External'].includes(d.title))
);

// Computed: derive important project (earliest due date / first)
const importantProject = computed(() => {
    if (!dashboardData.value?.projects?.length) return null;
    return [...dashboardData.value.projects].sort(
        (a, b) => new Date(a.end_date) - new Date(b.end_date)
    )[0];
});

// Computed: simplified project list (sorted by end_date)
const projectList = computed(() => {
    if (!dashboardData.value?.projects?.length) return [];
    return [...dashboardData.value.projects].sort(
        (a, b) => new Date(a.end_date) - new Date(b.end_date)
    );
});


const handleLogout = () => {
    dialogLogout.value = true;
};

const confirmLogout = () => {
    userStore.logout();
    dialogLogout.value = false;
};

const hasDashboardData = computed(() => !!dashboardData.value);

onMounted(async () => {
    await fetchData();
    if (dashboardData.value) {
        setupRealtimeUpdates();
        if (props.isScroll) {
            setupAutoScroll();
        }
    }
});

// Project detail quick view dialog
const detailDialog = ref(false);
const detailLoading = ref(false);
const detailProject = ref(null);
const openProject = async (projectId) => {
    detailDialog.value = true;
    detailLoading.value = true;
    try {
        const data = await projectStore.searchById(projectId);
        const progress = {
            task_total: Array.isArray(data?.project_status) ? data.project_status.length : 0,
            task_complete: Array.isArray(data?.project_status)
                ? data.project_status.filter(s => (s.status || '').toLowerCase() === 'complete').length
                : 0,
        };
        detailProject.value = { ...data, progress };
    } catch (e) {
        toast.error('Failed to load project detail');
        detailDialog.value = false;
    } finally {
        detailLoading.value = false;
    }
};
const closeProject = () => {
    detailDialog.value = false;
    detailProject.value = null;
};

const filterAndFormatFinanceData = (projects = []) => {
    return projects.map(project => {
        if (project?.finance && Array.isArray(project.finance)) {
            project.finance = project.finance
                .filter(financeItem => financeItem?.date_of_payment)
                .sort(
                    (a, b) =>
                        new Date(a.date_of_payment) -
                        new Date(b.date_of_payment)
                )
                .slice(0, 3);
        }
        return project;
    });
};

const fetchData = async () => {
    await dashboardStore.fetchData();
    dashboardData.value = dashboardStore.dashboardData;
    if (dashboardData.value) {
        datas.value = [
            {
                title: 'Total Client',
                icon: 'mdi-handshake-outline',
                value: dashboardData.value.total_client,
            },
            {
                title: 'Total Project',
                icon: 'mdi-folder-multiple-outline',
                value: dashboardData.value.total_projects,
            },
            {
                title: 'Total User',
                icon: 'mdi-account-multiple-outline',
                value: dashboardData.value.total_user,
            },
            {
                title: 'Engineer Internal',
                icon: 'mdi-account-outline',
                value: dashboardData.value.total_engineer_internal,
            },
            {
                title: 'Engineer External',
                icon: 'mdi-account-arrow-right-outline',
                value: dashboardData.value.total_engineer_eksternal,
            },
        ];

        if (dashboardData.value.standup.length !== 0) {
            standupMeet.value = dashboardData.value.standup;
            const today = new Date().toISOString().split('T')[0];
            standupDate.value = standupMeet.value.filter(
                entry => entry.date === today
            );

            standupDate.value = standupMeet.value[0].date;
            items.value = standupMeet.value.flatMap(entry => {
                const details = entry.details;

                return details.flatMap(detail => {
                    const photoUrl =
                        detail.participant.photo ||
                        '/images/profile/user-1.jpg';
                    const fullName = detail.participant.full_name;

                    const workDetailsList = [];
                    if (detail.yesterday_work) {
                        workDetailsList.push(
                            `<li><b class="text-blue-600">Yesterday's Work:</b> ${detail.yesterday_work}</li>`
                        );
                    }
                    if (detail.today_work) {
                        workDetailsList.push(
                            `<li><b class="text-blue-600">Today's Work:</b> ${detail.today_work}</li>`
                        );
                    }
                    if (detail.impediments) {
                        workDetailsList.push(
                            `<li><b class="text-blue-600">Impediments:</b> ${detail.impediments}</li>`
                        );
                    }

                    const workDetails = `<ul>${workDetailsList.join('')}</ul>`;

                    return [
                        {
                            prependAvatar: photoUrl,
                            title: fullName,
                            subtitle: workDetails,
                        },
                    ];
                });
            });
        }

        projectsData.value = filterAndFormatFinanceData(
            dashboardData.value.projects
        );
    }
};

const setupRealtimeUpdates = () => {
    const intervalDelay = config.public.realtimeDelay;
    setInterval(async () => {
        await fetchData();
    }, intervalDelay);
};

const getDueDateColor = dueDate => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due - today;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays <= 0) {
        return { color: 'error', variant: 'flat' };
    } else if (diffDays <= 15) {
        return { color: 'error', variant: 'outlined' };
    } else if (diffDays <= 50) {
        return { color: 'warning', variant: 'flat' };
    } else {
        return { color: 'success', variant: 'outlined' };
    }
};

const getStatusColor = status => {
    switch (status.toLowerCase()) {
        case 'maintenance':
            return 'primary';
        case 'complete':
            return 'success';
        case 'in progress':
            return 'warning';
        case 'almost due':
            return 'error';
        default:
            return '';
    }
};

const scrollProjects = ref();
const scrollWorkload = ref();
const scrollStandup = ref();

const isDown = ref({
    project: false,
    workload: false,
    standup: false,
});

const autoScroll = (container, index) => {
    if (container.value) {
        if (
            container.value.scrollTop >=
                container.value.scrollHeight - container.value.clientHeight &&
            isDown.value[index]
        ) {
            isDown.value[index] = false;
        } else if (container.value.scrollTop === 0 && !isDown.value[index]) {
            isDown.value[index] = true;
        }

        if (isDown.value[index]) {
            container.value.scrollTop += 1;
        } else {
            container.value.scrollTop -= 1;
        }
    }
};

const setupAutoScroll = () => {
    setInterval(() => autoScroll(scrollProjects, 'project'), 100);
    setInterval(() => autoScroll(scrollWorkload, 'workload'), 100);
    setInterval(() => autoScroll(scrollStandup, 'standup'), 100);
};

await fetchData();
</script>

<template>
    <div
        class="absolute top-0 right-0 p-5 z-50 opacity-0 hover:opacity-100"
        v-if="isDashboard"
    >
        <v-btn variant="elevated" color="error" @click="handleLogout">
            Logout
        </v-btn>
    </div>

    <div v-if="hasDashboardData" class="w-full flex flex-col gap-4">
        <!-- Banner -->
        <v-card class="rounded-xl overflow-hidden" elevation="4">
            <div class="bg-orange-600 text-white p-6 md:p-8">
                <div class="text-sm mb-2">Dasa Aprlindo Sentosa</div>
                <h2 class="text-xl md:text-2xl font-bold leading-snug">
                    Most Reliable and Trusted<br />Technology Company
                </h2>
                <v-btn rounded="lg" class="mt-4"
                    :style="{
                        backgroundColor: '#000',
                        color: '#fff'
                    }" 
                    variant="flat" href="https://daas.co.id/"
                >
                    Join now <v-icon icon="mdi-arrow-right" size="sm" class="ml-1" />
                </v-btn>
            </div>
        </v-card>

        <v-row class="gy-4" style="margin:0 !important">
            <!-- Left Column -->
            <v-col cols="12" md="7" class="flex flex-col gap-4">
                <!-- Important Project Card -->
                <v-card v-if="importantProject" class="px-6 py-4 rounded-xl" elevation="2">
                    <div class="flex items-center justify-between w-full">
                        <div class="flex items-center gap-4 min-w-0">
                            <div size="56" class="bg-red-100 rounded-full flex justify-center items-center w-14 h-14">
                                <v-icon icon="mdi-alert" color="error" />
                            </div>
                            <div class="flex flex-col truncate">
                                <span class="text-[11px] text-gray-500 leading-4">Last/Due/Important Project</span>
                                <h3 class="font-bold text-lg leading-5 truncate uppercase">{{ importantProject.name }}</h3>
                                <span class="text-xs text-gray-500 uppercase tracking-wide truncate">{{ importantProject.customer_str.name }}</span>
                            </div>
                        </div>
                        <div class="flex flex-col items-end gap-1">
                            <span class="text-xs text-gray-600">Due date {{ importantProject.end_date }}</span>
                            <v-chip
                                size="small"
                                class="text-body-2"
                                :color="getStatusColor(importantProject.status)"
                                variant="outlined"
                            >
                                {{ importantProject.status }}
                            </v-chip>
                        </div>
                    </div>
                </v-card>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
                    <!-- analytics -->
                    <div class="flex flex-col h-full">
                        <v-card class="col-span-5 px-2 py-4 rounded-2xl h-full flex flex-col" elevation="2">
                            <v-row no-gutters>
                                <v-col cols="12" class="mb-2">
                                    <h4 class="font-semibold">Projects Analytics</h4>
                                </v-col>
                                <!-- Placeholder for analytics chart -->
                                <v-col cols="12" class="mb-4">
                                    <ProjectStatistics :data="dashboardData.project_status" />
                                </v-col>
                            </v-row>
                        </v-card>
                    </div>
                    <div class="flex flex-col gap-6 h-full">
                        <!-- summary -->
                        <v-card class="col-span-7 px-6 py-5 rounded-2xl flex-1" elevation="2">
                            <div class="grid grid-cols-3 gap-4 text-center">
                                <div
                                    v-for="datas in summaryMetrics"
                                    :key="datas.title"
                                    class="flex flex-col items-center"
                                >
                                    <span class="text-sm text-gray-600 font-medium">{{ datas.title }}</span>
                                    <div class="flex items-center mt-2">
                                        <v-icon :icon="datas.icon" size="30" class="mr-2" />
                                        <span class="text-xl font-semibold">{{ datas.value }}</span>
                                    </div>
                                </div>
                            </div>
                            <v-divider class="my-5" />
                            <h4 class="text-xl font-semibold mb-4">Team</h4>
                            <div class="flex">
                                <div
                                    v-for="datas in teamMetrics"
                                    :key="datas.title"
                                    class="flex flex-row items-center "
                                >
                                    <span class="text-sm text-gray-600 font-medium leading-4">{{ datas.title }}</span>
                                    <div class="flex items-center ml-4 mr-8">
                                        <v-icon :icon="datas.icon" size="30"/>
                                        <span class="text-xl font-semibold">{{ datas.value }}</span>
                                    </div>
                                </div>
                            </div>
                        </v-card>
                        <!-- Recent Activities -->
                        <v-card class="px-6 py-4 rounded-xl flex-1" elevation="2">
                            <h4 class="font-semibold mb-4">Recent Activities</h4>
                            <div class="flex flex-col gap-4">
                                <div class="flex justify-between items-start"> <!--v-for="act in recentActivities" :key="act.project + act.date"-->
                                    <div class="flex items-start gap-3">
                                        <v-avatar size="30" color="primary"></v-avatar>
                                        <div>
                                            <div class="text-sm font-medium">Type (Add Project)</div>
                                            <div class="text-xs text-gray-500">name user</div>
                                        </div>
                                    </div>
                                    <div class="text-right text-xs">
                                        <div>date 2025-10-12</div>
                                        <div class="text-green-600">description (success)</div>
                                    </div>
                                </div>
                            </div>
                        </v-card>
                    </div>
                </div>

                <!-- Engineer Workload -->
                <v-card v-if="dashboardData?.engineers" class="px-6 py-4 rounded-xl" elevation="2">
                    <h4 class="font-semibold mb-4">Engineer's workload</h4>
                    <!-- Scrollable workload list -->
                    <div class="flex flex-col gap-4 max-h-80 overflow-y-auto pr-2" ref="scrollWorkload">
                        <div
                            v-for="eng in dashboardData.engineers"
                            :key="eng.engineer.id"
                            class="flex justify-between items-center"
                        >
                            <div class="flex items-center gap-3">
                                <v-avatar :image="apiMedia + eng.engineer.photo" size="40" />
                                <div>
                                    <div class="font-medium">{{ eng.engineer.full_name }}</div>
                                    <div class="text-xs text-gray-500">{{ eng.engineer.job_titles }} - <strong>{{ eng.projects }}</strong> Project</div>
                                </div>
                            </div>
                            <div class="flex items-center gap-2 w-56">
                                <v-progress-linear :model-value="eng.workload" height="6" rounded />
                                <span class="text-xs">{{ eng.workload }}%</span>
                            </div>
                        </div>
                    </div>
                </v-card>
            </v-col>

            <!-- Right Column: Project List -->
            <v-col cols="12" md="5" class="flex flex-col gap-4">
                <v-card class="p-5" elevation="2">
                    <h4 class="font-semibold m-4">Project list</h4>
                    <v-divider></v-divider>
                    <div class="flex flex-col gap-4 md:gap-6" ref="scrollProjects">
                        <div
                             v-for="project in dashboardData.projects"
                            :key="project.id"
                            v-auto-animate
                            class=" p-3 md:p-4 cursor-pointer"
                            @click="openProject(project.id)"
                        >
                            <UiProjectCard
                                :projectData="project"
                                :color="getStatusColor(project.status)"
                            >
                                <div class="w-full flex items-center justify-between mb-2">
                                    <div class="flex gap-2 justify-center items-center">
                                        <span>PM: </span>
                                        <v-avatar
                                            v-if="project.pm_str"
                                            :image="
                                                config.public.apiMedia +
                                                project.pm_str.photo
                                            "
                                            class="border-black border-2"
                                        ></v-avatar>
                                        <span v-else>-</span>
                                    </div>
                                    <div class="flex gap-2 justify-center items-center">
                                        <span>Team: </span>
                                        <AvatarGroup
                                            :users="project.engineer"
                                            :pm="project.pm_str"
                                        />
                                    </div>
                                    <v-chip
                                        class="text-body-2"
                                        :color="getStatusColor(project.status)"
                                        :variant="['in progress','complete'].includes(project.status.toLowerCase()) ? 'outlined' : 'flat'"
                                        size="small"
                                    >
                                        {{ project.status }}
                                    </v-chip>
                                </div>
                                <div class="py-1 border-t">
                                    <div class="flex p-2">
                                        <div class="w-24 pr-2 pt-2 text-sm font-medium">Finance:</div>
                                        <v-timeline density="compact" side="end" class="flex-1">
                                            <v-timeline-item
                                                v-for="finance in project.finances"
                                                :key="finance.id || finance.name"
                                                size="small"
                                                :dot-color="getDueDateColor(finance.date_of_payment).color"
                                            >
                                                <div class="flex items-center justify-between gap-4">
                                                    <div class="flex flex-col">
                                                        <strong>{{ finance.name }}</strong>
                                                        <span class="text-xs font-thin">{{ finance.status }}</span>
                                                    </div>
                                                    <v-chip
                                                        :color="getDueDateColor(finance.date_of_payment).color"
                                                        variant="flat"
                                                        class="text-body-6"
                                                        size="small"
                                                    >
                                                        <span class="text-xs">Due date {{ finance.date_of_payment }}</span>
                                                    </v-chip>
                                                </div>
                                            </v-timeline-item>
                                        </v-timeline>
                                    </div>
                                </div>
                                <div class="py-1 border-t">
                                    <div class="flex p-2">
                                        <div class="w-24 pr-2 pt-2 text-sm font-medium leading-4">Project<br/>Status:</div>
                                        <v-timeline density="compact" side="end" class="flex-1">
                                            <v-timeline-item
                                                v-for="status in project.project_status"
                                                :key="status.id || status.description + status.date_submit"
                                                size="small"
                                                :dot-color="getStatusColor(status.status)"
                                            >
                                                <div class="flex items-center justify-between gap-4">
                                                    <div class="flex flex-col">
                                                        <strong>{{ status.description }}</strong>
                                                        <span class="text-xs font-thin">{{ $formatDate(status.date_submit) }}</span>
                                                    </div>
                                                    <v-chip
                                                        :color="getStatusColor(status.status)"
                                                        :variant="['in progress','complete'].includes(status.status.toLowerCase()) ? 'outlined' : 'flat'"
                                                        size="small"
                                                        class="text-body-6"
                                                    >
                                                        <span class="text-xs">{{ status.status }}</span>
                                                    </v-chip>
                                                </div>
                                            </v-timeline-item>
                                        </v-timeline>
                                    </div>
                                </div>
                            </UiProjectCard>
                        </div>
                        <div v-if="!projectList.length" class="text-center p-4 text-sm text-gray-500">No project found</div>
                    </div>
                </v-card>
            </v-col>
        </v-row>
    </div>

    <!-- Loading Skeleton -->
    <div class="w-full flex flex-col gap-2" v-else>
        <v-row>
            <v-col>
                <v-skeleton-loader type="image"></v-skeleton-loader>
            </v-col>
            <v-col>
                <v-skeleton-loader type="image"></v-skeleton-loader>
            </v-col>
            <v-col>
                <v-skeleton-loader type="image"></v-skeleton-loader>
            </v-col>
            <v-col>
                <v-skeleton-loader type="image"></v-skeleton-loader>
            </v-col>
        </v-row>
        <div class="grid gap-2">
            <div class="col-start-1 col-end-3 row-start-1 row-end-2">
                <v-skeleton-loader type="image"></v-skeleton-loader>
            </div>
            <div class="col-start-3 col-end-5 row-start-1 row-end-3">
                <v-skeleton-loader
                    type="ossein"
                    class="h-full"
                ></v-skeleton-loader>
            </div>
            <div class="col-start-1 col-end-3 row-start-2 row-end-3">
                <v-skeleton-loader
                    type="image"
                    class="h-full"
                ></v-skeleton-loader>
            </div>
            <div class="col-start-1 col-end-5 row-start-3">
                <v-skeleton-loader
                    type="ossein"
                    class="h-full"
                ></v-skeleton-loader>
            </div>
        </div>
    </div>

    <v-dialog v-model="dialogLogout" max-width="500">
        <v-card class="p-5">
            <v-card-title class="leading-3 text-center mt-5"
                >Logout Confirmation</v-card-title
            >
            <v-card-text class="text-center">
                Are you sure you want to logout?
            </v-card-text>
            <v-card-actions class="flex justify-center items-center mb-5">
                <v-btn
                    text
                    @click="dialogLogout = false"
                    color="error"
                    variant="outlined"
                    >Cancel</v-btn
                >
                <v-btn color="error" variant="flat" @click="confirmLogout"
                    >Confirm</v-btn
                >
            </v-card-actions>
        </v-card>
    </v-dialog>

    <!-- Project Quick View Dialog -->
    <v-dialog
        v-model="detailDialog"
        max-width="900"
        location="right"
        scrim="false"
        transition="dialog-right-transition"
        scrollable
        class="dialog-right-fixed"
    >
        <v-card class="rounded-l-xl overflow-hidden h-screen">
            <v-progress-linear v-if="detailLoading" indeterminate color="primary" height="3" />
            <v-card-text class="p-6 overflow-y-auto h-full" v-if="detailProject">
                <!-- Header similar to detail page -->
                <div class="flex items-start justify-between gap-4">
                    <div class="flex items-center gap-4 min-w-0">
                        <div class="w-16 h-16 rounded-lg shadow flex justify-center items-center text-white p-0 overflow-hidden">
                            <img
                                v-if="detailProject.end_user_str"
                                :src="`${config.public.apiMedia}/${detailProject.end_user_str.logo}`"
                                :alt="detailProject.name"
                                class="w-full h-full object-contain"
                            />
                            <v-skeleton-loader v-else type="image" class="w-full" />
                        </div>
                        <div class="min-w-0">
                            <h2 class="text-xl font-bold leading-tight truncate uppercase">
                                {{ detailProject.name }}
                            </h2>
                            <div class="text-sm text-gray-500 truncate" v-if="detailProject.end_user_str">
                                {{ detailProject.end_user_str.name }}
                            </div>
                        </div>
                    </div>
                    <div class="flex items-center gap-2">
                        <span class="text-xs text-gray-600" v-if="detailProject.end_date">Due date {{ detailProject.end_date }}</span>
                        <v-chip :color="getStatusColor(detailProject.status)" variant="outlined" size="small">
                            {{ detailProject.status }}
                        </v-chip>
                        <v-btn icon="mdi-close" variant="text" @click="closeProject"></v-btn>
                    </div>
                </div>

                <v-divider class="my-4" />

                <!-- PM + Team Row -->
                <div class="flex items-center justify-between mb-2 flex-wrap gap-4">
                    <div class="flex gap-2 items-center">
                        <span class="text-sm">PM:</span>
                        <v-avatar v-if="detailProject.pm_str" :image="config.public.apiMedia + detailProject.pm_str.photo" size="32" class="border-black border-2"></v-avatar>
                        <span v-else class="text-sm text-gray-400">-</span>
                    </div>
                    <div class="flex gap-2 items-center">
                        <span class="text-sm">Team:</span>
                        <AvatarGroup :users="detailProject.engineer" :pm="detailProject.pm_str" />
                    </div>
                    <v-chip :color="getStatusColor(detailProject.status)" size="small" class="ml-auto">{{ detailProject.status }}</v-chip>
                </div>

                <v-divider class="my-2" />

                <!-- Finance timeline -->
                <div class="py-2">
                    <div class="flex p-2">
                        <div class="w-28 pr-2 pt-2 text-sm font-medium">Finance:</div>
                        <v-timeline density="compact" side="end" class="flex-1 pill-timeline">
                            <v-timeline-item
                                v-for="finance in (detailProject.finance || detailProject.finances || [])"
                                :key="finance.id || finance.name"
                                size="small"
                                :dot-color="getDueDateColor(finance.date_of_payment).color"
                            >
                                <div class="flex items-center justify-between gap-4">
                                    <div class="flex flex-col">
                                        <strong>{{ finance.name }}</strong>
                                        <span class="text-xs font-thin">{{ finance.status }}</span>
                                    </div>
                                    <v-chip :color="getDueDateColor(finance.date_of_payment).color" variant="flat" size="small">
                                        <span class="text-xs">Due date {{ $formatDate(finance.date_of_payment) }}</span>
                                    </v-chip>
                                </div>
                            </v-timeline-item>
                        </v-timeline>
                    </div>
                </div>

                <!-- Project Status timeline -->
                <div class="py-2 border-t">
                    <div class="flex p-2">
                        <div class="w-28 pr-2 pt-2 text-sm font-medium leading-4">Project<br/>Status:</div>
                        <v-timeline density="compact" side="end" class="flex-1 pill-timeline">
                            <v-timeline-item
                                v-for="status in (detailProject.project_status || [])"
                                :key="status.id || status.description + status.date_submit"
                                size="small"
                                :dot-color="getStatusColor(status.status)"
                            >
                                <div class="flex items-center justify-between gap-4">
                                    <div class="flex flex-col">
                                        <strong>{{ status.description }}</strong>
                                        <span class="text-xs font-thin">{{ $formatDate(status.date_submit) }}</span>
                                    </div>
                                    <v-chip :color="getStatusColor(status.status)" :variant="['in progress','complete'].includes((status.status||'').toLowerCase()) ? 'outlined' : 'flat'" size="small">
                                        <span class="text-xs">{{ status.status }}</span>
                                    </v-chip>
                                </div>
                            </v-timeline-item>
                        </v-timeline>
                    </div>
                </div>

                <v-divider class="my-4" />

                <!-- Informations and Engineers sections (same as detail page) -->
                <div class="grid grid-cols-1 gap-4">
                    <dashboards-project-informations :project="detailProject" />
                </div>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<style>
.dialog-right-fixed .v-overlay__content {
    position: fixed !important;
    right: 0 !important;
    height: 100vh !important;
    margin: 0 !important;
    transform: none !important;
}

.v-timeline--vertical.v-timeline
    .v-timeline-item:first-child
    .v-timeline-divider,
.v-timeline--vertical.v-timeline
    .v-timeline-item:first-child
    .v-timeline-item__body,
.v-timeline--vertical.v-timeline
    .v-timeline-item:first-child
    .v-timeline-item__opposite {
    padding-block-start: 12px !important;
}

.v-timeline--vertical.v-timeline
    .v-timeline-item:last-child
    .v-timeline-divider,
.v-timeline--vertical.v-timeline
    .v-timeline-item:last-child
    .v-timeline-item__body,
.v-timeline--vertical.v-timeline
    .v-timeline-item:last-child
    .v-timeline-item__opposite {
    padding-block-end: 12px !important;
}

.v-timeline--vertical.v-timeline {
    grid-row-gap: 12px !important;
}

.v-timeline-item__body {
    padding: 0 10px !important;
    width: 100%;
}
</style>
