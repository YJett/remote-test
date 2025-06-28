<template>
    <div class="container">
        <Card class="form-card" style="margin-bottom: 0">
            <i-form inline class="form-container">
                <FormItem label="学校">
                    <Select v-model="formData.selectedSchool" placeholder="请选择学校" style="width: 250px;">
                        <Option v-for="opt in schools" :key="opt.value" :value="opt.value">{{ opt.label }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="学生学号">
                    <i-input v-model="formData.studentId" placeholder="请输入学生学号" style="width: 250px;"></i-input>
                </FormItem>
                <FormItem label="照片">
                    <input type="file" accept="image/*" @change="handlePhotoUpload" ref="photoInput" style="width: 250px;" />
                </FormItem>
                <FormItem class="button-container">
                    <i-button type="primary" @click="handleSearch" shape="round" class="query-button">查询</i-button>
                    <i-button type="warning" @click="handleClear" shape="round" class="clear-button">清除</i-button>
                    <i-button
                        v-if="wordBlob"
                        type="success"
                        @click="downloadWord"
                        shape="round"
                        class="download-button"
                    >下载 Word</i-button>
                </FormItem>
            </i-form>
        </Card>

        <!-- PDF 预览区域 -->
        <Card v-if="pdfUrl" class="preview-card" style="margin-top: 20px;">
            <h2>简历预览</h2>
            <iframe :src="pdfUrl" style="width: 100%; height: 600px; border: none;"></iframe>
        </Card>
    </div>
</template>

<script>
export default {
    name: 'resumegenerate',
    data() {
        return {
            formData: {
                selectedSchool: '',
                studentId: '',
                photo: null,
            },
            schools: [
                { value: 'school1', label: '学校 A' },
                { value: 'school2', label: '学校 B' },
            ],
            pdfUrl: '',
            wordBlob: null,
            staticPdfUrl: './3929.pdf', 
            staticWordUrl: './resume.docx',
        };
    },
    methods: {
        handlePhotoUpload(event) {
            const file = event.target.files[0];
            if (file) {
                this.formData.photo = file;
            }
        },
        handleSearch() {
            // 直接使用静态 PDF 文件路径
            console.log('staticPdfUrl:', this.staticPdfUrl); // 调试路径
            this.pdfUrl = this.staticPdfUrl;
            console.log('pdfUrl:', this.pdfUrl); // 确认 pdfUrl 是否设置

            // 为下载准备 Blob
            fetch(this.staticPdfUrl)
                .then(response => response.blob())
                .then(blob => {
                    this.wordBlob = blob;
                })
                .catch(error => {
                    this.$Message.error('加载 Word 文档失败！');
                    console.error(error);
                });
        },
        handleClear() {
            this.formData = {
                selectedSchool: '',
                studentId: '',
                photo: null,
            };
            this.pdfUrl = '';
            this.pdfBlob = null;
            if (this.$refs.photoInput) this.$refs.photoInput.value = '';
        },
        downloadWord() {
            if (this.wordBlob) {
                const link = document.createElement('a');
                link.href = URL.createObjectURL(this.wordBlob);
                link.download = 'resume.docx';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            } else {
                this.$Message.warning('请先查询生成简历！');
            }
        },
    },
};
</script>

<style scoped>
h1,
h2 {
    color: #2c3e50;
    margin-bottom: 20px;
}
.preview-card {
    text-align: center;
}
.preview-card iframe {
    max-width: 100%;
    box-sizing: border-box;
}
.form-container {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
}
</style>