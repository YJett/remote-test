<template>
    <div class="container">
        <!-- 选择身份 -->
        <div class="identity-selection">
            <RadioGroup v-model="selectedIdentity">
                <Radio label="sch">学校身份</Radio>
            </RadioGroup>
        </div>

        <!-- 学校选择下拉框 -->
        <div v-if="selectedIdentity === 'sch'" class="school-input">
            <Select v-model="selectedSchool" placeholder="请选择学校" style="width: 200px; font-size: 18px;">
                <Option v-for="opt in schools" :key="opt.value" :value="opt.value">{{ opt.label }}</Option>
            </Select>
        </div>

        <!-- 文件导入功能 -->
        <div class="file-import" style="margin-top: 40px;">
            <div class="file-select">
                <Upload
                    :action="uploadUrl"
                    :before-upload="handleBeforeUpload"
                    :data="uploadData"
                    :show-upload-list="false"
                    :auto-upload="false"
                    ref="upload"
                >
                    <i-button type="primary" size="large" style="font-size: 18px;">选择文件</i-button>
                </Upload>
                <div class="selected-file" style="font-size: 16px;">{{ selectedFileName }}</div>
            </div>
            <div class="button-group" style="margin-top: 40px;"> <!-- Increased margin-top -->
                <i-button type="primary" size="large" :disabled="!selectedFile" @click="uploadFile" style="font-size: 18px;">上传</i-button>
                <i-button size="large" @click="clearFile" style="font-size: 18px; margin-left: 50px;">清除</i-button> <!-- Increased left margin -->
            </div>
        </div>
    </div>
</template>

<!-- Your script and style sections remain unchanged -->


<script>
import {RadioGroup, Radio, Select, Option, Message, Upload, Button as IButton} from 'view-design';
import {fetchAllSchools} from '@/api/schmanage';

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

            // this.uploadData.schoolName = this.selectedSchool;

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
                        this.schools = response.data.map(school => ({
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
    margin-bottom: 40px; /* Increase margin */
}
.file-import {
    display: flex;
    flex-direction: column; /* Change to column layout */
    align-items: center; /* Center align */
}
.file-select {
    display: flex;
    align-items: center;
    margin-bottom: 30px; /* Increase margin */
}
.selected-file {
    margin-left: 10px;
    font-size: 16px;
}
.button-group {
    display: flex;
    justify-content: center; /* Center align */
}
.button-group i-button {
    margin: 0 10px; /* Adjust margin */
}
</style>
