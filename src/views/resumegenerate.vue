<template>
  <div class="container">

    <Card class="form-card" style="margin-bottom: 0">
      <i-form inline class="form-container">
        <FormItem label="学校">
          <Select
            v-model="formData.selectedSchool"
            placeholder="请选择学校"
            style="width: 250px"
          >
            <Option
              v-for="opt in schools"
              :key="opt.schId"
              :value="opt"
            >
              {{ opt.schName }}
            </Option>
          </Select>
        </FormItem>

        <FormItem label="学生学号">
          <i-input
            v-model="formData.studentId"
            placeholder="请输入学生学号"
            style="width: 250px"
          />
        </FormItem>

        <FormItem label="照片">
          <input
            type="file"
            accept="image/*"
            @change="handlePhotoUpload"
            ref="photoInput"
            style="width: 250px"
          />
        </FormItem>

        <FormItem class="button-container">
          <i-button
            type="primary"
            @click="handleSearch"
            shape="round"
            class="query-button"
          >生成并预览</i-button>

          <i-button
            type="warning"
            @click="handleClear"
            shape="round"
            class="clear-button"
          >清除</i-button>

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

    <Card v-if="pdfUrl" class="preview-card">
      <h2>简历预览</h2>
      <iframe :src="pdfUrl" class="pdf-frame" />
    </Card>
  </div>
</template>

<script>
import axios from "axios";

const JAVA_BASE  = "http://localhost:8081";
const FLASK_BASE = "http://202.120.84.249:5000";

function withTimeout(ms = 30000) {
  const ac = new AbortController();
  const t = setTimeout(() => ac.abort(`timeout ${ms}ms`), ms);
  return { signal: ac.signal, cancel: () => clearTimeout(t) };
}
function revokeIfBlobUrl(url) {
  if (url && typeof url === "string" && url.startsWith("blob:")) {
    try { URL.revokeObjectURL(url); } catch {}
  }
}

export default {
  name: "resumegenerate",
  data() {
    return {
      formData: { selectedSchool: null, studentId: "", photo: null },
      schools: [],
      pdfUrl: "",
      wordBlob: null,
    };
  },
  async created() {
    try {
      const res = await axios.get("/api/sch/schInfo");
      const { code, data } = res.data || {};
      if (code === "00000" && Array.isArray(data)) {
        this.schools = data;
      }
    } catch {}
  },
  methods: {
    handlePhotoUpload(e) {
      const file = e.target.files && e.target.files[0];
      if (file) this.formData.photo = file;
    },
    async handleSearch() {
      if (!this.formData.selectedSchool?.schId || !this.formData.studentId) {
        this.$Message.warning("请填写学校和学号");
        return;
      }
      const fd = new FormData();
      fd.append("photo", this.formData.photo || new Blob([], { type: "image/jpeg" }));
      fd.append("studentId", this.formData.studentId);
      fd.append("schId", this.formData.selectedSchool.schId);
      try {
        const tJava = withTimeout(30000);
        const wordRes = await fetch(`${JAVA_BASE}/resume/generateWord`, {
          method: "POST", body: fd, signal: tJava.signal
        }).finally(() => tJava.cancel());
        if (!wordRes.ok) throw new Error(`Java 生成 Word 失败（HTTP ${wordRes.status}）`);
        const wordBlob = await wordRes.blob();
        if (!wordBlob || wordBlob.size === 0) throw new Error("Java 返回 Word 为空");
        this.wordBlob = wordBlob;
        const pdfForm = new FormData();
        pdfForm.append("file", wordBlob, "resume.docx");
        const tFlask = withTimeout(30000);
        const pdfRes = await fetch(`${FLASK_BASE}/convert_word_to_pdf_lo`, {
          method: "POST", body: pdfForm, signal: tFlask.signal
        }).finally(() => tFlask.cancel());
        if (!pdfRes.ok) {
          const raw = await pdfRes.clone().text().catch(() => "");
          throw new Error(raw || `Flask HTTP ${pdfRes.status}`);
        }
        const pdfBlob = await pdfRes.blob();
        if (!pdfBlob || pdfBlob.size === 0) throw new Error("Flask 返回 PDF 为空");
        revokeIfBlobUrl(this.pdfUrl);
        this.pdfUrl = URL.createObjectURL(pdfBlob);
        this.$Message.success("PDF 转换成功，已加载预览");
      } catch (err) {
        const isAbort = (err?.name === "AbortError") || String(err?.message || "").includes("timeout");
        this.$Message.error(isAbort ? "请求超时，请检查后端" : (err?.message || "未知错误"));
      }
    },
    handleClear() {
      this.formData = { selectedSchool: null, studentId: "", photo: null };
      revokeIfBlobUrl(this.pdfUrl);
      this.pdfUrl = "";
      this.wordBlob = null;
      if (this.$refs.photoInput) this.$refs.photoInput.value = "";
    },
    downloadWord() {
      if (!this.wordBlob) return this.$Message.warning("请先生成简历！");
      const link = document.createElement("a");
      link.href = URL.createObjectURL(this.wordBlob);
      link.download = "简历.docx";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
  },
};
</script>

<style scoped>
h1, h2 {
  color: #2c3e50;
  margin-bottom: 20px;
}
.form-container {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.preview-card {
  margin-top: 20px;
  padding: 12px;
  text-align: center;
}
.pdf-frame {
  width: 100%;
  height: calc(100vh - 260px);
  border: none;
  box-shadow: 0 6px 16px rgba(0,0,0,0.08);
  border-radius: 8px;
}
</style>
