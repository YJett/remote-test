<template>
    <div>
        <div class="input-container">
            <div class="search-container">
                <Input v-model="userName" placeholder="请输入用户名" style="width: 200px" />
                <Input v-model="email" placeholder="请输入邮箱" style="width: 200px"
                    pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$" />
                <Button type="primary" class="button" @click="fetchData">查询</Button>
            </div>
            <!-- 新增、删除、审核按钮 -->
            <!--            <div class="button-container">-->
            <!--                <Button type="primary" class="button" @click="openAddUserModal">添加用户</Button>-->
            <!--                <Button type="success" class="button" @click="exportData1">删除所选</Button>-->
            <!--                <Button type="warning" class="button" @click="queryUnSigned">审核所选</Button>-->
            <!--            </div>-->
        </div>
        <Table :data="tableData1" :columns="tableColumns1" stripe>
            <template slot-scope="{ row, index }" slot="action">
            <Button type="primary" size="small" style="margin-right: 5px" @click="showDetailModal(row)">查看</Button>
            <Button type="error" size="small" @click="handleDelete(row)">删除</Button>
        </template>
        </Table>
        <Modal v-model="detailModalVisible" title="企业详情">
            <!-- 显示企业详情的表单 -->
            <Form :model="currentDetailData" label-width="80" ref="detailForm">
                <FormItem label="用户名">
                    <Input v-model="currentDetailData.userName" disabled/>
                </FormItem>
                <FormItem label="审核状态">
                    <Input v-model="currentDetailData.status" disabled/>
                </FormItem>
                <FormItem label="用户身份">
                    <Input v-model="currentDetailData.flag" disabled/>
                </FormItem>
                <FormItem label="最后login时间">
                    <Input v-model="currentDetailData.lastLogin" disabled/>
                </FormItem>
                <FormItem label="创建时间">
                    <Input v-model="currentDetailData.createTime" disabled/>
                </FormItem>
                <FormItem label="更新时间">
                    <Input v-model="currentDetailData.updateTime" disabled/>
                </FormItem>
            </Form>
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
import { querySignedDRecord, queryUnsignedDRecord } from "@/api/dutyPreservation";
import { querySignedPRecord, queryUnsignedPRecord } from "@/api/pPreservation";
import { queryUser, froze, unForze, deleteUser } from '../api/usermanage';
import PreservationRecord from '../components/PreservationRecord';

export default {
    name: 'usermanage',
    components: { PreservationRecord },
    data() {
        return {
            email: '',
            userName: '',
            showDetail: false,
            total: 11,
            curPage: 1,
            tableData1: [],
            tableColumns1: [
                {
                    type: 'selection',
                    width: 60,
                    align: 'center'
                },
                {
                    title: 'No',
                    key: 'userId',
                },
                {
                    title: '用户名',
                    key: 'userName',
                },
                {
                    title: '审核状态',
                    key: 'status',
                },
                {
                    title: '用户身份',
                    flg: 'flag',
                },
                {
                    title: '最后login时间',
                    key: 'lastLogin',
                },
                {
                    title: '创建时间',
                    key: 'createTime',
                },
                {
                    title: '修改时间',
                    key: 'updateTime',
                },
                {
                        title: 'Action',
                        slot: 'action',
                        width: 150,
                        align: 'center'
                }
            ],
            detailModalVisible: false, // 控制详情弹窗的显示
            currentDetailData: {},
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
        show(row, index) {
            console.log(row)
            console.log(index)
        },
        handleDelete(obj) {
            console.log(obj)
            // 提示用户是否确认删除
            this.$Modal.confirm({
                title: '删除',
                content: '是否确认删除该用户？',
                onOk: () => {
                    deleteUser(obj.userId)
                        .then(res => {
                            this.$Message.success({
                                content: res.msg,
                            })
                            this.fetchData()
                        })
                },
                onCancel: () => {
                    console.log('cancel')
                },
            })
        },
        fetchData() {
            queryUser(this.curPage, this.email, this.userName)
                .then(res => {
                    console.log(res);
                    console.log(res.data.list);
                    this.tableData1 = res.data.list
                    this.total = res.data.total
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
        showDetailModal(row) {
            this.currentDetailData = { ...row }; // 将当前行数据赋值给详情数据
            this.detailModalVisible = true; // 显示详情弹窗
        },
    },
    mounted() {
        this.fetchData();
    },
    watch: {
        curPage() {
            this.fetchData();
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
.action-button+.action-button {
    margin-left: 10px;
}
</style>
