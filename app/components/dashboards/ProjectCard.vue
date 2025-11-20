<script setup>
const props = defineProps({
    client: String,
    project: String,
    status: String,
});

const statusColor = ref({
    'on-going': 'blue',
    completed: 'green',
    pending: 'yellow',
});
</script>

<template>
    <div class="flex flex-col bg-white p-4 rounded shadow-md border h-full">
        <div class="top w-full">
            <div class="client flex gap-5 items-center">
                <div
                    class="logo w-20 bg-bluesea-500 bg-opacity-30 rounded-md relative p-1"
                >
                    <img src="/img/logo.png" alt="" />
                    <UAvatar
                        src="https://avatars.githubusercontent.com/u/739984?v=4"
                        alt="Ahmad Fauzan"
                        class="absolute z-50 -bottom-2 -right-3 border border-black"
                    />
                </div>
                <div class="info">
                    <h1 class="text-xl font-bold leading-3">
                        {{ props.client }}
                    </h1>
                    <span class="text-sm w-10 truncate bg-red-50">{{
                        props.project
                    }}</span>
                </div>
                <UBadge variant="outline" :color="statusColor[props.status]"
                    >On-going</UBadge
                >
            </div>
        </div>
        <div class="bot flex gap-5 py-5">
            <div class="engineers flex justify-between items-center w-full">
                <UAvatarGroup size="sm" :max="5">
                    <UAvatar
                        src="https://avatars.githubusercontent.com/u/739984?v=4"
                        alt="benjamincanac"
                        class="border border-black"
                    />
                    <UAvatar
                        src="https://avatars.githubusercontent.com/u/739984?v=4"
                        alt="benjamincanac"
                        class="border border-black"
                    />
                    <UAvatar
                        src="https://avatars.githubusercontent.com/u/739984?v=4"
                        alt="benjamincanac"
                        class="border border-black"
                    />
                    <UAvatar
                        src="https://avatars.githubusercontent.com/u/739984?v=4"
                        alt="benjamincanac"
                        class="border border-black"
                    />
                    <UAvatar
                        src="https://avatars.githubusercontent.com/u/739984?v=4"
                        alt="benjamincanac"
                        class="border border-black"
                    />
                    <UAvatar
                        src="https://avatars.githubusercontent.com/u/739984?v=4"
                        alt="benjamincanac"
                        class="border border-black"
                    />
                </UAvatarGroup>
                <UBadge
                    variant="outline"
                    color="red"
                    class="bg-red-500 bg-opacity-10"
                    >Due date 20 June 2024</UBadge
                >
            </div>
        </div>
    </div>
</template>
