<template>
    <div class="container">
        <!-- 选择身份 -->
        <div class="card identity-selection">
            <RadioGroup v-model="selectedIdentity">
                <Radio label="sch">学校身份</Radio>
                <Radio label="com">企业身份</Radio>
            </RadioGroup>
            <span class="selection-tip">请选择身份</span>
        </div>

        <!-- 文件导入功能 -->
        <div class="card file-import">
            <div class="file-select">
                <Upload
                    class="upload-component-wrapper"
                    v-if="selectedIdentity === 'sch'"
                    :action="'api/sch/importSchInfoData'"
                    :before-upload="handleBeforeUpload"
                    :on-success="handleUploadSuccess"
                    :show-upload-list="false"
                >
                    <i-button type="primary" size="large">选择文件</i-button>
                </Upload>


                <Upload
                    class="upload-component-wrapper"
                    v-if="selectedIdentity === 'com'"
                    :action="'api/com/importComData'"
                    :before-upload="handleBeforeUpload"
                    :on-success="handleUploadSuccess"
                    :show-upload-list="false"
                >
                    <i-button type="primary" size="large" >选择文件</i-button>
                </Upload>

                <div class="file-info">{{ selectedFileName }}</div>
            </div>
            <div class="button-group">
                <i-button type="primary" size="large" @click="uploadFile" :disabled="!selectedFile">上传</i-button>
                <i-button size="large" @click="clearFile" style="margin-left: 50px;">清除</i-button>
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
            console.log(response);
            if (response.code === '00000') {
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
    height: 100vh;
    background: url('../assets/backimg.png') no-repeat center center/cover;
}

.identity-selection {
    margin-bottom: 30px;
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
    align-items: center;
    margin-top: 20px;
    width: 100%;
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
    display: flex;
    justify-content: center;
    width: 100%;
}

.button-group i-button{
    margin: 0 10px;
    width: 120px;
}

.upload-component-wrapper {
    display: block;
    width: 100%;
    text-align: center; /* For any text inside Upload component to be centered as well */
}

i-button {
    font-size: 16px;
    padding: 10px 20px;
    background: linear-gradient(135deg, #0078d7 30%, #005cbf 70%);
    border: none;
    color: #fff;
}
.file-select {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 20px;
    width: 100%;
}
</style>
