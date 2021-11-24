<template>
    <div>
        基本资料
        <input type="text">
        <Table :data="tableData" :columns="columns"></Table>
    </div>
</template>

<script>
import { queryUser } from '@/api/usermanage'

export default {
    name: 'usermanage',
    data() {
        return {
            tableData: [],
            columns: [
                {
                    title: '姓名',
                    key: 'name',
                },
                {
                    title: '班级',
                    key: 'class',
                },
                {
                    title: '是否冻结',
                    key: 'isFreezed',
                },
            ],
        }
    },
    methods: {
        query() {

        },
    },
    mounted() {
        queryUser().then(res => {
            console.log(res)
            this.tableData = res.data.users
        })
    },


}
</script>

<style scoped>

</style>
