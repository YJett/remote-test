<template>
    <div class="container">
        <!-- 学校选择 -->
        <div class="school-selection centered">
            <Select v-model="selectedSchool" placeholder="请选择学校" class="school-select">
                <Option v-for="opt in schools" :key="opt.value" :value="opt.value">{{ opt.label }}</Option>
            </Select>
        </div>

        <div class="file-imports">
            <!-- 课程信息文件导入 -->
            <div class="file-import course-import">
                <h2>课程信息导入</h2>
                <div class="file-select centered"> <!-- Centered the file-select div -->
                    <Upload
                        :action="courseUploadUrl"
                        :before-upload="handleCourseBeforeUpload"
                        :data="courseUploadData"
                        :show-upload-list="false"
                        :auto-upload="false"
                        ref="courseUpload"
                    >
                        <i-button type="primary" size="large" class="select-button">选择课程信息文件</i-button>
                    </Upload>
                    <div class="selected-file">{{ selectedCourseFileName }}</div>
                </div>
                <div class="button-group"> <!-- Removed 'centered' class from button-group -->
                    <i-button type="primary" size="large" :disabled="!selectedCourseFile" @click="uploadCourseFile" class="action-button">上传</i-button>
                    <i-button size="large" @click="clearCourseFile" class="clear-button">清除</i-button>
                </div>
            </div>

            <!-- 学生信息文件导入 -->
            <div class="file-import student-import">
                <h2>学生信息导入</h2>
                <div class="file-select centered"> <!-- Centered the file-select div -->
                    <Upload
                        :action="studentUploadUrl"
                        :before-upload="handleStudentBeforeUpload"
                        :data="studentUploadData"
                        :show-upload-list="false"
                        :auto-upload="false"
                        ref="studentUpload"
                    >
                        <i-button type="primary" size="large" class="select-button">选择学生信息文件</i-button>
                    </Upload>
                    <div class="selected-file">{{ selectedStudentFileName }}</div>
                </div>
                <div class="button-group"> <!-- Removed 'centered' class from button-group -->
                    <i-button type="primary" size="large" :disabled="!selectedStudentFile" @click="uploadStudentFile" class="action-button">上传</i-button>
                    <i-button size="large" @click="clearStudentFile" class="clear-button">清除</i-button>
                </div>
            </div>
        </div>
    </div>
</template>




<script>
import { Upload, Message } from 'view-design';
import { fetchAllSchools } from '@/api/schmanage';

export default {
    data() {
        return {
            selectedSchool: '',
            selectedCourseFileName: '',
            selectedCourseFile: null,
            courseUploadUrl: 'api/courseandunit/importdata',
            courseUploadData: {},
            selectedStudentFileName: '',
            selectedStudentFile: null,
            studentUploadUrl: 'api/import/studentInfoData',
            studentUploadData: {},
            schools: [],
        };
    },
    created() {
        this.fetchSchools();
    },
    methods: {
        handleCourseBeforeUpload(file) {
            if (!file.type.includes('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')) {
                Message.error('请选择XLSX文件');
                return false;
            }
            this.selectedCourseFileName = file.name;
            this.selectedCourseFile = file;
            return false;
        },

        handleStudentBeforeUpload(file) {
            if (!file.type.includes('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')) {
                Message.error('请选择XLSX文件');
                return false;
            }
            this.selectedStudentFileName = file.name;
            this.selectedStudentFile = file;
            return false;
        },
        uploadCourseFile() {
            if (!this.selectedCourseFile) {
                Message.warning('请选择要上传的课程信息文件');
                return;
            }
            if (!this.selectedSchool) {
                Message.warning('请选择学校');
                return;
            }

            const formData = new FormData();
            formData.append('file', this.selectedCourseFile);
            formData.append('schoolName', this.selectedSchool);

            fetch(this.courseUploadUrl, {
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
        uploadStudentFile() {
            if (!this.selectedStudentFile) {
                Message.warning('请选择要上传的学生信息文件');
                return;
            }
            if (!this.selectedSchool) {
                Message.warning('请选择学校');
                return;
            }

            const formData = new FormData();
            formData.append('file', this.selectedStudentFile);
            formData.append('schoolName', this.selectedSchool);

            fetch(this.studentUploadUrl, {
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

        clearCourseFile() {
            this.clearFile('selectedCourseFileName', 'selectedCourseFile', 'courseUploadData', 'courseUploadUrl', 'courseUpload');
        },
        clearStudentFile() {
            this.clearFile('selectedStudentFileName', 'selectedStudentFile', 'studentUploadData', 'studentUploadUrl', 'studentUpload');
        },
        clearFile(fileNameProp, fileProp, uploadDataProp, uploadUrlProp, refName) {
            this[fileNameProp] = '';
            this[fileProp] = null;
            this.$refs[refName].clearFiles();
        }
    }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap');

.container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    padding: 20px;
    background: url('../../assets/backimg.png') no-repeat center center/cover;
}

.school-selection {
    margin-bottom: 50px;
    font-size: 24px;
    color: #333;
    font-family: 'Roboto', sans-serif;
    width: 300px;
}

.school-select {
    width: 300px;
    font-size: 20px;
    background: rgba(255, 255, 255, 0.9);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    border-radius: 10px;
    padding: 15px;
    color: #333;
}

.school-select:hover {
    background: rgba(255, 255, 255, 0.9);
}

.file-imports {
    display: flex;
    justify-content: space-between;
    width: 100%;
}

.file-import {
    width: 45%;
    background: rgba(255, 255, 255, 0.9);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    border-radius: 10px;
    padding: 20px;
    font-family: 'Roboto', sans-serif;
}

h2 {
    font-size: 24px;
    margin-bottom: 20px;
    color: black;
}

.file-select {
    display: flex;
    flex-direction: column; /* Adjusted to a column layout */
    align-items: center; /* Centered the items horizontally */
    margin-bottom: 30px;
}

.select-button {
    font-size: 18px;
    background: rgba(0, 123, 255, 0.9);
    border-color: rgba(0, 123, 255, 0.9);
    color: white;
    box-shadow: 0 4px 10px rgba(0, 123, 255, 0.3);
    transition: transform 0.3s, box-shadow 0.3s;
}

.select-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 15px rgba(0, 123, 255, 0.4);
}

.selected-file {
    margin-left: 10px;
    font-size: 16px;
    color: #333;
}

.button-group {
    display: flex;
    justify-content: center; /* Centered the buttons horizontally */
    align-items: center;
}

.action-button {
    font-size: 18px;
    background: rgba(0, 123, 255, 0.9);
    border-color: rgba(0, 123, 255, 0.9);
    color: white;
    box-shadow: 0 4px 10px rgba(40, 123, 255, 0.9);
    transition: transform 0.3s, box-shadow 0.3s;
}

.action-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 15px rgba(40, 167, 69, 0.4);
}

.clear-button {
    font-size: 18px;
    background: rgba(220, 53, 69, 0.9);
    border-color: rgba(220, 53, 69, 0.9);
    color: white;
    margin-left: 10px;
    box-shadow: 0 4px 10px rgba(220, 53, 69, 0.3);
    transition: transform 0.3s, box-shadow 0.3s;
}

.clear-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 15px rgba(220, 53, 69, 0.4);
}

.centered {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center; /* Centered content vertically */
}
.ivu-select-selection {
    width: 100%; /* Ensure dropdown width spans the container */
    text-align: center; /* Center text within dropdown */
}
</style>
