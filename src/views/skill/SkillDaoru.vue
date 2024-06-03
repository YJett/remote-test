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
                        auto-upload="false"
                        ref="upload"
                    >
                        <i-button type="primary" size="large" style="font-size: 18px;">选择文件</i-button>
                    </Upload>
                    <!-- <div class="selected-file">{{ selectedFileName }}</div> -->
                </div>
                <div class="button-group" style="margin-top: 20px;">
                    <i-button type="primary" size="large" :disabled="!selectedFile" @click="uploadFile" style="font-size: 18px;">上传</i-button>
                    <i-button size="large" @click="clearFile" style="font-size: 18px; margin-left: 50px;">清除</i-button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { Upload, Message, Button as IButton } from 'view-design';

export default {
    data() {
        return {
            selectedFile: null,
            uploadUrl: 'api/importAbilityData',
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
.container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    background: url('../../assets/backimg.png') no-repeat center center/cover;
}

.card {
    background: rgba(255, 255, 255, 0.9);
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

.file-import {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 50px; /* Increased margin */
}

.file-select {
    display: flex;
    align-items: center;
    margin-bottom: 30px; /* Increased margin */
}

.button-group {
    display: flex;
    justify-content: center;
}

.button-group i-button {
    margin: 0 10px;
    font-size: 18px; /* Increased font size */
}
</style>
