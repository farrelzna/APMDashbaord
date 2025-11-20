<!-- table search -->
<template>
    <v-card title="Search Project" flat>
        <template v-slot:text>
            <v-text-field
                v-model="search"
                label="Search"
                prepend-inner-icon="mdi-magnify"
                variant="outlined"
                hide-details
                single-line
            ></v-text-field>
        </template>
        <v-data-table :headers="headers" :items="desserts" :search="search">
            <template v-slot:top>
                <nuxt-link to="">
                    <v-icon class="me-2" size="small" color="warning"
                        >mdi-pencil-outline add</v-icon
                    >
                </nuxt-link>
            </template>
            <template v-slot:item.actions="{ item }">
                <nuxt-link to="">
                    <v-icon class="me-2" size="small" color="warning"
                        >mdi-pencil-outline</v-icon
                    >
                </nuxt-link>
                <nuxt-link to=""
                    ><v-icon size="small" color="success">
                        mdi-eye-outline
                    </v-icon></nuxt-link
                >
            </template>
            <template v-slot:no-data>
                <v-btn color="primary" @click="initialize"> Reset </v-btn>
            </template>
        </v-data-table>
    </v-card>
</template>

<script>
export default {
    data() {
        return {
            search: '',
            headers: [
                {
                    align: 'start',
                    key: 'name',
                    sortable: false,
                    title: 'Project Name',
                },
                { key: 'pid', title: 'PID' },
                { key: 'years', title: 'Years' },
                { key: 'status', title: 'Status' },
                { key: 'actions', title: 'Actions' },
            ],
            desserts: [
                {
                    name: 'Frozen Yogurt',
                    pid: 159,
                    years: 6.0,
                    status: 24,
                },
                {
                    name: 'Ice cream sandwich',
                    pid: 237,
                    years: 9.0,
                    status: 37,
                },
                {
                    name: 'Eclair',
                    pid: 262,
                    years: 16.0,
                    status: 23,
                },
                {
                    name: 'Cupcake',
                    pid: 305,
                    years: 3.7,
                    status: 67,
                },
                {
                    name: 'Gingerbread',
                    pid: 356,
                    years: 16.0,
                    status: 49,
                },
            ],
        }
    },
}
</script>
