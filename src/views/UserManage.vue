<template>
    <div>
        <div class="input-container">
            <!-- 查询按钮 -->
            <div class="search-container">
                <Input v-model="value5" placeholder="请输入用户名" style="width: 200px"/>
                <Input v-model="value6" placeholder="请输入邮箱" style="width: 200px" pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"/>
                <Button type="primary" class="button" @click="exportData1">查询</Button>
            </div>
            <!-- 新增、删除、审核按钮 -->
            <div class="button-container">
                <Button type="primary" class="button" @click="exportData1">添加用户</Button>
                <Button type="success" class="button" @click="querySigned2">删除所选/此处无@click</Button>
                <Button type="warning" class="button" @click="queryUnSigned">审核所选</Button>
            </div>
        </div>
        <Table :data="tableData1" :columns="tableColumns1" stripe>
            <template slot-scope="{ row }" slot="name">
                <strong>{{ row.name }}</strong>
            </template>
<!--            <template slot-scope="{ row }" slot="action">-->
<!--                &lt;!&ndash; eslint-disable-next-line vue/no-unused-vars &ndash;&gt;-->
<!--&lt;!&ndash;                <Button type="primary" size="small" style="margin-right: 5px" @click="froze(row)">冻结</Button>&ndash;&gt;-->
<!--&lt;!&ndash;                <Button type="error" size="small" @click="unfroze(row)">解冻</Button>&ndash;&gt;-->
<!--&lt;!&ndash;                <Button type="success" size="small" @click="showRecord(row,true)">值班预约</Button>&ndash;&gt;-->
<!--&lt;!&ndash;                <Button type="primary" size="small" @click="showRecord(row,false)">练琴预约</Button>&ndash;&gt;-->
<!--            </template>-->
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
            value5: '',
            value6: '',
            showDetail: false,
            total: 11,
            curPage: 1,
            tableData1: [],
            tableColumns1: [
                {
                    title: 'No',
                    key: 'user_id',
                },
                {
                    title: '用户名',
                    key: 'user_name',
                },
                {
                    title: '审核状态',
                    key: 'status',
                },
                {
                    title: '用户身份',
                    key: 'flag',
                },
                {
                    title: '最后login时间',
                    key: 'last_login',
                },
                {
                    title: '创建时间',
                    key: 'create_time',
                },
                {
                    title: '修改时间',
                    key: 'update_time',
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
