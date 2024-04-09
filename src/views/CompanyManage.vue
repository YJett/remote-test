<template>
    <div>
        <Table :data="tableData1" :columns="tableColumns1" stripe>
            <template slot-scope="{ row }" slot="name">
                <strong>{{ row.name }}</strong>
            </template>
            <template slot-scope="{ row }" slot="action">
                <Button type="primary" size="small" style="margin-right: 5px" @click="froze(row)">冻结</Button>
                <Button type="error" size="small" @click="unfroze(row)">解冻</Button>
                <Button type="success" size="small" @click="showRecord(row,true)">值班预约</Button>
                <Button type="primary" size="small" @click="showRecord(row,false)">练琴预约</Button>
            </template>
        </Table>
        <Modal
            v-model="showDetail"
            title="用户预约记录"
            width="850"
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
                    title: 'No',
                    key: 'comId',
                },
                {
                    title: '企业名',
                    key: 'comName',
                },
                {
                    title: '地址',
                    key: 'address',
                },
                {
                    title: '联系人',
                    key: 'contact',
                },
                {
                    title: '邮编',
                    key: 'zipcode',
                },
                {
                    title: '电话',
                    key: 'tel',
                },
                {
                    title: '邮箱',
                    key: 'email',
                },
                {
                    title: '状态',
                    key: 'status',
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
