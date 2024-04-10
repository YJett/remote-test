<template>
    <div>
        <div class="input-container">
            <!-- 查询按钮 -->
            <div class="search-container">
                <Input v-model="value1" placeholder="请输入用户名" style="width: 200px"/>
                <Input v-model="value2" placeholder="请输入邮箱" style="width: 200px" pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"/>
                <Button type="primary" class="button" @click="exportData1">查询</Button>
            </div>
            <!-- 新增、删除、审核按钮 -->
            <div class="button-container">
                <Button type="primary" class="button" @click="openAddSchoolModal">添加学校</Button>
                <Button type="success" class="button" @click="exportData1">删除所选</Button>
                <Button type="warning" class="button" @click="queryUnSigned">审核所选</Button>
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
    name: 'schoolmanage',
    components: {PreservationRecord},
    data() {
        return {
            value1: '',
            value2: '',
            showDetail: false,
            total: 11,
            curPage: 1,
            tableData1: [],
            tableColumns1: [
                {
                    title: 'No',
                    key: 'schId',
                },
                {
                    title: '学校名',
                    key: 'sno',
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
                    key: 'zipcode'
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
            // 添加学校需要的字段
            schName: '',
            address: '',
            zipcode: '',
            contact: '',
            tel: '',
            email: '',
            qualification: '',
            status: '',
            remark: ''
        }
    },
    methods: {
        openAddSchoolModal() {
            this.$Modal.confirm({
                title: '添加学校',
                content: "学校名"
                    + '<Input v-model="schName" placeholder="请输入学校名"/><br/>'
                    + "地址"
                    + '<Input v-model="address" placeholder="请输入地址"/><br/>'
                    + "邮编"
                    + '<Input v-model="zipcode" placeholder="请输入邮编"/><br/>'
                    + "联系人"
                    + '<Input v-model="contact" placeholder="请输入联系人"/><br/>'
                    + "电话"
                    + '<Input v-model="tel" placeholder="请输入电话"/><br/>'
                    + "邮箱"
                    + '<Input v-model="email" placeholder="请输入邮箱"/><br/>'
                    + "审核状态"
                    + '<Select v-model="status" placeholder="请选择状态">'
                    + '<Option value="0">未审核</Option>'
                    + '<Option value="1">已审核</Option>'
                    + '<Option value="9">已删除</Option>'
                    + '</Select><br/>'
                    + '<Input v-model="remark" placeholder="请输入备注"/>',
                onOk: () => {
                    // 在这里处理确认添加学校的逻辑
                    // 可以在这里将输入的内容发送到后端进行保存
                    // 清空输入框的内容以便下次使用
                    this.clearInputs();
                },
                onCancel: () => {
                    // 在这里处理取消添加学校的逻辑
                    // 清空输入框的内容以便下次使用
                    this.clearInputs();
                }
            });
        },
        clearInputs() {
            this.schName = '';
            this.address = '';
            this.zipcode = '';
            this.contact = '';
            this.tel = '';
            this.email = '';
            this.qualification = '';
            this.status = '';
            this.remark = '';
        },
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

</style>
