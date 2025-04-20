<template>
  <div class="login-vue" :style="bg">
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
</template>

<script>
import { getToken, getInfo, registerUser } from '@/api/login';
import store from '@/store'

export default {
  name: 'login',
  data() {
    return {
      account: '',
      pwd: '',
      accountError: '',
      pwdError: '',
      bg: {},
      isRegistering: false,
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
    };
  },
  created() {
    this.bg.backgroundImage = 'url(' + require('../assets/imgs/bg0' + new Date().getDay() + '.jpg') + ')';
  },
  methods: {
    toggleRegisterMode() {
      this.isRegistering = !this.isRegistering;
    },
    handleSubmit() {
      // 这里添加注册逻辑
      registerUser(this.form).then(response => {
        console.log('注册成功', response);
        this.toggleRegisterMode(); // 注册成功后自动切换到登录模式
      }).catch(error => {
        console.error('注册失败', error);
      });
    },
    submitLogin() {
      // 这里添加登录逻辑
        if (this.account && this.pwd) {
            getToken({ username: this.account, password: this.pwd }).then(data => {
                localStorage.setItem('token', data.data.token);
                localStorage.setItem('name', data.data.userName);
                localStorage.setItem('flg', data.data.flg);
                localStorage.setItem('userType', data.data.flg); // 存储用户类型到 localStorage

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
            }).catch(error => {
                this.accountError = '登录失败，请检查用户名或密码';
            });
        } else {
            this.accountError = '账号不能为空';
            this.pwdError = '密码不能为空';
        }
    },
  },
};
</script>


<style>
.login-vue {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
}

.login-vue .container {
  background: rgba(255, 255, 255, .5);
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
  /* WebKit, Blink, Edge */
  color: rgba(255, 255, 255, .8);
}

.login-vue :-moz-placeholder {
  /* Mozilla Firefox 4 to 18 */
  color: rgba(255, 255, 255, .8);
}

.login-vue ::-moz-placeholder {
  /* Mozilla Firefox 19+ */
  color: rgba(255, 255, 255, .8);
}

.login-vue :-ms-input-placeholder {
  /* Internet Explorer 10-11 */
  color: rgba(255, 255, 255, .8);
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