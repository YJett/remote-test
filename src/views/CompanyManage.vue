<template>
    <div>
        <div class="input-container">
            <!-- 查询按钮 -->
            <div class="search-container">
                <input type="text" v-model="searchName" placeholder="输入用户名">
                <input type="text" v-model="searchEmail" placeholder="输入邮箱" pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$">
                <button @click="querySigned" class="search-button">查询</button>
            </div>
            <!-- 新增、删除、审核按钮 -->
            <div class="button-container">
                <button class="action-button add-user-button" @click="exportData1">新增用户</button>
                <button class="action-button delete-button" @click="queryUnSigned">删除选中</button>
                <button class="action-button approve-button" @click="approveSelected">一键审核/此处无@click</button>
            </div>
        </div>
        <Table :data="tableData1" :columns="tableColumns1" stripe>
            <template slot-scope="{ row }" slot="name">
                <strong>{{ row.name }}</strong>
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
import {querySignedDRecord, queryUnsignedDRecord} from "@/api/dutyPreservation";
import {querySignedPRecord, queryUnsignedPRecord} from "@/api/pPreservation";
import {queryUser, froze, unForze} from '../api/usermanage';
import PreservationRecord from '../components/PreservationRecord';

export default {
    name: 'usermanage',
    components: {PreservationRecord},
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
        fetchData() {
            queryUser(this.curPage)
                .then(res => {
                    this.tableData1 = res.data.users
                })
        },
        changePage(page) {
            this.curPage = page
        },
        froze(obj) {
            froze(obj.guid)
                .then(res => {
                    this.$Message.success({
                        content: res.msg,
                    })
                    this.fetchData()
                })
        },
        unfroze(param) {
            unForze(param.guid)
                .then(res => {
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
        queryUser(this.curPage)
            .then(res => {
                console.log(res)
                this.total = res.data.allCount
                this.tableData1 = res.data.users
            })
    },
    watch: {
        curPage() {
            queryUser(this.curPage)
                .then(res => {
                    this.tableData1 = res.data.users
                })
        },
    },
}

</script>

<style>
.input-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;
}

.search-container {
    display: flex;
    align-items: center;
}

.search-button,
.action-button {
    padding: 8px 16px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    background-color: #007bff;
    color: #fff;
    transition: background-color 0.3s ease;
}

.search-button:hover,
.action-button:hover {
    background-color: #0056b3;
}

.add-user-button {
    background-color: #28a745;
}

.delete-button {
    background-color: #dc3545;
}

.approve-button {
    background-color: #ffc107;
}

/* 如果需要调整按钮之间的间距，可以在按钮之间增加 margin */
.action-button + .action-button {
    margin-left: 10px;
}
</style>
