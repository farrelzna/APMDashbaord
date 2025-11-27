<script setup>
import sidebarItems from '@/components/Layout/Full/vertical-sidebar/sidebarItem';
import { Menu2Icon, BellRingingIcon } from 'vue-tabler-icons';
import { useUserStore } from '@/stores/User';
import { onMounted } from 'vue';
import { useAutoAnimate } from '@formkit/auto-animate/vue';

const sidebarMenu = shallowRef(sidebarItems);
const sDrawer = ref(true);
const userStore = useUserStore();
const [listRef] = useAutoAnimate();

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
        elevation="0"
        width="270"
    >
        <div class="p-8 w-full flex justify-center items-center">
            <LayoutFullLogoDark />
        </div>
        <div class="scrollnavbar overflow-y-hidden flex flex-col h-full relative">
            <v-list class="py-2" ref="listRef">
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

            </v-list>
            <div class="mt-auto px-4 py-4 flex items-center">
                <LayoutFullVerticalHeaderProfileDD :photo="userStore.user?.photo || '/images/profile/user.png'" />
                <div class="flex flex-col flex-1">
                    <span class="font-medium text-xs text-white leading-tight">{{ userStore.user?.full_name || 'Username' }}</span>
                    <span class="text-xs text-[#B3B3B3] mt-0.5">{{ userStore.user?.email || userStore.user?.role || 'user@example.com' }}</span>
                </div>
            </div>
            <div class="text-xs text-start px-6 pb-4 space-y-1 text-[#B3B3B3]">APM DASA - V2</div>
        </div>
    </v-navigation-drawer>
</template>
