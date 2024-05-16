<template>
    <div class="container">
        <!-- 学校选择 -->
        <div class="school-selection centered" style="margin-bottom: 50px; font-size: 24px;">
            <Select v-model="selectedSchool" placeholder="请选择学校" style="width: 200px;">
                <Option v-for="opt in schools" :key="opt.value" :value="opt.value">{{ opt.label }}</Option>
            </Select>
        </div>

        <div class="file-imports">
            <!-- 课程信息文件导入 -->
            <div class="file-import">
                <h2 style="font-size: 24px; margin-bottom: 20px;">课程信息导入</h2>
                <div class="file-select">
                    <Upload
                        :action="courseUploadUrl"
                        :before-upload="handleCourseBeforeUpload"
                        :data="courseUploadData"
                        :show-upload-list="false"
                        :auto-upload="false"
                        ref="courseUpload"
                    >
                        <i-button type="primary" size="large" style="font-size: 18px;">选择课程信息文件</i-button>
                    </Upload>
                    <div class="selected-file" style="font-size: 16px;">{{ selectedCourseFileName }}</div>
                </div>
                <div class="button-group">
                    <i-button type="primary" size="large" :disabled="!selectedCourseFile" @click="uploadCourseFile"
                              style="font-size: 18px;">上传
                    </i-button>
                    <i-button size="large" @click="clearCourseFile" style="font-size: 18px; margin-left: 50px;">清除</i-button>
                </div>
            </div>

            <!-- 学生信息文件导入 -->
            <div class="file-import">
                <h2 style="font-size: 24px; margin-bottom: 20px;">学生信息导入</h2>
                <div class="file-select">
                    <Upload
                        :action="studentUploadUrl"
                        :before-upload="handleStudentBeforeUpload"
                        :data="studentUploadData"
                        :show-upload-list="false"
                        :auto-upload="false"
                        ref="studentUpload"
                    >
                        <i-button type="primary" size="large" style="font-size: 18px;">选择学生信息文件</i-button>
                    </Upload>
                    <div class="selected-file" style="font-size: 16px;">{{ selectedStudentFileName }}</div>
                </div>
                <div class="button-group">
                    <i-button type="primary" size="large" :disabled="!selectedStudentFile" @click="uploadStudentFile"
                              style="font-size: 18px;">上传
                    </i-button>
                    <i-button size="large" @click="clearStudentFile" style="font-size: 18px; margin-left: 50px;">清除</i-button>
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
            studentUploadUrl: '',
            studentUploadData: {},
            schools: [],
        };
    },
    created() {
        this.fetchSchools();
    },
    methods: {
        handleCourseBeforeUpload(file) {
            // Handle file type validation and setting file data for course upload
            if (!file.type.includes('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')) {
                Message.error('请选择XLSX文件');
                return false;
            }
            this.selectedCourseFileName = file.name;
            this.selectedCourseFile = file;
            return true;
        },

        handleStudentBeforeUpload(file) {
            // Handle file type validation and setting file data for course upload
            if (!file.type.includes('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')) {
                Message.error('请选择XLSX文件');
                return false;
            }
            this.selectedStudentFileName = file.name;
            this.selectedStudentFile = file;
            return true;
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
            // Clear selected course file
            this.clearFile('selectedCourseFileName', 'selectedCourseFile', 'courseUploadData', 'courseUploadUrl', 'courseUpload');
        },
        clearStudentFile() {
            // Clear selected student file
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
.container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
}

.file-imports {
    display: flex;
    justify-content: space-between;
    width: 100%;
}

.file-import {
    width: 48%;
}

.file-import {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 40px;
}

.file-select {
    display: flex;
    align-items: center;
    margin-bottom: 30px;
}

.selected-file {
    margin-left: 10px;
    font-size: 16px;
}

.button-group {
    display: flex;
    justify-content: center;
}

.button-group i-button {
    margin: 0 10px;
}
</style>
