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
          >查询</i-button>

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

    <Card v-if="pdfUrl" class="preview-card" style="margin-top: 20px">
      <h2>简历预览</h2>
      <iframe :src="pdfUrl" style="width: 100%; height: 600px; border: none" />
    </Card>
  </div>
</template>

<script>
import axios from "axios";

// ⚙️ 直连地址集中配置：方便切换环境
const JAVA_BASE  = "http://localhost:8081";        // 如果 Java 在服务器，改为 "http://202.120.84.249:8081"
const FLASK_BASE = "http://202.120.84.249:5000";   // Flask 服务器地址

export default {
  name: "resumegenerate",
  data() {
    return {
      formData: {
        selectedSchool: null,
        studentId: "",
        photo: null,
      },
      schools: [],
      pdfUrl: "",
      wordBlob: null,
    };
  },
  created() {
    // 学校列表（仍走 /api -> 8081/api 的代理）
    axios
      .get("/api/sch/schInfo")
      .then((res) => {
        console.log("学校接口返回：", res.data);
        const { code, data, msg } = res.data || {};
        if (code === "00000" && Array.isArray(data)) {
          this.schools = data;
        } else {
          console.warn("学校数据格式不正确或为空：", msg);
        }
      })
      .catch((err) => {
        console.error("获取学校信息失败：", err);
      });
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

      // 学生信息查询（仍走代理 /api -> 8081/api）
      try {
        const queryRes = await fetch("/api/studentInfo/query", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            schId: this.formData.selectedSchool.schId,
            studentId: this.formData.studentId,
          }),
        });
        const queryJson = await queryRes.json();
        console.log("🎓 学生信息:", queryJson?.data);
      } catch (err) {
        console.warn("学生信息查询失败", err);
      }

      // 生成 Word 的表单
      const fd = new FormData();
      fd.append("photo", this.formData.photo || new Blob([], { type: "image/jpeg" }));
      fd.append("studentId", this.formData.studentId);
      fd.append("schId", this.formData.selectedSchool.schId);

      console.log("📤 提交 Java 生成 Word 数据：");
      for (const pair of fd.entries()) console.log(`${pair[0]}:`, pair[1]);

      try {
        // 1) Java 直连生成 Word（需要 Java Controller 上有 @CrossOrigin）
        const javaUrl = `${JAVA_BASE}/resume/generateWord`;
        console.log("➡️ 请求 Java 接口:", javaUrl);
        const wordRes = await fetch(javaUrl, { method: "POST", body: fd });
        console.log("⬅️ Java 响应状态:", wordRes.status);
        if (!wordRes.ok) {
          const errText = await wordRes.text();
          console.error("❌ Java 响应内容:", errText);
          throw new Error("Java 生成 Word 失败");
        }
        const wordBlob = await wordRes.blob();
        this.wordBlob = wordBlob;
        console.log("✅ 已获取 Word Blob，大小:", wordBlob.size);

        // 2) Flask 直连转 PDF（JSON 返回 download_url）
        const pdfForm = new FormData();
        pdfForm.append("file", wordBlob, "resume.docx");

        const flaskUrl = `${FLASK_BASE}/convert_word_to_pdf_json`;
        console.log("➡️ 请求 Flask 接口:", flaskUrl);
        const pdfRes = await fetch(flaskUrl, { method: "POST", body: pdfForm });
        console.log("⬅️ Flask 响应状态:", pdfRes.status);

        // 尝试解析 JSON；若失败打印原文，便于排错
        let pdfJson;
        try {
          pdfJson = await pdfRes.clone().json();
        } catch {
          const txt = await pdfRes.text();
          console.error("❌ Flask 非 JSON 响应，前 200 字:", txt.slice(0, 200));
          throw new Error(`Flask 响应不是 JSON（${pdfRes.status}）`);
        }

        console.log("📄 Flask JSON 响应:", pdfJson);

        if (pdfJson?.success && pdfJson?.download_url) {
          // 直连：把相对路径拼上后端基址，iframe 直接预览
          const abs = new URL(pdfJson.download_url, FLASK_BASE);
          this.pdfUrl = abs.toString();
          this.$Message.success("PDF 转换成功，已加载预览");
        } else {
          throw new Error(pdfJson?.error || "PDF 转换失败");
        }
      } catch (err) {
        console.error("❌ handleSearch 异常:", err);
        this.$Message.error("简历生成或转换失败");
      }
    },

    handleClear() {
      this.formData = { selectedSchool: null, studentId: "", photo: null };
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
