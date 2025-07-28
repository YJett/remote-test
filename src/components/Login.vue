<template>
  <div class="login-layout" :style="bg">
    <div class="login-content">
      <!-- 左侧：学校滚动展示 -->
      <div class="school-list-box">
        <p class="list-title">学校列表</p>
        <div class="scroll-box">
          <ul class="scroll-content">
            <li v-for="school in schoolList" :key="school">{{ school }}</li>
          </ul>
        </div>
      </div>

      <!-- 右侧：原登录内容 -->
      <div class="login-vue">
        <div class="container">
          <p class="title">WELCOME</p>

          <!-- 注册部分 -->
          <div v-if="isRegistering">
            <div class="input-c">
              <Input prefix="ios-contact" v-model="form.userName" placeholder="用户名" clearable />
              <p class="error">{{ registerAccountError }}</p>
            </div>
            <div class="input-c">
              <Input prefix="ios-mail" v-model="form.email" placeholder="邮箱" clearable />
              <p class="error">{{ registerEmailError }}</p>
            </div>
            <div class="input-c">
              <Input type="password" v-model="form.pwd" prefix="md-lock" placeholder="密码" clearable />
              <p class="error">{{ registerPwdError }}</p>
            </div>
            <div class="input-c">
              <Input type="password" v-model="form.confirmPwd" prefix="md-lock" placeholder="确认密码" clearable />
              <p class="error">{{ confirmPwdError }}</p>
            </div>
            <Button class="submit" type="primary" @click="handleSubmit">注册</Button>
            <p class="account"><span @click="toggleRegisterMode">返回登录</span></p>
          </div>

          <!-- 登录部分 -->
          <div v-else>
            <div class="input-c">
              <Input prefix="ios-contact" v-model="account" placeholder="用户名" clearable />
              <p class="error">{{ accountError }}</p>
            </div>
            <div class="input-c">
              <Input type="password" v-model="pwd" prefix="md-lock" placeholder="密码" clearable />
              <p class="error">{{ pwdError }}</p>
            </div>
            <Button class="submit" type="primary" @click="submitLogin">登录</Button>
            <p class="account"><span @click="toggleRegisterMode">注册账号</span></p>
          </div>
        </div>
      </div>
    </div>
    <!-- 弹窗视频播放器 -->
    <a-modal
      :visible="showVideo"
      title="欢迎使用"
      width="800"
      :footer="null"
      centered
      @cancel="showVideo = false"
    >
      <video width="100%" height="auto" controls autoplay>
        <source src="/video.mp4" type="video/mp4" />
        您的浏览器不支持 video 标签。
      </video>
    </a-modal>
  </div>
</template>

<script>
import axios from 'axios'
import { getToken, registerUser } from '@/api/login';
import store from '@/store'
import { Modal } from 'ant-design-vue';

export default {
  name: 'login',
  components: {
    'a-modal': Modal
  },
  data() {
    return {
      account: '',
      pwd: '',
      accountError: '',
      pwdError: '',
      bg: {},
      isRegistering: false,
      showVideo: false,
      form: {
        userName: '',
        email: '',
        pwd: '',
        confirmPwd: '',
      },
      registerAccountError: '',
      registerEmailError: '',
      registerPwdError: '',
      confirmPwdError: '',
      schoolList: [] // ✅ 学校名列表
    };
  },
  created() {
    // 设置背景图
    this.bg.backgroundImage = 'url(' + require('../assets/imgs/bg0' + new Date().getDay() + '.jpg') + ')';

    // 请求学校名称列表
    axios.get('/api/sch/schInfo')
      .then(res => {
        console.log('学校接口返回：', res.data);
        const { code, data, msg } = res.data;
        if (code === '00000' && Array.isArray(data)) {
          const list = data.map(item => item.schName);
          // 为了实现无缝滚动，将学校名复制一遍
          this.schoolList = [...list, ...list];
        } else {
          console.warn('学校数据格式不正确或为空：', msg);
        }
      })
      .catch(err => {
        console.error('获取学校信息失败：', err);
      });

    this.showVideo = true;
  },
  methods: {
    toggleRegisterMode() {
      this.isRegistering = !this.isRegistering;
    },
    handleSubmit() {
      registerUser(this.form).then(response => {
        console.log('注册成功', response);
        this.toggleRegisterMode();
      }).catch(error => {
        console.error('注册失败', error);
      });
    },
    submitLogin() {
      if (this.account && this.pwd) {
        getToken({ username: this.account, password: this.pwd }).then(data => {
          localStorage.setItem('token', data.data.token);
          localStorage.setItem('name', data.data.userName);
          localStorage.setItem('flg', data.data.flg);
          localStorage.setItem('userType', data.data.flg);

          store.commit('setUserType', parseInt(data.data.flg));
          store.commit('setUserName', data.data.userName);

          if (parseInt(data.data.flg) === 1) {
            this.$router.push({
              path: '/',
              query: { lockSchool: true, userName: data.data.userName }
            });
          } else {
            this.$router.push('/');
          }
        }).catch(() => {
          this.accountError = '登录失败，请检查用户名或密码';
        });
      } else {
        this.accountError = '账号不能为空';
        this.pwdError = '密码不能为空';
      }
    }
  }
};
</script>

<style>/* 外层布局容器，左右横排 */
.login-layout {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-size: cover;
  background-repeat: no-repeat;
}

.login-content {
  display: flex;
  flex-direction: row;
  align-items: stretch;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
}


/* 左侧：学校列表区域 */
.school-list-box {
  width: 320px;
  padding: 30px;
  background-color: rgba(0, 90, 200, 0.7);
  color: #fff;
  display: flex;
  flex-direction: column;
  justify-content: center;
  border-top-left-radius: 12px;
  border-bottom-left-radius: 12px;
}

.list-title {
  font-weight: bold;
  font-size: 20px;
  margin-bottom: 10px;
}

.scroll-box {
  height: 250px;
  overflow: hidden;
  position: relative;
}

.scroll-content {
  list-style: none;
  animation: scrollUp 10s linear infinite;
  margin: 0;
  padding: 0;
}

.scroll-content li {
  margin: 10px 0;
}

@keyframes scrollUp {
  0% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(-100%);
  }
}

/* 原有登录样式 */
.login-vue {
  width: 320px;
  padding: 30px;
  background-color: rgba(255, 255, 255, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  border-top-right-radius: 12px;
  border-bottom-right-radius: 12px;
}

.login-vue .container {
  background: rgba(255, 255, 255, 0.5);
  width: 300px;
  text-align: center;
  border-radius: 10px;
  padding: 30px;
}

.login-vue .ivu-input {
  background-color: transparent;
  color: #fff;
  outline: #fff;
  border-color: #fff;
}

.login-vue ::-webkit-input-placeholder {
  color: rgba(255, 255, 255, 0.8);
}

.login-vue :-moz-placeholder {
  color: rgba(255, 255, 255, 0.8);
}

.login-vue ::-moz-placeholder {
  color: rgba(255, 255, 255, 0.8);
}

.login-vue :-ms-input-placeholder {
  color: rgba(255, 255, 255, 0.8);
}

.login-vue .title {
  font-size: 16px;
  margin-bottom: 20px;
}

.login-vue .input-c {
  margin: auto;
  width: 200px;
}

.login-vue .error {
  color: red;
  text-align: left;
  margin: 5px auto;
  font-size: 12px;
  padding-left: 30px;
  height: 20px;
}

.login-vue .submit {
  width: 200px;
}

.login-vue .account {
  margin-top: 30px;
}

.login-vue .account span {
  cursor: pointer;
}

.login-vue .ivu-icon {
  color: #eee;
}

.login-vue .ivu-icon-ios-close-circle {
  color: #777;
}
</style>