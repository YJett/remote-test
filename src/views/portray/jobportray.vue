<template>
    <div class="container">
        <!-- 学校名输入 -->
        <div class="input-section">
            <Input v-model="schoolName" placeholder="请输入学校名" style="width: 400px; font-size: 18px;" />
            <div class="button-group">
                <i-button type="primary" size="large" @click="searchSchoolInfo" style="font-size: 18px;">查询</i-button>
                <i-button type="default" size="large" @click="clearFields" style="font-size: 18px; margin-left: 10px;">清除</i-button>
            </div>
        </div>
        <div class="result-section" v-if="schoolInfo">
            <h3>学校信息:</h3>
            <p>学校ID: {{ schoolInfo.schId }}</p>
            <p>学校名称: {{ schoolInfo.schName }}</p>
            <p>学校地址: {{ schoolInfo.address }}</p>
            <p>邮编: {{ schoolInfo.zipcode }}</p>
            <p>邮箱: {{ schoolInfo.email }}</p>
            <p>联系人: {{ schoolInfo.contact }}</p>
            <p>电话: {{ schoolInfo.tel }}</p>
            <p>登录名: {{ schoolInfo.login_name }}</p>
            <p>备注: {{ schoolInfo.comment }}</p>
            <p>创建时间: {{ formatDate(schoolInfo.createTime) }}</p>
            <p>更新时间: {{ formatDate(schoolInfo.updateTime) }}</p>
            <p>状态: {{ schoolInfo.status }}</p>
        </div>

        <!-- 学生名输入 -->
        <div class="input-section">
            <Input v-model="studentName" placeholder="请输入学生名" style="width: 400px; font-size: 18px;" />
            <div class="button-group">
                <i-button type="primary" size="large" @click="searchStudentInfo" style="font-size: 18px;">查询</i-button>
                <i-button type="default" size="large" @click="clearStudentFields" style="font-size: 18px; margin-left: 10px;">清除</i-button>
            </div>
        </div>
        <div class="result-section" v-if="studentInfo">
            <h3>学生信息:</h3>
            <p>学生ID: {{ studentInfo.stuId }}</p>
            <p>学生名称: {{ studentInfo.stuName }}</p>
            <p>性别: {{ studentInfo.gender }}</p>
            <p>年龄: {{ studentInfo.age }}</p>
            <p>邮箱: {{ studentInfo.email }}</p>
            <p>电话: {{ studentInfo.tel }}</p>
            <p>入学日期: {{ formatDate(studentInfo.enrollDate) }}</p>
            <p>状态: {{ studentInfo.status }}</p>
        </div>

        <!-- 岗位名输入 -->
        <div class="input-section">
            <Input v-model="positionName" placeholder="请输入岗位名" style="width: 400px; font-size: 18px;" />
            <div class="button-group">
                <i-button type="primary" size="large" @click="searchPositionInfo" style="font-size: 18px;">查询</i-button>
                <i-button type="default" size="large" @click="clearPositionFields" style="font-size: 18px; margin-left: 10px;">清除</i-button>
            </div>
        </div>
        <div class="result-section" v-if="positionInfo">
            <h3>岗位信息:</h3>
            <p>岗位ID: {{ positionInfo.posId }}</p>
            <p>岗位名称: {{ positionInfo.posName }}</p>
            <p>岗位描述: {{ positionInfo.description }}</p>
            <p>岗位要求: {{ positionInfo.requirements }}</p>
            <p>薪资: {{ positionInfo.salary }}</p>
            <p>状态: {{ positionInfo.status }}</p>
        </div>
    </div>
</template>

<script>
import { Input, Button as IButton, Message } from 'view-design';

export default {
    data() {
        return {
            schoolName: '',
            studentName: '',
            positionName: '',
            schoolInfo: null,
            studentInfo: null,
            positionInfo: null,
        };
    },
    methods: {
        searchSchoolInfo() {
            if (!this.schoolName) {
                Message.warning('请输入学校名');
                return;
            }

            fetch(`/api/schoolInfo?schoolName=${this.schoolName}`)
                .then(response => response.json())
                .then(data => {
                    if (data.code === '00000') {
                        this.schoolInfo = data.data;
                    } else {
                        Message.error(data.message || '查询失败');
                    }
                })
                .catch(error => {
                    console.error('查询失败:', error);
                    Message.error('查询失败');
                });
        },
        clearFields() {
            this.schoolName = '';
            this.schoolInfo = null;
        },
        searchStudentInfo() {
            if (!this.studentName) {
                Message.warning('请输入学生名');
                return;
            }

            fetch(`/api/studentInfo?studentName=${this.studentName}`)
                .then(response => response.json())
                .then(data => {
                    if (data.code === '00000') {
                        this.studentInfo = data.data;
                    } else {
                        Message.error(data.message || '查询失败');
                    }
                })
                .catch(error => {
                    console.error('查询失败:', error);
                    Message.error('查询失败');
                });
        },
        clearStudentFields() {
            this.studentName = '';
            this.studentInfo = null;
        },
        searchPositionInfo() {
            if (!this.positionName) {
                Message.warning('请输入岗位名');
                return;
            }

            fetch(`/api/positionInfo?positionName=${this.positionName}`)
                .then(response => response.json())
                .then(data => {
                    if (data.code === '00000') {
                        this.positionInfo = data.data;
                    } else {
                        Message.error(data.message || '查询失败');
                    }
                })
                .catch(error => {
                    console.error('查询失败:', error);
                    Message.error('查询失败');
                });
        },
        clearPositionFields() {
            this.positionName = '';
            this.positionInfo = null;
        },
        formatDate(date) {
            if (!date) return '';
            const d = new Date(date);
            return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()} ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`;
        }
    },
};
</script>

<style scoped>
.container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    padding: 20px;
}

.input-section {
    margin-bottom: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.button-group {
    display: flex;
    justify-content: center;
    margin-top: 10px;
}

.button-group i-button {
    font-size: 18px;
}

.result-section {
    font-size: 16px;
    width: 400px;
    margin-top: 20px;
}

.result-section h3 {
    margin-bottom: 10px;
}
</style>
