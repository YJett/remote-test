<template>
    <div class="container">
        <div class="card">
            <!-- 学校名输入框 -->
            <div class="input-section">
                <Input v-model="schoolName" placeholder="请输入学校名" style="width: 400px; font-size: 18px;" />
            </div>
            <div class="button-group">
                <i-button type="primary" size="large" @click="searchSchoolInfo" style="font-size: 18px;">查询</i-button>
                <i-button type="default" size="large" @click="clearFields" style="font-size: 18px; margin-left: 10px;">清除</i-button>
            </div>

            <!-- 查询结果显示 -->
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
        </div>
    </div>
</template>

<script>
import { Input, Button as IButton, Message } from 'view-design';

export default {
    data() {
        return {
            schoolName: '',
            schoolInfo: null,
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
    background-color: #e6f7ff; /* Light blue background color */
}

.card {
    background: rgba(255, 255, 255, 0.7);
    border-radius: 12px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
    padding: 40px;
    width: 80%;
    max-width: 800px;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    border: 1px solid #ccc;
}

.input-section {
    margin-bottom: 20px;
}

.button-group {
    display: flex;
    justify-content: center;
    margin-bottom: 20px;
}

.button-group i-button {
    font-size: 18px;
}

.result-section {
    font-size: 16px;
}

.result-section h3 {
    margin-bottom: 10px;
}
</style>
