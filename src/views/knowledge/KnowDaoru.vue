<template>
    <div class="container">
        <div class="card">

            <!-- 学校选择下拉框 -->
            <div v-if="selectedIdentity === 'sch'" class="school-input">
                <Select v-model="selectedSchool" placeholder="请选择学校" class="transparent-input" style="width: 300px;">
                    <Option v-for="opt in schools" :key="opt.value" :value="opt.value">{{ opt.label }}</Option>
                </Select>
            </div>

            <!-- 文件导入功能 -->
            <div class="file-import">
                <div class="file-select">
                    <Upload
                        :action="uploadUrl"
                        :before-upload="handleBeforeUpload"
                        :data="uploadData"
                        :show-upload-list="false"
                        :auto-upload="false"
                        ref="upload"
                    >
                        <i-button type="primary" size="large">选择文件</i-button>
                    </Upload>
                    <div class="selected-file">{{ selectedFileName }}</div>
                </div>
                <div class="button-group">
                    <i-button type="primary" size="large" :disabled="!selectedFile" @click="uploadFile">上传</i-button>
                    <i-button size="large" @click="clearFile" style="margin-left: 20px;">清除</i-button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { RadioGroup, Radio, Select, Option, Message, Upload, Button as IButton } from 'view-design';
import { fetchAllSchools } from '@/api/schmanage';

export default {
    data() {
        return {
            selectedIdentity: 'sch',
            selectedSchool: '',
            uploadUrl: 'api/knowledge/importKpKnowledgeData',
            selectedFileName: '',
            selectedFile: null,
            schools: [],
            uploadData: {},
        };
    },
    created() {
        this.fetchSchools();
    },
    methods: {
        handleBeforeUpload(file) {
            if (!file.type.includes('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')) {
                Message.error('请选择XLSX文件');
                return false;
            }
            this.selectedFileName = file.name;
            this.selectedFile = file;
            return false;
        },

        uploadFile() {
            if (!this.selectedFile) {
                Message.warning('请选择要上传的文件');
                return;
            }
            if (!this.selectedSchool) {
                Message.warning('请选择学校');
                return;
            }

            const formData = new FormData();
            formData.append('file', this.selectedFile);
            formData.append('schoolName', this.selectedSchool);

            fetch(this.uploadUrl, {
                method: 'POST',
                body: formData,
            })
                .then(response => response.json())
                .then(data => {
                    if (data.code === '00000') {
                        Message.success('上传成功');
                    } else {
                        Message.error(data.message || '上传失败');
                    }
                })
                .catch(error => {
                    console.error('上传失败:', error);
                    Message.error('上传失败');
                });
        },

        clearFile() {
            this.selectedFileName = '';
            this.selectedFile = null;
            this.$refs.upload.clearFiles();
        },

        fetchSchools() {
            fetchAllSchools()
                .then(response => {
                    if (Array.isArray(response.data)) {
                        // 过滤掉 status 为 9 的学校数据
                        this.schools = response.data
                            .filter(school => school.status !== 9)
                            .map(school => ({
                                value: school.schName,
                                label: school.schName
                            }));
                    } else {
                        Message.error('Failed to fetch schools: Invalid data format');
                    }
                })
                .catch(error => {
                    Message.error('Failed to fetch schools');
                });
        }
    },
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap');

body {
    font-family: 'Roboto', sans-serif;
    margin: 0;
    background-color: #eaeff1;
}

.container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
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
    margin-top: -200px;

    border: 1px solid #ccc;
}

.identity-selection {
    margin-bottom: 20px;
    width: 100%;
    color: #333;
}

.school-input {
    margin-bottom: 30px;
    width: 100%;
}

.file-import {
    margin-top: 20px;
    width: 100%;
}

.file-select {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 20px;
    width: 100%;
}

.selected-file {
    margin-left: 10px;
    font-size: 16px;
    color: #606266;
}

.button-group {
    display: flex;
    justify-content: center;
    width: 100%;
}

.button-group i-button {
    margin: 0 10px;
    width: 120px;
}

i-button {
    font-size: 16px;
    padding: 10px 20px;
    background: linear-gradient(135deg, #0078d7 30%, #005cbf 70%);
    border: none;
    color: #fff;
}

i-button:hover {
    background: linear-gradient(135deg, #005cbf 30%, #003e9f 70%);
}

.identity-selection .ivu-radio-group {
    display: flex;
    justify-content: center;
}

.school-input .ivu-select {
    display: block;
    margin: 0 auto;
    background-color: rgba(255, 255, 255, 0.7);
    color: #333;
}

.transparent-input .ivu-select-selection {
    background-color: rgba(255, 255, 255, 0.7) !important;
}
</style>
