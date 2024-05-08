<template>
    <div class="container">
        <!-- 选择身份 -->
        <div class="identity-selection">
            <!-- 学校身份 -->
            <RadioGroup v-model="selectedIdentity">
                <Radio label="sch">学校身份</Radio>
            </RadioGroup>
        </div>

        <!-- 学校选择下拉框 -->
        <div v-if="selectedIdentity === 'sch'" class="school-input">
            <Select v-model="selectedSchool" placeholder="请选择学校" style="width: 200px;">
                <Option v-for="school in schools" :key="school.id" :value="school.schName">{{ school.schName }}</Option>
            </Select>
        </div>

        <!-- 文件导入功能 -->
        <div class="file-import">
            <!-- 选择文件按钮及文件路径显示框 -->
            <div class="file-select">
                <Upload
                    :action="uploadUrl"
                    :before-upload="handleBeforeUpload"
                    :on-success="handleUploadSuccess"
                    show-upload-list="false"
                >
                    <i-button type="primary" size="large">选择文件</i-button>
                </Upload>
                <div class="selected-file">{{ selectedFileName }}</div>
            </div>

            <!-- 按钮组 -->
            <div class="button-group">
                <i-button type="primary" size="large" @click="uploadFile" :disabled="!selectedFile">上传</i-button>
                <i-button size="large" @click="clearFile">清除</i-button>
            </div>
        </div>
    </div>
</template>

<script>
import { RadioGroup, Radio, Select, Option, Message } from 'view-design';
import { fetchSchoolNames } from '../api/schmanage'; // Updated API import


export default {
    data() {
        return {
            selectedIdentity: 'sch', // 默认选择学校身份
            selectedSchool: '', // 学校选择
            uploadUrl: '', // 上传文件接口地址
            selectedFileName: '', // 选中的文件名
            selectedFile: null, // 选中的文件对象
            uploadKey: 0, // 用于强制更新组件的 key
            schools: [], // 学校列表
        };
    },
    created() {
        // 组件创建时获取学校列表
        this.fetchSchools();
    },
    methods: {
        // 处理文件上传前的逻辑
        handleBeforeUpload(file) {
            if (!file.type.includes('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')) {
                Message.error('请选择XLSX文件');
                return false;
            }
            // 获取文件路径
            const input = document.querySelector('input[type=file]');
            if (input && input.files && input.files.length > 0) {
                this.selectedFileName = input.files[0].name; // 获取文件名作为路径显示
            } else {
                this.selectedFileName = '未选择文件';
            }
            this.selectedFile = file;
            return true;
        },

        // 文件上传成功后的处理逻辑
        handleUploadSuccess(response) {
            console.log(response);
            if (response.code === '00000') {
                Message.success('上传成功');
                // 处理文件内容和用户选择的身份进行数据处理和导入
                this.DaoRu(response.data);
            } else {
                Message.error('上传失败');
            }
        },

        // 数据导入逻辑
        DaoRu(data) {
            // 根据文件内容和用户选择的身份进行数据处理和导入
            const payload = {
                schoolName: this.selectedSchool, // 传入选择的学校名称
                fileData: data
            };
            // 处理学校数据
            this.uploadUrl = "api/knowledge/importKpKnowledgeData"; // 上传学校数据的接口地址
            this.uploadKey++; // 强制更新组件
        },
        // 清除选中文件信息
        clearFile() {
            this.selectedFileName = '';
            this.selectedFile = null;
        },
        // 执行文件上传逻辑
        uploadFile() {
            if (this.selectedFile) {
                const payload = {
                    schoolName: this.selectedSchool,
                    fileData: this.selectedFile
                };
                // 上传文件接口地址
                const uploadEndpoint = "api/knowledge/importKpKnowledgeData";
                fetch(uploadEndpoint, {
                    method: 'POST',
                    body: JSON.stringify(payload),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                    .then(response => {
                        if (response.ok) {
                            return response.json();
                        } else {
                            throw new Error('上传失败');
                        }
                    })
                    .then(data => {
                        console.log(data);
                        Message.success('上传成功');
                    })
                    .catch(error => {
                        console.error('上传失败:', error);
                        Message.error('上传失败');
                    });
            } else {
                Message.warning('请选择要上传的文件');
            }
        },
        // 获取学校列表
        fetchSchools() {
            // 只有选择学校身份才获取学校列表
            fetchSchoolNames().then(response => {
                this.schools = response.data;
                // If you want to pre-select the first school in the dropdown,
                // you can uncomment the following line:
                // this.selectedSchool = this.schools.length > 0 ? this.schools[0].schName : '';
            }).catch(error => {
                console.error('获取学校列表失败:', error);
                Message.error('获取学校列表失败');
            });
        },
    },
    mounted() {
        // 组件挂载时获取学校列表
        // This might be redundant since you're already calling fetchSchools() in created().
        // But if you still want to ensure that it's called when mounted, keep this line.
        // this.fetchSchools();
    },
    watch: {
        // 监听身份选择变化，根据选择更新学校列表
        selectedIdentity(newValue) {
            this.fetchSchools();
        },
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
}

.identity-selection {
    margin-bottom: 30px;
}

.file-import {
    display: flex;
    align-items: center;
}

.file-select {
    display: flex;
    align-items: center;
}

.file-info {
    margin-left: 20px;
    margin-right: 20px;
    font-size: 18px;
}

.selected-file {
    margin-left: 10px;
    font-size: 14px;
}

.button-group {
    margin-left: 20px;
}

.button-group i-button {
    margin-left: 10px;
}
</style>
