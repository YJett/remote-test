<template>
    <div>
        <div class="input-container">
            <div class="search-container">
                <Input v-model="userName" placeholder="请输入用户名" style="width: 200px"/>
                <Input v-model="email" placeholder="请输入邮箱" style="width: 200px"
                       pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$" />
            </div>
        </div>
        <div class="button-container">
            <Button type="primary" @click="fetchData">查询</Button>
            <Button type="default" @click="clearInputs">清除</Button>
            <Button type="success" class="add-user-button" @click="showAddModal">新增</Button>
        </div>
        <Table :data="tableData1" :columns="tableColumns1" stripe>
            <template slot-scope="{ row, index }" slot="action">
                <Button type="primary" size="small" style="margin-right: 5px" @click="showEditModal(row)">修改</Button>
                <Button type="error" size="small" @click="handleDelete(row)">删除</Button>
            </template>
        </Table>
        <Modal v-model="detailModalVisible" title="用户详情">
            <!-- Existing detail modal content -->
        </Modal>
        <Modal v-model="addEditModalVisible" title="新增/修改用户" @on-ok="saveUser" :footer-hide="true">
            <Form :model="currentEditData" :label-width="parseInt('80')" ref="editForm">
                <FormItem label="用户名">
                    <Input v-model="currentEditData.userName" />
                </FormItem>
                <FormItem label="邮箱">
                    <Input v-model="currentEditData.email" :placeholder="'请输入邮箱'"
                           :pattern="'[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$'" />
                </FormItem>
                <FormItem label="密码">
                    <Input v-model="currentEditData.password" type="password" />
                </FormItem>
                <FormItem label="角色">
                    <RadioGroup v-model="currentEditData.role">
                        <Radio label="系统管理员">系统管理员</Radio>
                        <Radio label="学校管理员">学校管理员</Radio>
                        <Radio label="企业">企业</Radio>
                    </RadioGroup>
                </FormItem>
                <FormItem>
                    <div style="text-align: center;">
                        <Button type="primary" @click="handleSubmit('formValidate')">确定</Button>
                        <Button @click="handleReset('formValidate')" style="margin-left: 8px">重置</Button>
                        <Button @click="handleCancel" style="margin-left: 8px">取消</Button>
                    </div>
                </FormItem>
            </Form>
        </Modal>
        <div style="margin: 10px;overflow: hidden">
            <div style="float: right;">
                <Page :total="total" :current="curPage" @on-change="changePage" show-total></Page>
            </div>
        </div>
    </div>
</template>

<script>
import { queryUser, deleteUser } from '../api/usermanage';
import PreservationRecord from '../components/PreservationRecord';

export default {
    name: 'usermanage',
    components: { PreservationRecord },
    data() {
        return {
            addEditModalVisible: false,
            currentEditData: {
                userName: '',
                email: '',
                password: '',
                role: '系统管理员' // Default role
            },
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
                    align: 'center'
                },
                {
                    title: '用户名',
                    key: 'userName',
                    align: 'center'
                },
                {
                    title: '邮箱',
                    key: 'email',
                    align: 'center'
                },
                {
                    title: '审核状态',
                    key: 'status',
                    align: 'center'
                },
                {
                    title: '用户身份',
                    key: 'flag',
                    align: 'center'
                },
                {
                    title: '最后登录时间',
                    key: 'lastLogin',
                    render: (h, params) => {
                        return h('div', {
                            style: {
                                textAlign: 'center'
                            }
                        }, this.formatDate(params.row.lastLogin));
                    },
                    align: 'center'
                },
                {
                    title: '创建时间',
                    key: 'createTime',
                    render: (h, params) => {
                        return h('div', {
                            style: {
                                textAlign: 'center'
                            }
                        }, this.formatDate(params.row.createTime));
                    },
                    align: 'center'
                },
                {
                    title: '更新时间',
                    key: 'updateTime',
                    render: (h, params) => {
                        return h('div', {
                            style: {
                                textAlign: 'center'
                            }
                        }, this.formatDate(params.row.updateTime));
                    },
                    align: 'center'
                },
                {
                    title: '操作',
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
    computed: {
        formattedLastLogin() {
            return this.formatDate(this.currentDetailData.lastLogin);
        },
        formattedCreateTime() {
            return this.formatDate(this.currentDetailData.createTime);
        },
        formattedUpdateTime() {
            return this.formatDate(this.currentDetailData.updateTime);
        }
    },
    methods: {
        clearInputs() {
            this.email = '';
            this.userName = '';
        },
        formatDate(dateString) {
            if (!dateString) return '';
            return new Date(dateString).toISOString().replace('T', ' ').substring(0, 19).replace(/-/g, '/');
        },
        show(row, index) {
            console.log(row)
            console.log(index)
        },
        showAddModal() {
            this.addEditModalVisible = true;
            // Clear currentEditData or initialize as needed for adding new user
        },
        showEditModal(row) {
            this.currentEditData = { ...row };
            this.addEditModalVisible = true;
        },
        saveUser() {
            // Determine if it's an add or edit operation
            if (this.currentEditData.userId) {
                // Edit existing user
                editUser(this.currentEditData)
                    .then(res => {
                        this.addEditModalVisible = false;
                        this.fetchData();
                    })
                    .catch(err => {
                        console.error('Error editing user:', err);
                    });
            } else {
                // Add new user
                addUser(this.currentEditData)
                    .then(res => {
                        this.addEditModalVisible = false;
                        this.fetchData();
                    })
                    .catch(err => {
                        console.error('Error adding user:', err);
                    });
            }
        },
        handleDelete(obj) {
            console.log(obj)
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

.button-container {
    display: flex;
    justify-content: center;
    margin-top: 10px;
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

.action-button+.action-button {
    margin-left: 10px;
}
</style>
