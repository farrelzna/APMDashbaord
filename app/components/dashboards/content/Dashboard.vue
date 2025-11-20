<script setup>
import UiProjectCard from '@/components/shared/UiProjectCard.vue';
import UiParentCard from '@/components/shared/UiParentCard.vue';
import AvatarGroup from '@/components/ui-components/avatar/AvatarGroup.vue';
import ProjectStatistics from '@/components/dashboards/ProjectStatistics.vue';

const config = useRuntimeConfig();
const apiMedia = config.public.apiMedia;
const dashboardStore = useDashboardStore();
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
const items = ref(null);
const datas = ref([]);

const handleLogout = () => {
    dialogLogout.value = true;
};

const confirmLogout = () => {
    userStore.logout();
    dialogLogout.value = false;
};

onMounted(async () => {
    await fetchData();
    if (dashboardData.value) {
        setupRealtimeUpdates();
        if (props.isScroll) {
            setupAutoScroll();
        }
    }
});

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
                title: 'Total Projects',
                icon: 'mdi-folder-multiple-outline',
                value: dashboardData.value.total_projects,
            },
            {
                title: 'Engineer Internal',
                icon: 'mdi-account-outline',
                value: dashboardData.value.total_engineer_internal,
            },
            {
                title: 'Engineer Eksternal',
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
    <v-row
        class="w-full h-screen max-sm:h-auto"
        :class="isScroll ? 'overflow-hidden' : 'overflow-visible'"
        style="margin: 0 !important"
        v-if="dashboardData.length !== 0"
    >
        <v-col
            class="max-h-full"
            :class="isDashboard ? '' : 'order-md-last'"
            v-if="dashboardData.projects.length !== 0"
        >
            <div
                class="flex flex-col gap-2 h-full overflow-auto"
                ref="scrollProjects"
            >
                <div
                    class="shadow-lg rounded-xl"
                    v-for="project in dashboardData.projects"
                    :key="project.id"
                    v-auto-animate
                >
                    <UiProjectCard
                        :projectData="project"
                        :color="getStatusColor(project.status)"
                    >
                        <div class="w-full flex items-center justify-between">
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
                                :class="'text-body-2'"
                                :color="getDueDateColor(project.end_date).color"
                                size="small"
                                :variant="
                                    getDueDateColor(project.end_date).variant
                                "
                            >
                                Due date {{ project.end_date }}
                            </v-chip>
                        </div>
                        <div class="py-1 border-t">
                            <v-divider v-if="project.finances.length">
                                <strong>Finance</strong>
                            </v-divider>
                            <span class="pt-5 font-bold">Finance</span>
                            <div
                                v-for="finance in project.finances"
                                :key="finance"
                            ></div>
                            <v-timeline density="compact" side="end">
                                <v-timeline-item
                                    size="small"
                                    class="relative"
                                    v-for="finance in project.finances"
                                    :dot-color="
                                        getDueDateColor(finance.date_of_payment)
                                            .color
                                    "
                                >
                                    <div
                                        class="d-flex items-center gap-2 justify-between"
                                    >
                                        <div class="flex flex-col">
                                            <strong>{{ finance.name }}</strong>
                                            <span class="font-thin text-xs">{{
                                                finance.status
                                            }}</span>
                                        </div>
                                        <v-chip
                                            variant="flat"
                                            :color="
                                                getDueDateColor(
                                                    finance.date_of_payment
                                                ).color
                                            "
                                            :variant="
                                                getDueDateColor(
                                                    finance.date_of_payment
                                                ).variant
                                            "
                                            class="text-body-6"
                                            size="small"
                                        >
                                            <span class="text-xs">
                                                Due date
                                                {{ finance.date_of_payment }}
                                            </span>
                                        </v-chip>
                                    </div>
                                </v-timeline-item>
                            </v-timeline>
                            <v-divider v-if="project.project_status.length">
                                <strong>Project Status</strong>
                            </v-divider>
                            <v-timeline density="compact" side="end">
                                <v-timeline-item
                                    :dot-color="getStatusColor(status.status)"
                                    size="small"
                                    v-for="status in project.project_status"
                                >
                                    <div
                                        class="d-flex items-center gap-2 justify-between"
                                    >
                                        <strong>{{
                                            $formatDate(status.date_submit)
                                        }}</strong>
                                        <div class="w-40">
                                            <strong>{{
                                                status.description
                                            }}</strong>
                                        </div>
                                        <v-chip
                                            variant="flat"
                                            :color="
                                                getStatusColor(status.status)
                                            "
                                            class="text-body-6"
                                            size="small"
                                        >
                                            <span class="text-xs">
                                                {{ status.status }}
                                            </span>
                                        </v-chip>
                                    </div>
                                </v-timeline-item>
                            </v-timeline>
                        </div>
                    </UiProjectCard>
                </div>
            </div>
        </v-col>
        <v-col
            :cols="isDashboard ? '4' : '12'"
            :md="isDashboard ? '4' : '12'"
            class="max-h-full p-5"
            :class="isDashboard ? '' : 'order-md-last'"
            v-else
        >
            <v-card class="w-full h-full p-5">
                <div class="flex justify-center items-center h-full p-5">
                    <h1>No project found</h1>
                </div>
            </v-card>
        </v-col>
        <v-col
            :cols="isDashboard ? '8' : '12'"
            :md="isDashboard ? '8' : '12'"
            class="max-h-full flex flex-col w-full h-full"
        >
            <v-row>
                <v-col
                    cols="6"
                    md="3"
                    v-for="data in datas"
                    :key="data.title"
                    v-auto-animate
                >
                    <div class="shadow-lg rounded-xl">
                        <UiParentCard :title="data.title">
                            <div class="w-full text-center text-4xl font-bold">
                                <v-icon :icon="data.icon" size="lg"></v-icon>
                                <span>{{ data.value }}</span>
                            </div>
                        </UiParentCard>
                    </div>
                </v-col>
            </v-row>
            <v-row class="h-full xl:overflow-hidden">
                <v-col cols="12" md="7" class="h-full">
                    <div
                        class="flex flex-col gap-5 overflow-auto h-full justify-center items-center"
                    >
                        <ProjectStatistics
                            :data="dashboardData.project_status"
                            class="shadow-xl"
                        />
                        <v-card
                            class="h-full w-full"
                            v-if="dashboardData.engineers"
                        >
                            <div
                                class="w-full h-full overflow-auto"
                                ref="scrollWorkload"
                            >
                                <v-card
                                    class="w-full min-h-full flex flex-col shadow-xl"
                                    title="Engineer's Workload"
                                >
                                    <div
                                        class="flex justify-between items-center px-5 gap-2 py-2"
                                        v-for="data in dashboardData.engineers"
                                        v-auto-animate
                                    >
                                        <div class="engineer flex gap-2">
                                            <v-avatar
                                                :image="
                                                    apiMedia +
                                                    data.engineer.photo
                                                "
                                            />
                                            <div class="info">
                                                <h1
                                                    class="font-bold capitalize"
                                                >
                                                    {{
                                                        data.engineer.full_name
                                                    }}
                                                </h1>
                                                <span class="text-xs font-thin"
                                                    >{{
                                                        data.engineer.job_titles
                                                    }}
                                                    -
                                                    <strong>{{
                                                        data.projects
                                                    }}</strong>
                                                    Project</span
                                                >
                                            </div>
                                        </div>
                                        <div
                                            class="w-52 flex justify-between items-center gap-2"
                                        >
                                            <div class="w-5/6">
                                                <v-progress-linear
                                                    :model-value="data.workload"
                                                ></v-progress-linear>
                                            </div>
                                            <span>{{ data.workload }}%</span>
                                        </div>
                                    </div>
                                </v-card>
                            </div>
                        </v-card>
                    </div>
                </v-col>
                <v-col cols="12" md="5" class="h-full">
                    <v-card class="h-full w-full">
                        <div
                            class="h-full w-full overflow-auto"
                            ref="scrollStandup"
                        >
                            <v-card
                                class="min-h-full"
                                v-if="dashboardData.standup.length !== 0"
                            >
                                <v-card-title>{{
                                    `Daily Update (${items.length})`
                                }}</v-card-title>
                                <v-card-subtitle
                                    >{{ $getDayName(standupDate) }} -
                                    {{
                                        $formatDate(standupDate)
                                    }}</v-card-subtitle
                                >
                                <ul class="divide-y divide-gray-300">
                                    <li
                                        v-for="(item, index) in items"
                                        :key="index"
                                        class="py-4 gap-5 flex items-start p-5"
                                        v-auto-animate
                                    >
                                        <div
                                            class="flex items-center bg-bluesea-200 rounded-xl"
                                        >
                                            <v-avatar
                                                :image="item.prependAvatar"
                                            ></v-avatar>
                                        </div>
                                        <div class="flex flex-col w-full">
                                            <h3
                                                class="text-lg font-medium text-gray-900"
                                            >
                                                {{ item.title }}
                                            </h3>
                                            <div
                                                v-html="item.subtitle"
                                                class="mt-2"
                                            ></div>
                                        </div>
                                        <hr
                                            class="mt-4"
                                            v-if="index !== items.length - 1"
                                        />
                                    </li>
                                </ul>
                            </v-card>
                            <div
                                v-else
                                class="flex justify-center items-center h-full"
                            >
                                <h1>No daily update</h1>
                            </div>
                        </div>
                    </v-card>
                </v-col>
            </v-row>
        </v-col>
    </v-row>
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
</template>

<style>
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
