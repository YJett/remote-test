<template>
    <div class="user-management">
        <!-- 标题和图片 -->
        <div class="title-container">
            <h2>用户管理</h2>
        </div>

        <!-- 输入框和按钮 -->
        <div class="input-container">
            <!-- 查询按钮 -->
            <div class="search-container">
                <input type="text" v-model="searchName" placeholder="输入用户名">
                <input type="text" v-model="searchEmail" placeholder="输入邮箱" pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$">
                <button @click="search" class="search-button">查询</button>
            </div>
            <!-- 新增、删除、审核按钮 -->
            <div class="button-container">
                <button class="add-user-button" @click="showAddUserModal">新增用户</button>
                <button class="delete-button" @click="deleteSelected">删除选中</button>
                <button class="approve-button" @click="approveSelected">一键审核</button>
            </div>
        </div>

        <!-- 用户列表 -->
        <table>
            <thead>
            <tr>
                <th>选择</th>
                <th>序号</th>
                <th>用户名</th>
                <th>邮箱</th>
                <th>学校名</th>
                <th>地址</th>
                <th>邮编</th>
                <th>联系人</th>
                <th>电话</th>
                <th>备注</th>
                <th>状态</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(user, index) in userList" :key="user.user_id">
                <td>
                    <input type="checkbox" v-model="selectedUserIds" :value="user.user_id">
                </td>
                <td>{{ index + 1 }}</td>
                <td>{{ user.user_name }}</td>
                <td>{{ user.email }}</td>
                <td>{{ user.school }}</td>
                <td>{{ user.address }}</td>
                <td>{{ user.zipCode }}</td>
                <td>{{ user.contact }}</td>
                <td>{{ user.phone }}</td>
                <td>{{ user.remark }}</td>
                <td>{{ getStatusLabel(user.status) }}</td>
            </tr>
            </tbody>
        </table>

        <!-- 新增用户模态框 -->
        <Modal v-model="addUserModalVisible" title="新增用户">
            <form @submit.prevent="addUser">
                <div class="add-user-form">
                    <input type="text" v-model="newUser.user_name" placeholder="用户名">
                    <input type="email" v-model="newUser.email" placeholder="邮箱" pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$" required>
                    <input type="text" v-model="newUser.school" placeholder="学校名">
                    <input type="text" v-model="newUser.address" placeholder="地址">
                    <input type="text" v-model="newUser.zipCode" placeholder="邮编">
                    <input type="text" v-model="newUser.contact" placeholder="联系人">
                    <input type="text" v-model="newUser.phone" placeholder="电话">
                    <textarea v-model="newUser.remark" placeholder="备注"></textarea>
                    <select v-model="newUser.status">
                        <option value="0">未审核</option>
                        <option value="1">已审核</option>
                        <option value="9">已删除</option>
                    </select>
                </div>
                <div slot="footer">
                    <button type="submit" class="confirm-button">确定</button>
                    <button class="cancel-button" @click="closeAddUserModal">取消</button>
                </div>
            </form>
        </Modal>
    </div>
</template>

<script>
import axios from "axios";
import { search } from '@/api/user'

export default {
    data() {
        return {
            searchName: '',
            searchEmail: '',
            userList: [],
            newUser: {
                user_name: '',
                email: '',
                school: '',
                address: '',
                zipCode: '',
                contact: '',
                phone: '',
                remark: '',
                status: '0'
            },
            addUserModalVisible: false,
            selectedUserIds: []
        };
    },
    methods: {
        // 查询逻辑
        async search() {
            try {
                const response = await searchUsers({
                    user_name: this.searchName,
                    email: this.searchEmail,
                });
                this.userList = response.data;
            } catch (error) {
                console.error('Error fetching user list:', error);
            }
        },
        // 显示新增用户模态框
        showAddUserModal() {
            this.addUserModalVisible = true;
        },
        // 关闭新增用户模态框
        closeAddUserModal() {
            this.addUserModalVisible = false;
            // 清空新增用户信息
            this.newUser = {
                user_name: '',
                email: '',
                school: '',
                address: '',
                zipCode: '',
                contact: '',
                phone: '',
                remark: '',
                status: '0'
            };
        },
        // 添加用户逻辑
        async addUser() {
            try {
                const response = await axios.post('/api/addUser', this.newUser);
                // 将新增用户添加到用户列表中
                this.userList.push({ ...this.newUser, user_id: response.data.user_id });
                // 关闭新增用户模态框
                this.closeAddUserModal();
            } catch (error) {
                console.error('Error adding user:', error);
                // 处理错误
            }
        },
        // 删除选中用户逻辑
        async deleteSelected() {
            try {
                const response = await axios.post('/api/deleteUsers', {
                    user_ids: this.selectedUserIds
                });
                // 从用户列表中移除已删除的用户
                this.userList = this.userList.filter(user => !this.selectedUserIds.includes(user.user_id));
                // 清空选中用户ID数组
                this.selectedUserIds = [];
            } catch (error) {
                console.error('Error deleting selected users:', error);
            }
        },
        // 一键审核选中用户逻辑
        async approveSelected() {
            try {
                const response = await axios.post('/api/approveUsers', {
                    user_ids: this.selectedUserIds
                });
                // 更新用户列表中已审核用户的状态
                this.userList.forEach(user => {
                    if (this.selectedUserIds.includes(user.user_id)) {
                        user.status = '1'; // 设置状态为已审核
                    }
                });
                // 清空选中用户ID数组
                this.selectedUserIds = [];
            } catch (error) {
                console.error('Error approving selected users:', error);
            }
        },
        // 根据状态值返回对应的标签
        getStatusLabel(status) {
            switch (status) {
                case '0':
                    return '未审核';
                case '1':
                    return '已审核';
                case '9':
                    return '已删除';
                default:
                    return '';
            }
        }
    }
};
</script>

<style scoped>
.user-management {
    font-family: Arial, sans-serif;
    width: 80%;
    margin: 0 auto;
}

.title-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;
}

.company-logo {
    width: 100px;
}

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

.input-container input[type="text"],
.input-container input[type="email"],
.input-container textarea,
.input-container select {
    width: 200px;
    margin-right: 10px;
}

.button-container button {
    margin-left: 10px;
    transition: transform 0.2s, box-shadow 0.2s;
}

/* 添加按钮点击效果 */
.button-container button:hover {
    transform: scale(1.1);
}

.button-container button:active {
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
}

.add-user-button {
    background-color: #4CAF50;
    color: white;
    border: none;
}

.delete-button {
    background-color: #f44336;
    color: white;
    border: none;
}

.approve-button {
    background-color: #2196F3;
    color: white;
    border: none;
}

.confirm-button {
    background-color: #4CAF50;
    color: white;
    border: none;
}

.cancel-button {
    background-color: #f44336;
    color: white;
    border: none;
}

table {
    width: 100%;
    border-collapse: collapse;
}

th, td {
    border: 1px solid #ccc;
    padding: 8px;
    text-align: left;
}

th {
    background-color: #f2f2f2;
}
</style>
