<template>
    <div class="container">
        <div class="card">
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
                    <div class="selected-file" v-if="selectedFileName">{{ selectedFileName }}</div>
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
import { Select, Option, Message, Upload, Button as IButton } from 'view-design';
export default {
    data() {
        return {
            uploadUrl: 'api/importAbilityData',
            selectedFileName: '',
            selectedFile: null,
            uploadData: {},
        };
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
    align-items: center;
    text-align: center;
    border: 1px solid #ccc;
    margin-top: -200px;
}

.identity-selection {
    margin-bottom: 20px;
    width: 100%;
    color: #333;
}

.school-input {
    margin-top: 20px; /* Adjusted to move above file-import */
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
