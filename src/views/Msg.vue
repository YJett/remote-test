<template>
    <div>
        <Table :data="tableData1" :columns="tableColumns1" stripe>
            <template slot-scope="{ row }" slot="name">
                <strong>{{ row.name }}</strong>
            </template>
            <template slot-scope="{ row }" slot="action">
                <Button type="primary" size="small" style="margin-right: 5px" @click="handleDetail(row)">查看</Button>
                <Button type="error" size="small" @click="handleDelete(row)">删除</Button>
            </template>
        </Table>
        <Modal
            v-model="showForm"
            title="当日预约详情"
        >
            <preservation-form :dataObj="curDay" @close="showForm=false"></preservation-form>
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
import { getPreservation, openPreservation, getDetail } from '../api/pPreservation'
import PreservationForm from '@/components/PreservationForm'

export default {
    name: 'msg',
    components: { PreservationForm },
    data() {
        return {
            total: 11,
            curPage: 1,
            tableData1: [],
            showForm: false,
            curDay: [],
            tableColumns1: [
                {
                    title: '时间',
                    key: 'time',
                },
                {
                    title: '可预约人数',
                    key: 'all',
                },
                {
                    title: '当前人数',
                    key: 'current',
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
        changePage(page) {
            this.curPage = page
        },
        handleDetail(obj) {
            this.showForm = true
            getDetail(obj.dayId).then(res => {
                res.data.forEach(item => {
                    item.start += ':00'
                    item.stop += ':00'
                })
                this.curDay = res.data
            })
        },
        handleDelete(param) {
            console.log(param)
        },
    },
    mounted() {
        getPreservation(this.curPage).then(res => {
            console.log(res)
            this.total = res.data.allCounts
            this.tableData1 = res.data.content
        })
        /*
            openPreservation().then(res => {
                console.log(res)
            })

             */
    },
    watch: {
        curPage() {
            getPreservation(this.curPage).then(res => {
                this.tableData1 = res.data.content
            })
        },
    },
}
</script>
