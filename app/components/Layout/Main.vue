<script setup>
import sidebarItems from '@/components/layout/Full/vertical-sidebar/sidebarItem';
import { Menu2Icon, BellRingingIcon } from 'vue-tabler-icons';
import { useUserStore } from '@/stores/User';
const sidebarMenu = shallowRef(sidebarItems);
const sDrawer = ref(true);
const userStore = useUserStore();
if (userStore.user) {
    userStore.fetchUser();
}
</script>

<template>
    <v-navigation-drawer
        left
        v-model="sDrawer"
        app
        class="leftSidebar ml-sm-5 mt-sm-5 bg-containerBg"
        elevation="10"
        width="270"
    >
        <div class="pa-5 pl-4 w-full flex justify-center items-center">
            <LayoutFullLogoDark />
        </div>
        <!-- ---------------------------------------------- -->
        <!---Navigation -->
        <!-- ---------------------------------------------- -->
        <div class="scrollnavbar bg-containerBg overflow-y-hidden">
            <v-list class="py-4 px-4 bg-containerBg">
                <!---Menu Loop -->
                <template v-for="(item, i) in sidebarMenu">
                    <!---Item Sub Header -->
                    <LayoutFullVerticalSidebarNavGroup
                        :item="item"
                        v-if="item.header"
                        :key="item.title"
                        v-can="item.permission"
                    />
                    <!---Single Item-->
                    <LayoutFullVerticalSidebarNavItem
                        :item="item"
                        v-else
                        class="leftPadding"
                        v-can="item.permission"
                    />
                    <!---End Single Item-->
                </template>

                <!-- <Moreoption/> -->
            </v-list>
            <span class="text-xs absolute bottom-0 p-5">APM MTR - V1</span>
        </div>
    </v-navigation-drawer>
    <div class="container verticalLayout">
        <v-app-bar elevation="0" height="70">
            <div class="d-flex align-center justify-space-between w-100">
                <div>
                    <v-btn
                        class="hidden-lg-and-up text-muted"
                        @click="sDrawer = !sDrawer"
                        icon
                        variant="flat"
                        size="small"
                    >
                        <Menu2Icon size="20" stroke-width="1.5" />
                    </v-btn>
                </div>
                <div class="flex justify-center items-center gap-2">
                    <!-- User Profile -->
                    <div class="flex flex-col" dir="rtl">
                        <b class="font-bold text-sm">{{
                            userStore.user.full_name
                        }}</b>
                        <span class="font-thin text-xs">{{
                            userStore.user.role
                        }}</span>
                    </div>
                    <LayoutFullVerticalHeaderProfileDD
                        :photo="userStore.user.photo"
                    />
                </div>
            </div>
        </v-app-bar>
    </div>
</template>
