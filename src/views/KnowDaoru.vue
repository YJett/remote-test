<template>
    <div class="container">
        <!-- 选择身份 -->
        <div class="identity-selection">
            <RadioGroup v-model="selectedIdentity">
                <Radio label="sch">学校身份</Radio>
                <!--<Radio label="com">企业身份</Radio>-->
            </RadioGroup>
        </div>

        <!-- 学校输入框 -->
        <div v-if="selectedIdentity === 'sch'" class="school-input">
            <Input v-model="selectedSchool" placeholder="输入学校名称" style="width: 200px;" />
        </div>

        <!-- 文件导入功能 -->
        <div class="file-import">
            <Upload
                :action="uploadUrl"
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
import { RadioGroup, Radio, Upload, Button, Message, Input } from 'view-design';
import { importSchData, importComData, getSchools } from '../api/upload'; // Assuming you have an API function to fetch schools

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
    methods: {
        handleBeforeUpload(file) {
            // 检查文件类型是否为 XLSX
            if (!file.type.includes('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')) {
                Message.error('请选择XLSX文件');
                return false;
            }

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
                this.DaoRu(response.data);
            } else {
                Message.error('上传失败');
            }
        },
        DaoRu(data) {
            // 根据文件内容和用户选择的身份进行数据处理和导入
            const payload = {
                schoolName: this.selectedSchool,
                fileData: data
            };
            if (this.selectedIdentity === 'sch') {
                // 处理学校数据
                this.uploadUrl = "api/konwledge/importKpKonwledgeData";
            } else if (this.selectedIdentity === 'com') {
                // 处理企业数据
                this.uploadUrl = "api/com/importComData";
            }
            this.uploadKey++;
        },
        clearFile() {
            // 清除选中的文件信息
            this.selectedFileName = '';
            this.selectedFile = null;
        },
        uploadFile() {
            // 执行文件上传
            if (this.selectedFile) {
                // 创建 payload 对象
                const payload = {
                    schoolName: this.selectedSchool,
                    fileData: this.selectedFile
                };

                // 根据用户选择的身份确定上传文件的接口地址
                let uploadEndpoint = '';
                if (this.selectedIdentity === 'sch') {
                    uploadEndpoint = "api/konwledge/importKpKonwledgeData";
                } else if (this.selectedIdentity === 'com') {
                    uploadEndpoint = "api/com/importComData";
                }

                // 使用 fetch 或者 axios 发送 POST 请求给后端
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
                        // 处理后端返回的数据
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
        fetchSchools() {
            // Fetch schools based on selected identity
            if (this.selectedIdentity === 'sch') {
                // Fetch schools only if the selected identity is 'sch'
                // Assuming getSchools is a function that fetches schools from the backend
                getSchools().then(response => {
                    this.schools = response.data;
                }).catch(error => {
                    console.error('Error fetching schools:', error);
                });
            }
        },
    },
    mounted() {
        // Fetch schools when the component is mounted
        this.fetchSchools();
    },
    watch: {
        // Watch for changes in selectedIdentity and fetch schools accordingly
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

.button-group {
    margin-left: 20px;
}

.button-group i-button {
    margin-left: 10px;
}
</style>
