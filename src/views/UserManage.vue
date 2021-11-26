<template>
    <div>
        <Table :data="tableData1" :columns="tableColumns1" stripe>
            <template slot-scope="{ row }" slot="name">
                <strong>{{ row.name }}</strong>
            </template>
            <template slot-scope="{ row }" slot="action">
                <Button type="primary" size="small" style="margin-right: 5px" @click="froze(row)">冻结</Button>
                <Button type="error" size="small" @click="unfroze(row)">解冻</Button>
            </template>
        </Table>
        <div style="margin: 10px;overflow: hidden">
            <div style="float: right;">
                <Page :total=total :current=curPage @on-change="changePage" show-total></Page>
            </div>
        </div>
    </div>
</template>
<script>
// eslint-disable-next-line import/no-unresolved
import { queryUser, froze, unForze } from '../api/usermanage'

export default {
    name: 'usermanage',
    data() {
        return {
            total: 11,
            curPage: 1,
            tableData1: [],
            tableColumns1: [
                {
                    title: 'Name',
                    key: 'name',
                },
                {
                    title: '用户状态',
                    key: 'isFreezed',
                    render: (h, params) => {
                        const row = params.row
                        // eslint-disable-next-line no-nested-ternary
                        const color = row.isFreezed === false ? 'success' : 'error'
                        // eslint-disable-next-line no-nested-ternary
                        const text = row.isFreezed === false ? '正常' : '冻结中'

                        return h('Tag', {
                            props: {
                                type: 'dot',
                                color,
                            },
                        }, text)
                    },
                },
                {
                    title: 'sno',
                    key: 'sno',
                },
                {
                    title: '班级',
                    key: 'class',
                },
                {
                    title: '解冻时间',
                    key: 'unFreezeTime',
                },
                {
                    title: 'Action',
                    slot: 'action',
                    width: 150,
                    align: 'center',
                },
            ],
        }
    },
    methods: {
        fetchData() {
            queryUser(this.curPage).then(res => {
                this.tableData1 = res.data.users
            })
        },
        changePage(page) {
            this.curPage = page
        },
        froze(obj) {
            froze(obj.guid).then(res => {
                this.$Message.success({
                    content: res.msg,
                })
                this.fetchData()
            })
        },
        unfroze(param) {
            unForze(param.guid).then(res => {
                this.$Message.success({
                    content: res.msg,
                })
                this.fetchData()
            })
        },
    },
    mounted() {
        queryUser(this.curPage).then(res => {
            console.log(res)
            this.total = res.data.allCount
            this.tableData1 = res.data.users
        })
    },
    watch: {
        curPage() {
            queryUser(this.curPage).then(res => {
                this.tableData1 = res.data.users
            })
        },
    },
}
</script>
