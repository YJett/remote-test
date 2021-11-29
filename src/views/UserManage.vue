<template>
    <div>
        <Table :data="tableData1" :columns="tableColumns1" stripe>
            <template slot-scope="{ row }" slot="name">
                <strong>{{ row.name }}</strong>
            </template>
            <template slot-scope="{ row }" slot="action">
                <Button type="primary" size="small" style="margin-right: 5px" @click="froze(row)">冻结</Button>
                <Button type="error" size="small" @click="unfroze(row)">解冻</Button>
                <Button type="success" size="small" @click="showRecord(row,true)">查看值班预约</Button>
                <Button type="primary" size="small" @click="showRecord(row,false)">查看练琴预约</Button>
            </template>
        </Table>
        <Modal
            v-model="showDetail"
            title="用户预约记录"
        >
            <preservation-record
                @close="this.showDetail=false"
                :is-duty="isDuty"
                :id="curObj.guid"
            ></preservation-record>
            <div slot="footer"/>
        </Modal>
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
import PreservationRecord from '../components/PreservationRecord'

export default {
    name: 'usermanage',
    components: { PreservationRecord },
    data() {
        return {
            showDetail: false,
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
                    width: 200,
                    align: 'center',
                },
            ],
            curObj: {},
            isDuty: false,
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
        showRecord(row, isDuty) {
            if (isDuty) {
                this.isDuty = true
            } else {
                this.isDuty = false
            }
            this.curObj = row
            this.showDetail = true
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
