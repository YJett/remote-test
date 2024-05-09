<template>
    <div class="container">
        <!-- 文件导入功能 -->
        <div class="file-import">
            <el-upload
                :action="uploadUrl"
                :before-upload="handleBeforeUpload"
                :on-success="handleUploadSuccess"
                :on-error="handleUploadError"
                :file-list="fileList"
                :headers="headers"
                :with-credentials="true"
                ref="upload"
            >
                <el-button slot="trigger" size="large" type="primary">选择文件</el-button>
                <el-button style="margin-left: 10px;" size="large" type="success" @click="uploadFile" :disabled="!selectedFile">上传</el-button>
            </el-upload>
            <div class="file-info">{{ selectedFileName }}</div>
        </div>
    </div>
</template>


<script>
import { Upload, Button } from 'element-ui';

export default {
    components: {
        'el-upload': Upload,
        'el-button': Button
    },
    data() {
        return {
            uploadUrl: 'api/importAbilityData', // 上传文件接口地址
            selectedFileName: '', // 选中的文件名
            selectedFile: null, // 选中的文件对象
            fileList: [], // 文件列表
            headers: {
                'Content-Type': 'multipart/form-data'
            },
        };
    },
    methods: {
        handleBeforeUpload(file) {
            // 检查文件类型是否为 XLSX
            if (!file.type.includes('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')) {
                this.$message.error('请选择XLSX文件');
                return false;
            }
            // 更新选中的文件名和文件对象
            this.selectedFileName = file.name;
            this.selectedFile = file;
            return true;
        },
        handleUploadSuccess(response, file, fileList) {
            if (response === 'Data imported successfully!') {
                this.$message.success('上传成功');
                this.clearFile();
            } else {
                this.$message.error('上传失败：' + response);
            }
        },
        handleUploadError(error, file, fileList) {
            this.$message.error('上传失败：' + error);
        },
        clearFile() {
            // 清除选中的文件信息
            this.selectedFileName = '';
            this.selectedFile = null;
            this.fileList = [];
        },
        uploadFile() {
            // 执行文件上传
            if (this.selectedFile) {
                this.$refs.upload.submit();
            } else {
                this.$message.warning('请选择要上传的文件');
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

.file-import {
    display: flex;
    align-items: center;
}

.file-info {
    margin-left: 20px;
    margin-right: 20px;
    font-size: 18px;
}
</style>
