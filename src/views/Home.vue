<template>
    <div class="container">
        <!-- 选择身份 -->
        <div class="identity-selection">
            <RadioGroup v-model="selectedIdentity">
                <Radio label="sch">学校身份</Radio>
                <Radio label="com">企业身份</Radio>
            </RadioGroup>
            <span class="selection-tip">请选择身份</span>
        </div>

        <!-- 文件导入功能 -->
        <div class="file-import">
            <Upload
                v-if="selectedIdentity === 'sch'"
                :action="'api/sch/importSchInfoData'"
                :before-upload="handleBeforeUpload"
                :on-success="handleUploadSuccess"
                show-upload-list="false"
            >
                <i-button type="primary" size="large">选择文件</i-button>
            </Upload>

            <Upload
                v-if="selectedIdentity === 'com'"
                :action="'api/com/importComData'"
                :before-upload="handleBeforeUpload"
                :on-success="handleUploadSuccess"
                show-upload-list="false"
            >
                <i-button type="primary" size="large">选择文件</i-button>
            </Upload>

            <div class="file-info">{{ selectedFileName }}</div>
            <div class="button-group">
                <i-button type="primary" size="large" @click="uploadFile" :disabled="!selectedFile">上传</i-button>
                <i-button size="large" @click="clearFile">清除</i-button>
            </div>
        </div>
    </div>
</template>


<script>
import { RadioGroup, Radio, Upload, Button, Message } from 'view-design';
import { importSchData, importComData } from '../api/upload'

export default {
    data() {
        return {
            selectedIdentity: 'sch', // 默认选择学校身份
            uploadUrl: '/api/upload', // 上传文件接口地址
            selectedFileName: '', // 选中的文件名
            selectedFile: null, // 选中的文件对象
            uploadKey: 0, // 用于强制更新组件的 key

        };
    },
    methods: {
        handleBeforeUpload(file) {
            this.processData();
            // 检查文件类型是否为 XLSX
            if (!file.type.includes('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')) {
                Message.error('请选择XLSX文件');
                return false;
            }
            console.log(this.uploadUrl);

            // 更新选中的文件名和文件对象
            this.selectedFileName = file.name;
            this.selectedFile = file;
            return true;
        },
        handleUploadSuccess(response) {
            if (response.code === 200) {
                Message.success('上传成功');
                // 根据文件内容和用户选择的身份进行数据处理和导入
                this.processData(response.data);
            } else {
                Message.error('上传失败');
            }
        },
        processData() {
            // 根据文件内容和用户选择的身份进行数据处理和导入
            if (this.selectedIdentity === 'sch') {
                // 处理学校数据
                this.uploadUrl = "api/sch/importSchInfoData";
            } else if (this.selectedIdentity === 'com') {
                // 处理企业数据
                this.uploadUrl="api/com/importComData";
            }
            this.uploadKey++;
        },
        clearFile() {
            // 清除选中的文件信息
            this.selectedFileName = '';
            this.selectedFile = null;
        },
        uploadFile() {
            this.processData();
            // 执行文件上传
            if (this.selectedFile) {
                this.$refs.upload.submit();
            } else {
                Message.warning('请选择要上传的文件');
            }
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
    height: 100vh; /* 让容器高度占满整个屏幕 */
}

.identity-selection {
    margin-bottom: 30px;
}

.file-import {
    display: flex;
    align-items: center;
}

.file-info {
    margin-left: 20px;
    margin-right: 20px;
    font-size: 18px;
}

.selection-tip {
    margin-left: 20px;
    color: #999;
    font-size: 18px;
}

.button-group {
    margin-left: 20px;
}

.button-group i-button {
    margin-left: 10px;
}
</style>
