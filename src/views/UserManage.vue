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
                <Button type="default" size="small" style="margin-right: 5px" @click="showDetailModal(row)">查看</Button>
                <Button type="primary" size="small" style="margin-right: 5px" @click="showEditModal(row)">修改</Button>
                <Button type="error" size="small" @click="handleDelete(row)">删除</Button>
            </template>
        </Table>
        <Modal v-model="detailModalVisible" title="用户详情">
            <div>
                <p><b>用户名:</b> {{ currentDetailData.userName }}</p>
                <p><b>邮箱:</b> {{ currentDetailData.email }}</p>
                <p><b>最后登录时间:</b> {{ formatDate(currentDetailData.lastLogin) }}</p>
                <p><b>创建时间:</b> {{ formatDate(currentDetailData.createTime) }}</p>
                <p><b>更新时间:</b> {{ formatDate(currentDetailData.updateTime) }}</p>
                <p><b>角色:</b> {{ currentDetailData.flg }}</p>
                <p><b>审核状态:</b> {{ currentDetailData.status }}</p>
            </div>
        </Modal>
        <Modal v-model="addEditModalVisible" title="新增/修改用户" @on-ok="saveUser" :footer-hide="true">
            <Form :model="currentEditData" :label-width="parseInt('80')" ref="editForm">
                <FormItem label="用户ID" v-if="isEdit">
                    <Input v-model="currentEditData.userId" disabled />
                </FormItem>
                <FormItem label="用户名">
                    <Input v-model="currentEditData.userName" />
                </FormItem>
                <FormItem label="邮箱">
                    <Input v-model="currentEditData.email" :placeholder="'请输入邮箱'"
                           :pattern="'[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$'" />
                </FormItem>
                <FormItem label="密码">
                    <Input v-model="currentEditData.pwd" type="pwd" />
                </FormItem>
                <FormItem label="角色">
                    <RadioGroup v-model="currentEditData.flg">
                        <Radio label="系统管理员" value="系统管理员">系统管理员</Radio>
                        <Radio label="学校管理员" value="学校管理员">学校管理员</Radio>
                        <Radio label="企业管理员" value="企业管理员">企业管理员</Radio>
                    </RadioGroup>
                </FormItem>
                <FormItem label="审核状态">
                    <Select v-model="currentEditData.status">
                        <Option value="未审核">未审核</Option>
                        <Option value="已审核">已审核</Option>
                        <Option value="已删除" v-if="isEdit">已删除</Option>
                    </Select>
                </FormItem>
                <FormItem>
                    <div style="text-align: center;">
                        <Button type="primary" @click="saveUser">确定</Button>
                        <Button @click="handleReset('editForm')" style="margin-left: 8px">重置</Button>
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
import { queryUser, deleteUser, createUser, updateUser } from '../api/usermanage';

export default {
    name: 'usermanage',
    data() {
        return {
            addEditModalVisible: false,
            currentEditData: {
                userId: '',
                userName: '',
                email: '',
                pwd: '',
                flg: '系统管理员', // Default flag as '系统管理员'
                status: '未审核', // Default status as '未审核'
                lastLogin: '',
                createTime: '',
                updateTime: ''
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
                    align: 'center',
                    render: (h, params) => {
                        const statusMap = {
                            '0': '未审核',
                            '1': '已审核',
                            '9': '已删除'
                        };
                        return h('div', statusMap[params.row.status]);
                    }
                },
                {
                    title: '用户身份',
                    key: 'flg',
                    align: 'center',
                    render: (h, params) => {
                        const flgMap = {
                            '0': '系统管理员',
                            '1': '学校管理员',
                            '2': '企业管理员'
                        };
                        return h('div', flgMap[params.row.flg]);
                    }
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
                    width: 200,
                    align: 'center'
                }
            ],
            detailModalVisible: false, // 控制详情弹窗的显示
            currentDetailData: {},
            curObj: {},
            isDuty: false,
            isEdit: false, // Whether it is in edit mode
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
            this.isEdit = false;
            // Initialize currentEditData for adding new user
            this.currentEditData = {
                userId: '',
                userName: '',
                email: '',
                pwd: '',
                flg: '系统管理员',
                status: '未审核',
                lastLogin: '',
                createTime: '',
                updateTime: ''
            };
        },
        showEditModal(row) {
            this.currentEditData = {...row};
            this.isEdit = true;
            this.addEditModalVisible = true;
        },
        saveUser() {
            const statusMap = {
                '未审核': '0',
                '已审核': '1',
                '已删除': '9'
            };
            const flgMap = {
                '系统管理员': '0',
                '学校管理员': '1',
                '企业管理员': '2'
            };

            let payload = {
                userId: this.currentEditData.userId,
                userName: this.currentEditData.userName,
                email: this.currentEditData.email,
                pwd: this.currentEditData.pwd,
                status: statusMap[this.currentEditData.status],
                flg: flgMap[this.currentEditData.flg],
                lastLogin: this.currentEditData.lastLogin ? new Date(this.currentEditData.lastLogin).toISOString() : null,
                createTime: this.currentEditData.createTime ? new Date(this.currentEditData.createTime).toISOString() : null,
                updateTime: new Date().toISOString()
            };

            console.log('Payload:', payload); // Log the payload for debugging

            if (this.isEdit) {
                // Edit existing user
                updateUser(payload.userId, payload.userName, payload.email, payload.pwd, payload.status, payload.flg, payload.lastLogin, payload.createTime, payload.updateTime)
                    .then(res => {
                        this.addEditModalVisible = false;
                        this.fetchData();
                    })
                    .catch(err => {
                        console.error('Error editing user:', err);
                    });
            } else {
                // Add new user
                createUser(payload.userName, payload.email, payload.pwd, payload.status, payload.flg)
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
                .catch(err => {
                    console.error('Error fetching data:', err);
                });
        },
        changePage(page) {
            this.curPage = page;
            this.fetchData();
        },
        showDetailModal(row) {
            this.currentDetailData = {...row}; // 将当前行数据赋值给详情数据
            this.detailModalVisible = true; // 显示详情弹窗
        },
        handleCancel() {
            this.addEditModalVisible = false;
        },
        handleReset() {
            this.currentEditData = {
                userId: '', // Reset userId
                userName: '',
                email: '',
                pwd: '',
                flg: '系统管理员', // Reset to default values
                status: '未审核'   // Reset to default values
            };
        }
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

.action-button + .action-button {
    margin-left: 10px;
}
</style>
