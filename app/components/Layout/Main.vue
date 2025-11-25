<script setup>
import sidebarItems from '@/components/Layout/Full/vertical-sidebar/sidebarItem';
import { Menu2Icon, BellRingingIcon } from 'vue-tabler-icons';
import { useUserStore } from '@/stores/User';
import { onMounted } from 'vue';
const sidebarMenu = shallowRef(sidebarItems);
const sDrawer = ref(true);
const userStore = useUserStore();
// Fetch user data on mount (was previously conditional on user ref existence, causing early access issues)
onMounted(() => {
    try {
        userStore.fetchUser();
    } catch (e) {}
});
</script>

<template>
    <v-navigation-drawer
        left
        v-model="sDrawer"
        app
        class="leftSidebar"
        elevation="10"
        width="270"
    >
        <div class="pa-5 pl-4 w-full flex justify-center items-center">
            <LayoutFullLogoDark />
        </div>
        <!-- ---------------------------------------------- -->
        <!---Navigation -->
        <!-- ---------------------------------------------- -->
        <div class="scrollnavbar bg-black overflow-y-hidden flex flex-col h-full relative">
            <v-list class="py-4 px-4 bg-black">
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
            <div class="mt-auto px-4 py-4 border-t flex items-center gap-3">
                <LayoutFullVerticalHeaderProfileDD :photo="userStore.user?.photo || '/images/profile/user.png'" />
                <div class="flex flex-col">
                    <b class="font-semibold text-sm leading-4">{{ userStore.user?.full_name || '...' }}</b>
                    <span class="text-xs text-gray-500">{{ userStore.user?.role || '' }}</span>
                </div>
            </div>
            <div class="text-xs text-center py-3 text-gray-400">APM MTR - V2</div>
        </div>
    </v-navigation-drawer>
</template>
