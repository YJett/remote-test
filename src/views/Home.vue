<template>
<div class="home-container">
        <div class="home-content">
            <label></label>
            <Date-picker type="datetimerange"
                         format="yyyy-MM-dd HH:mm:ss"
                         placeholder="选择日期和时间（不含秒）"
                         style="width: 300px"
                         split-panels
                         :start-date="new Date(2021,11,11)"
                         v-model="timerange">
            </Date-picker>
            <Button type="primary" class="button" @click="exportData1">导出统计表</Button>
            <Button type="success" class="button" @click="querySigned">查询已签到任务</Button>
            <Button type="warning" class="button" @click="queryUnSigned">查询未签到任务</Button>
        </div>
        <Table :data="tableData" :columns="tableColumns" stripe>
            <template slot-scope="{ row }" slot="name">
                <strong>{{ row.people.name }}</strong>
            </template>
            <template slot-scope="{ row }" slot="sno">
                <strong>{{ row.people.sno }}</strong>
            </template>
            <template slot-scope="{ row }" slot="class">
                <strong>{{ row.people.class }}</strong>
            </template>
            <template slot-scope="{ row }" slot="action">
                <Button
                type="primary"
                size="small"
                v-if="row.isSigned==0"
                 @click="sign(row.id)"
                 >补签</Button>
                <Tag
                color="success"
                v-if="row.isSigned==1"
                >已签到</Tag>
            </template>
        </Table>
        <Modal
            v-model="showDetail"
            title="用户预约记录"
            width="850"
        >
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
import { exportReport, queryUnsignedDRecord, querySignedDRecord, signByAdmin } from '../api/dutyPreservation'
import { queryUnsignedPRecord, querySignedPRecord } from '../api/pPreservation'

export default {
    name: 'home',
    data() {
        return {
            timerange: [],
            tableData: [],
            tableColumns: [
                {
                    title: 'Name',
                    slot: 'name',
                },
                {
                    title: '学号',
                    slot: 'sno',
                },
                {
                    title: '班级',
                    slot: 'class',
                },
                {
                    title: '开始时间',
                    key: 'startTime',
                },
                {
                    title: '结束时间',
                    key: 'endTime',
                },
                {
                    title: '签到地点',
                    key: 'location',
                },
                {
                    title: '操作',
                    slot: 'action',
                },
            ],
            showDetail: false,
            pageSize: 10,
            curPage: 1,
            total: 11,
            status: false,
            isSigned: false,
        }
    },
    methods: {
        exportData1() {
            /*
            exportReport(this.timerange[0].toISOString().split('.')[0], this.timerange[1].toISOString().split('.')[0]).then(res => {
                const blob = new Blob([res])
                const reader = new FileReader()
                reader.readAsDataURL(blob)
                reader.onload = function (e) {
                    const a = document.createElement('a')
                    a.download = '文件名.xls'
                    a.href = e.target.result
                    document.documentElement.appendChild(a)
                    a.click()
                    a.remove()
                }
            })

             */
            // eslint-disable-next-line max-len
            const baseUrl = 'https://xiaochengxu-1391155-1308220348.ap-shanghai.run.tcloudbase.com/api/'
            let url = baseUrl + 'DutyPreservation/export?starttime='
                + this.timerange[0].toISOString().split('.')[0]
                + '&endtime=' + this.timerange[1].toISOString().split('.')[0]
                + '&token=' + localStorage.getItem('token')
            // eslint-disable-next-line max-len
            // eslint-disable-next-line max-len
            window.location = url
        },
        querySigned() {
            if (!this.status) {
                querySignedDRecord(this.timerange[0], this.timerange[1], this.curPage).then(res => {
                    this.tableData = res.data.content
                    this.total = res.data.allCount
                    console.log(res)
                })
            } else {
                querySignedPRecord(this.timerange[0], this.timerange[1], this.curPage).then(res => {
                    this.tableData = res.data.content
                    this.total = res.data.allCount
                    console.log(res)
                })
            }
            this.isSigned = true
        },
        queryUnSigned() {
            if (!this.status) {
                queryUnsignedDRecord(this.timerange[0], this.timerange[1], this.curPage).then(res => {
                    this.tableData = res.data.content
                    this.total = res.data.allCount
                    console.log(res)
                })
            } else {
                queryUnsignedPRecord(this.timerange[0], this.timerange[1], this.curPage).then(res => {
                    this.tableData = res.data.content
                    this.total = res.data.allCount
                    console.log(res)
                })
            }
            this.isSigned = false
        },
        sign(id) {
            signByAdmin(id).then(res => {
                console.log(res)
                this.fetchData()
            })
        },
        changePage(page) {
            this.curPage = page
        },
        changeStatus(status) {
            this.status = status
        },
        fetchData() {
            if (this.isSigned) {
                this.querySigned()
            } else {
                this.queryUnSigned()
            }
        },
    },
    watch: {
        curPage() {
            this.fetchData()
        },
    },
}
</script>

<style scoped>
.home-container {
    padding: 10px;
    padding-top: 5px;
}
.home-content {
    padding: 10px;
    border-radius: 5px;
    background: #fff;
}
.button {
    margin:0 5px;
}
</style>
