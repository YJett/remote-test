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
                <Option v-for="opt in schools" :key="opt.value" :value="opt.value">{{ opt.label }}</Option>
            </Select>
        </div>

        <!-- 文件导入功能 -->
        <div class="file-import">
            <div class="file-select">
                <!-- 绑定 schoolName 到 Upload 组件的 data 参数 -->
                <Upload
                    :action="uploadUrl"
                    :before-upload="handleBeforeUpload"
                    :on-success="handleUploadSuccess"
                    :format="['xlsx']"
                    :on-format-error="handleFormatError"
                    :on-exceeded-size="handleMaxSize"
                    :data="uploadData"
                    show-upload-list="false"
                >
                    <i-button type="primary" size="large">选择文件</i-button>
                </Upload>
                <div class="selected-file">{{ selectedFileName }}</div>
            </div>
            <div class="button-group">
                <!-- 移除了 @click="uploadFile" -->
                <i-button type="primary" size="large" :disabled="!selectedFile">上传</i-button>
                <i-button size="large" @click="clearFile">清除</i-button>
            </div>
        </div>
    </div>
</template>

<script>
import { RadioGroup, Radio, Select, Option, Message, Upload, Button as IButton } from 'view-design';
import {fetchAllSchools} from '../../api/schmanage'; // Updated API import


export default {
    data() {
        return {
            selectedIdentity: 'sch', // 默认选择学校身份
            selectedSchool: '', // 学校选择
            uploadUrl: '/api/knowledge/importKpKnowledgeData', // 上传文件接口地址
            selectedFileName: '', // 选中的文件名
            selectedFile: null, // 选中的文件对象
            uploadKey: 0, // 用于强制更新组件的 key
            schools: [], // 学校列表
            uploadData: {}, // 新增用于存储上传数据的对象
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
            this.selectedFileName = file.name; // 设置文件名
            this.selectedFile = file; // 设置文件对象
            // 准备上传数据，包括文件和学校名称
            this.uploadData = {
                file: file,
                schoolName: this.selectedSchool,
            };
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
                if (!this.selectedSchool) {
                    // 如果没有选择学校，则提醒用户选择
                    Message.warning('请选择学校');
                    return;
                }

                const formData = new FormData(); // 创建 FormData 对象
                formData.append('file', this.selectedFile); // 添加文件到 FormData
                formData.append('schoolName', this.selectedSchool); // 添加学校名称到 FormData

                const uploadEndpoint = "api/knowledge/importKpKnowledgeData"; // 确保与后端定义的一致
                fetch(uploadEndpoint, {
                    method: 'POST',
                    body: formData, // 发送 FormData 对象
                })
                    .then(response => response.json()) // 注意这里不需要指定 'application/json' 作为 Content-Type，因为 FormData 会自动设置正确的边界
                    .then(data => {
                        console.log(data);
                        if (data.code === '00000') { // 假设后端返回的响应体中有一个 code 属性来表示操作结果
                            Message.success('上传成功');
                        } else {
                            Message.error(data.message || '上传失败');
                        }
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
            fetchAllSchools() // Assuming this API endpoint returns all school information
                .then(response => {
                    console.log('Schools data from backend:', response.data); // Log received data
                    if (Array.isArray(response.data)) {
                        // Assuming each school object has a property 'schName' for the school's name
                        this.schools = response.data.map(school => ({ value: school.schName, label: school.schName }));
                    } else {
                        console.error('Invalid data format:', response.data);
                        Message.error('Failed to fetch schools: Invalid data format');
                    }
                })
                .catch(error => {
                    console.error('Failed to fetch schools:', error);
                    Message.error('Failed to fetch schools');
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
