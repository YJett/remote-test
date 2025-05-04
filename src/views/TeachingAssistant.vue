<template>
  <div class="teaching-assistant">
    <div class="form-container">
      <!-- 第一行：课程名和上传文件 -->
      <div class="form-row">
        <div class="input-group">
          <label>课程名</label>
          <Input v-model="courseName" style="width:200px" clearable placeholder="请输入课程名" />
          <span class="required-hint">*</span>
        </div>
        
        <div class="input-group">
          <label>上传文件</label>
          <div style="width: 200px; display: flex; justify-content: flex-start">
            <Upload
              action="http://127.0.0.1:5000/generate_outline"
              :before-upload="handleBeforeUpload"
              :on-success="handleSuccess"
              :on-error="handleError"
              :show-upload-list="false"
              :with-credentials="true"
              tip="支持上传docx、txt、pdf格式文件"
              tip-class="upload-tip"
              class="upload-component"
            >
              <Button icon="ios-cloud-upload-outline">选择文件</Button>
            </Upload>
            <div v-if="selectedFile" class="selected-file">
              已选择: {{ selectedFile.name }}
            </div>
          </div>
        </div>
      </div>
      
      <!-- 第二行：PPT模板和功能按钮 -->
      <div class="form-row">
        <div class="input-group">
          <label>PPT模板</label>
          <div style="width: 200px; display: flex; justify-content: flex-start">
            <Upload
              action="http://127.0.0.1:5000/upload_template"
              :before-upload="handlePPTBeforeUpload"
              :on-success="handlePPTSuccess"
              :on-error="handlePPTError"
              :show-upload-list="false"
              tip="支持上传pptx格式文件，单个文件大小不超过20MB"
              tip-class="upload-tip"
              class="upload-component"
            >
              <Button icon="ios-cloud-upload-outline">选择PPT模板</Button>
            </Upload>
            <div v-if="selectedTemplate" class="selected-file">
              已选择: {{ selectedTemplate.name }}
            </div>
          </div>
        </div>
        
        <div class="action-buttons">
          <Button type="primary" @click="generatePPT" :disabled="!selectedFile || !courseName.trim()" class="action-btn">生成PPT</Button>
          <Button type="success" @click="showCourseGraph" class="action-btn">课程图谱</Button>
        </div>
      </div>
    </div>

    <!-- 进度显示 -->
    <div v-if="showProgress" class="progress-container">
      <div class="progress-steps">
        <div :class="['step', { active: currentStep === 1, completed: currentStep > 1 }]">
          <div class="step-number">1</div>
          <div class="step-text">生成大纲</div>
        </div>
        <div :class="['step', { active: currentStep === 2, completed: currentStep > 2 }]">
          <div class="step-number">2</div>
          <div class="step-text">生成PPT</div>
        </div>
        <div :class="['step', { active: currentStep === 3, completed: currentStep > 3 }]">
          <div class="step-number">3</div>
          <div class="step-text">下载文件</div>
        </div>
      </div>
      <Progress :percent="progressPercent" />
      <p class="progress-text">{{ progressText }}</p>
    </div>

    <div v-if="statusMessage" :class="['status-message', statusType]">
      {{ statusMessage }}
    </div>
    
    <!-- 大纲预览和编辑弹窗 -->
    <Modal v-model="showMarkdownModal" title="大纲预览" width="800" :mask-closable="false">
      <Input v-model="markdownContent" type="textarea" :rows="15" placeholder="请编辑大纲内容" />
      <div slot="footer">
        <Button type="text" @click="cancelOutlineEdit">取消</Button>
        <Button type="primary" @click="confirmOutline">确认生成PPT</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import { Input, Upload, Button, Message, Modal, Progress } from 'view-design';

export default {
  name: 'TeachingAssistant',
  components: {
    Input,
    Upload,
    Button,
    Modal,
    Progress
  },
  data() {
    return {
      courseName: '',
      selectedFile: null,
      selectedTemplate: null,
      templateId: null,
      showMarkdownModal: false,
      markdownContent: '',
      showProgress: false,
      currentStep: 0,
      progressPercent: 0,
      progressText: '准备开始...',
      statusMessage: '',
      statusType: '',
      templateList: [
        { value: 'template1', label: '模板1' },
        { value: 'template2', label: '模板2' },
        { value: 'template3', label: '模板3' }
      ],
      allowedFileTypes: {
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
        'text/plain': 'txt',
        'application/pdf': 'pdf'
      }
    }
  },
  methods: {
    handleBeforeUpload(file) {
      // 未登录时禁止上传
      if (!this.$store.state.userInfo) {
        this.$Message.error('请先登录');
        return false;
      }
      // 验证文件类型
      const isValidType = Object.keys(this.allowedFileTypes).includes(file.type)
      if (!isValidType) {
        this.$Message.error('请上传docx、txt或pdf格式的文件')
        return false
      }
      // 验证文件大小
      const isLt10M = file.size / 1024 / 1024 < 10
      if (!isLt10M) {
        this.$Message.error('文件大小不能超过10MB')
        return false
      }
      this.selectedFile = file
      return true
    },
    handleSuccess(res, file) {
      const fileType = this.allowedFileTypes[file.type]
      if (res.success && res.outline) {
        // 格式化大纲内容
        let formattedOutline = res.outline
        if (file.name.endsWith('.pdf')) {
          formattedOutline = formattedOutline
            .replace(/\r\n/g, '\n')
            .replace(/\n{3,}/g, '\n\n')
            .trim()
        }
        
        this.markdownContent = formattedOutline
        this.showMarkdownModal = true
        this.updateProgress(1, '请检查并确认大纲', 50)
        this.$Message.success(`${fileType}文件解析成功`)
      } else {
        this.$Message.error('文件解析失败：' + (res.error || '未获取到内容'))
      }
    },
    handleError(error, file) {
      const fileType = this.allowedFileTypes[file.type] || '未知类型'
      let errorMessage = `${fileType}文件上传失败`
      
      // 根据错误响应提供更详细的错误信息
      if (error.response) {
        const response = error.response
        
        if (response.data && response.data.error) {
          errorMessage += `：${response.data.error}`
        } else if (response.status === 413) {
          errorMessage += '：文件太大'
        } else if (response.status === 415) {
          errorMessage += '：不支持的文件类型'
        } else if (response.status === 500) {
          errorMessage += '：服务器内部错误，请检查后端日志'
        } else if (response.status === 404) {
          errorMessage += '：API接口不存在，请检查后端服务是否正确启动'
        }
      } else if (error.message) {
        errorMessage += `：${error.message}`
      }
      
      this.showStatus(errorMessage, 'error')
      
      // 尝试使用手动方式上传文件
      this.tryManualUpload(file);
    },
    
    // 添加手动上传方法作为备选方案
    async tryManualUpload(file) {
      try {
        const formData = new FormData();
        formData.append('file', file);
        
        this.showStatus('正在尝试替代方式上传...', 'info');
        
        const response = await this.$axios.post('http://127.0.0.1:5000/generate_outline', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          timeout: 60000 // 增加超时时间到60秒
        });
        
        if (response.data && response.data.success) {
          this.handleSuccess(response.data, file);
        } else {
          throw new Error('替代上传方式也失败了');
        }
      } catch (error) {
        console.error('替代上传方式失败:', error);
        // 不再显示额外的错误消息，避免重复提示
      }
    },
    handlePPTBeforeUpload(file) {
      // 未登录时禁止上传PPT模板
      if (!this.$store.state.userInfo) {
        this.$Message.error('请先登录');
        return false;
      }
      // 处理PPT模板上传前的逻辑
      const isValidType = file.type === 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
      if (!isValidType) {
        this.$Message.error('请上传pptx格式的文件')
        return false
      }
      // 验证文件大小
      const isLt20M = file.size / 1024 / 1024 < 20
      if (!isLt20M) {
        this.$Message.error('文件大小不能超过20MB')
        return false
      }
      this.selectedTemplate = file
      return true
    },
    handlePPTSuccess(res, file) {
      if (res.success) {
        this.templateId = res.templateId
        this.showStatus('PPT模板上传成功', 'success')
      } else {
        this.showStatus('PPT模板上传失败：' + (res.error || '未知错误'), 'error')
      }
    },
    handlePPTError(error, file) {
      this.showStatus('PPT模板上传失败', 'error')
      console.error('模板上传失败:', error)
    },
    async generatePPT() {
      // 未登录时禁止生成PPT
      if (!this.$store.state.userInfo) {
        this.$Message.error('请先登录');
        return;
      }
      if (!this.selectedFile) {
        this.$Message.warning('请先选择文件')
        return
      }
      
      if (!this.courseName.trim()) {
        this.$Message.warning('请输入课程名')
        return
      }
  
      this.showProgress = true
      this.resetSteps()
      
      try {
        // 创建FormData对象
        const formData = new FormData()
        formData.append('file', this.selectedFile)
        
        // 添加课程名称到请求中
        formData.append('course_name', this.courseName)
        
        // 生成大纲
        this.updateProgress(1, '正在生成大纲...', 30)
        
        // 修改请求配置，增加超时时间和错误处理
        const outlineResponse = await this.$axios.post('http://127.0.0.1:5000/generate_outline', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          timeout: 2000000, // 增加超时时间到200秒
          validateStatus: function (status) {
            return status === 200; // 只接受200状态码
          }
        })
        
        if (!outlineResponse.data.success) {
          throw new Error(outlineResponse.data.error || '生成大纲失败')
        }
        
        // 显示大纲预览
        let formattedOutline = outlineResponse.data.outline
        if (this.selectedFile.name.endsWith('.pdf')) {
          formattedOutline = formattedOutline
            .replace(/\r\n/g, '\n')
            .replace(/\n{3,}/g, '\n\n')
            .trim()
        }
        
        this.markdownContent = formattedOutline
        this.showMarkdownModal = true
        this.updateProgress(1, '请检查并确认大纲', 50)
        
      } catch (error) {
        // 添加更详细的错误信息处理
        console.error('生成大纲错误详情:', error)
        
        let errorMessage = '服务器连接错误';
        if (error.response) {
          if (error.response.status === 500) {
            errorMessage = '服务器内部错误，请检查后端日志';
            if (error.response.data) {
              try {
                // 如果响应是Blob类型，需要先读取内容
                if (error.response.data instanceof Blob) {
                  const reader = new FileReader();
                  reader.onload = () => {
                    try {
                      const errorData = JSON.parse(reader.result);
                      if (errorData.error) {
                        this.showStatus(`生成失败: ${errorData.error}`, 'error');
                      }
                    } catch (e) {
                      // 忽略解析错误
                    }
                  };
                  reader.readAsText(error.response.data);
                } else {
                  const errorData = typeof error.response.data === 'string' 
                    ? JSON.parse(error.response.data) 
                    : error.response.data;
                  if (errorData.error) {
                    errorMessage = errorData.error;
                  }
                }
              } catch (e) {
                // 忽略解析错误
              }
            }
          }
        } else if (error.message) {
          errorMessage = error.message;
        }
        
        this.showStatus(`生成失败: ${errorMessage}`, 'error')
        this.showProgress = false
      }
    },
    async confirmOutline() {
      // 未登录时禁止确认生成PPT
      if (!this.$store.state.userInfo) {
        this.$Message.error('请先登录');
        return;
      }
      if (!this.markdownContent.trim()) {
        this.$Message.warning('请输入大纲内容')
        return
      }
      
      if (!this.courseName.trim()) {
        this.$Message.warning('请输入课程名')
        return
      }
      
      this.showMarkdownModal = false
      
      try {
        this.updateProgress(2, '正在生成PPT...', 60)
        
        // 构建请求数据
        const requestData = {
          outline: this.markdownContent,
          course_name: this.courseName // 确保课程名被传递到后端
        }
        
        // 如果有模板ID，添加到请求中
        if (this.templateId) {
          requestData.templateId = this.templateId
        }
        
        // 修改为正确的URL路径
        const response = await this.$axios.post('http://127.0.0.1:5000/generate_ppt', requestData, {
          responseType: 'blob'  // 设置响应类型为blob
        })
        
        this.updateProgress(3, '准备下载...', 90)
        
        // 创建下载链接
        const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation' })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${this.courseName}.pptx` // 使用课程名作为文件名
        a.click()
        window.URL.revokeObjectURL(url)
        
        this.updateProgress(3, '生成完成！', 100)
        this.showStatus('PPT生成成功！', 'success')
        
      } catch (error) {
        console.error('生成PPT错误详情:', error)
        this.showStatus(`生成失败: ${error.message || '服务器连接错误'}`, 'error')
      }
    },
    cancelOutlineEdit() {
      this.showMarkdownModal = false
      this.showProgress = false
      this.resetSteps()
    },
    showCourseGraph() {
      // 未登录时禁止查看课程图谱
      if (!this.$store.state.userInfo) {
        this.$Message.error('请先登录');
        return;
      }
      // 显示课程图谱的逻辑
      this.$Message.info('正在加载课程图谱...')
    },
    updateProgress(step, text, progress) {
      this.currentStep = step
      this.progressText = text
      this.progressPercent = progress
    },
    resetSteps() {
      this.currentStep = 0
      this.progressText = '准备开始...'
      this.progressPercent = 0
    },
    showStatus(message, type) {
      this.statusMessage = message
      this.statusType = type
      
      // 使用iView的Message组件显示消息
      if (type === 'success') {
        this.$Message.success(message)
      } else if (type === 'error') {
        this.$Message.error(message)
      } else {
        this.$Message.info(message)
      }
    },  // 这里的逗号是正确的，因为后面还有方法
    
    // 添加检查后端服务连接的方法
    // async checkBackendConnection() {
    //   try {
    //     // 使用简单的GET请求检查连接
    //     const response = await this.$axios.get('http://127.0.0.1:5000/health', {
    //       timeout: 5000
    //     }).catch(async error => {
    //       // 如果health接口不存在，尝试其他已知接口
    //       if (error.response && error.response.status === 404) {
    //         return await this.$axios.get('http://127.0.0.1:5000/generate_outline', {
    //           timeout: 5000,
    //           // 只检查连接，不需要处理响应内容
    //           validateStatus: function (status) {
    //             return status >= 200 && status < 600
    //           }
    //         });
    //       }
    //       throw error; // 如果不是404错误，继续抛出
    //     });
    //     
    //     this.showStatus('后端服务连接成功', 'success');
    //     return true;
    //   } catch (error) {
    //     let errorMsg = '无法连接到后端服务，请确保服务已启动';
    //     
    //     if (error.response) {
    //       if (error.response.status === 500) {
    //         errorMsg = '后端服务已连接，但存在内部错误';
    //       }
    //     }
    //     
    //     this.showStatus(errorMsg, 'error');
    //     return false;
    //   }
    // }
  },
  
  // 添加mounted钩子
  // mounted() {
  // 组件挂载时检查后端连接
  // this.checkBackendConnection()
  // }
  // mounted() {
  //   // 登录检测逻辑：如果未登录则跳转到登录页
  //   if (!this.$store.state.userInfo) {
  //     this.$Message.error('请先登录');
  //     this.$router.push('/login');
  //   }
  // },
}
</script>

<style scoped>
.teaching-assistant {
  padding: 30px;
  background-color: #f8f8f9;
  min-height: 100vh;
}

.form-container {
  max-width: 98%;
  margin: 0 auto;
  background: #fff;
  padding: 30px 30px;
  border-radius: 12px;
  box-shadow: 0 2px 16px 0 rgba(0,0,0,0.08);
}

.form-row {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-bottom: 30px;
}

.input-group {
  display: flex;
  align-items: center;
  margin-right: 90px;
}

.input-group label {
  width: 80px;
  text-align: left;
  margin-right: 25px;
  font-size: 14px;
  color: #515a6e;
}

.select-btn {
  margin-left: 15px;
}

.action-buttons {
  display: flex;
  gap: 15px;
}

.action-btn {
  min-width: 100px;
  height: 36px;
  font-size: 14px;
}

.upload-component {
  width: 100%;
}

.upload-component {
  position: relative;
}

.upload-component :deep(.ivu-upload-tip) {
  font-size: 13px;
  color: #2d8cf0;
  margin-top: 8px;
  margin-bottom: 8px;
  line-height: 1.5;
  display: block;
  text-align: left;
  font-weight: 500;
}

.upload-tip {
  font-size: 12px;
  color: #515a6e;
  margin-top: 8px;
  margin-bottom: 4px;
  display: block;
  text-align: left;
}

.selected-file {
  margin-top: 8px;
  font-size: 13px;
  color: #515a6e;
}

.progress-container {
  margin: 20px auto;
  max-width: 98%;
  background: #fff;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 8px 0 rgba(0,0,0,0.05);
}

.progress-steps {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.step {
  text-align: center;
  flex: 1;
  position: relative;
  padding: 10px;
}

.step-number {
  width: 30px;
  height: 30px;
  background-color: #ccc;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 5px;
  color: white;
}

.step.active .step-number {
  background-color: #2d8cf0;
}

.step.completed .step-number {
  background-color: #19be6b;
}

.progress-text {
  margin-top: 10px;
  text-align: center;
  color: #515a6e;
}

.status-message {
  margin: 20px auto;
  max-width: 98%;
  padding: 10px 15px;
  border-radius: 4px;
}

.status-message.success {
  background-color: #e8f5e9;
  color: #19be6b;
}

.status-message.error {
  background-color: #ffebee;
  color: #ed4014;
  margin-left: 5px;
  font-size: 16px;
}
</style>