<template>
    <div>
        <div>
            <label>请选择时间范围</label>
            <Date-picker type="datetimerange"
                         format="yyyy-MM-dd HH:mm"
                         placeholder="选择日期和时间（不含秒）"
                         style="width: 300px"
                         v-model="timerange">
            </Date-picker>
            <Button type="primary" icon="ios-search" @click="search">搜索</Button>
            <i-switch
                v-model="status" class="addbutton"
                size="large"
                @on-change="changeStatus"
            >
                <span slot="open">开启</span>
                <span slot="close">关闭</span>
            </i-switch>
            <Button type="primary" class="addbutton" @click="handleAdd">添加</Button>
        </div>
        <Table :data="tableData1" :columns="tableColumns1" stripe>
            <template slot-scope="{ row }" slot="name">
                <strong>{{ row.name }}</strong>
            </template>
            <template slot-scope="{ row }" slot="action">
                <Button type="primary" size="small" style="margin-right: 5px" @click="handleDetail(row)">查看</Button>
            </template>
        </Table>
        <Modal
            v-model="showForm"
            title="当日预约详情"
        >
            <preservation-form
                :dataObj="curDay"
                @close="showForm=false"
                :cur-date="curDate"
                @refresh="handleRefresh"
            ></preservation-form>
            <div slot="footer"/>
        </Modal>
        <Modal
            v-model="showAddForm"
            title="当日预约详情"
        >
            <add-preservation-form @close="closeAndRefresh" :is-duty="false" ></add-preservation-form>
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
import { getPreservation, openPreservation, getDetail, queryByTime, closePreservation, getStatus } from '../api/pPreservation'
import PreservationForm from '../components/PreservationForm'
import AddPreservationForm from '../components/AddPreservationForm'

export default {
    name: 'UserInfo',
    components: { PreservationForm, AddPreservationForm },
    data() {
        return {
            status: false,
            total: 11,
            curPage: 1,
            tableData1: [],
            showForm: false,
            showAddForm: false,
            curDay: [], // 当天数据
            curDate: '', // 字符串类型
            curDayId: '', // 当前dayid
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
            timerange: [new Date(), new Date()],
        }
    },
    methods: {
        changeStatus(status) {
            if (status) {
                openPreservation().then(res => {
                    if (res.code === 0) {
                        this.status = status
                        this.$Message.info('开关状态：' + status)
                    }
                })
            } else {
                closePreservation().then(res => {
                    if (res.code === 0) {
                        this.status = status
                        this.$Message.info('开关状态：' + status)
                    }
                })
            }
        },
        changePage(page) {
            this.curPage = page
        },
        handleDetail(obj) {
            this.curDayId = obj.dayId
            let dateValue = obj.time.replace('年', '-').replace('月', '-').replace('日', '').split('-')
            for (let i = 0; i < dateValue.length; i++) {
                dateValue[i] = dateValue[i].padStart(2, '0')
            }
            let date = dateValue[0] + '-' + dateValue[1] + '-' + dateValue[2]
            this.curDate = date
            this.showForm = true
            getDetail(obj.dayId).then(res => {
                res.data.forEach(item => {
                    item.start += ':00'
                    item.stop += ':00'
                })
                this.curDay = res.data
            })
        },
        handleRefresh() {
            getDetail(this.curDayId).then(res => {
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
        handleAdd() {
            this.showAddForm = true
        },
        search() {
            queryByTime(this.timerange[0].toISOString().split('.')[0], this.timerange[1].toISOString().split('.')[0]).then(res => {
                console.log(res.data.content)
                this.tableData1 = res.data.content
                this.total = res.data.allCount
            })
        },
        closeAndRefresh() {
            this.showAddForm = false
            this.search()
        },
    },
    mounted() {
        getStatus().then(res => {
            if (res.data.isOpen === 'True') {
                this.status = true
            }
            if (res.data.isOpen === 'False') {
                this.status = false
            }
        })
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
<style>
    .addbutton{
        float: right;
        margin-right:30px;
    }
</style>
