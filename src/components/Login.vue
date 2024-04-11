<template>
    <div class="login-vue" :style="bg">
        <div class="container">
            <p class="title">WELCOME</p>
            <div v-if="isRegistering">
                <!-- 注册表单 -->
                <div class="input-c">
                    <Input prefix="ios-contact" v-model="registerAccount" placeholder="用户名" clearable
                        @on-blur="verifyRegisterAccount" />
                    <p class="error">{{ registerAccountError }}</p>
                </div>
                <div class="input-c">
                    <Input prefix="ios-mail" v-model="registerEmail" placeholder="邮箱" clearable
                        @on-blur="verifyRegisterEmail" />
                    <p class="error">{{ registerEmailError }}</p>
                </div>
                <div class="input-c">
                    <Input type="password" v-model="registerPwd" prefix="md-lock" placeholder="密码" clearable
                        @on-blur="verifyRegisterPwd" />
                    <p class="error">{{ registerPwdError }}</p>
                </div>
                <div class="input-c">
                    <Input type="password" v-model="confirmPwd" prefix="md-lock" placeholder="确认密码" clearable
                        @on-blur="verifyConfirmPwd" />
                    <p class="error">{{ confirmPwdError }}</p>
                </div>
                <Button :loading="isRegisteringLoading" class="submit" type="primary"
                    @click="submitRegister">注册</Button>
                <p class="account"><span @click="toggleRegisterMode">返回登录</span></p>
            </div>
            <div v-else>
                <!-- 登录表单 -->
                <Form ref="registerForm" :model="form" :rules="ruleValidate" label-position="top" class="register-form">
                    <FormItem label="用户名" prop="registerAccount">
                        <Input v-model="form.registerAccount" placeholder="请输入用户名"></Input>
                    </FormItem>
                    <FormItem label="邮箱" prop="registerEmail">
                        <Input v-model="form.registerEmail" placeholder="请输入邮箱"></Input>
                    </FormItem>
                    <FormItem label="密码" prop="registerPwd">
                        <Input type="password" v-model="form.registerPwd" placeholder="请输入密码"></Input>
                    </FormItem>
                    <FormItem label="确认密码" prop="confirmPwd">
                        <Input type="password" v-model="form.confirmPwd" placeholder="请再次输入密码"></Input>
                    </FormItem>
                    <FormItem>
                        <Button type="primary" @click="handleSubmit">注册</Button>
                    </FormItem>
                </Form>
            </div>
        </div>
    </div>
</template>


<script>
import { getToken, getInfo } from '@/api/login'

export default {
    name: 'login',
    data() {
        const validatePwd = (rule, value, callback) => {
            if (value.length < 6) {
                callback(new Error('密码长度不能小于6位'));
            } else {
                callback();
            }
        };
        return {
            account: '',
            pwd: '',
            accountError: '',
            pwdError: '',
            isShowLoading: false,
            bg: {},

            isRegistering: false,
            registerAccount: '',
            registerEmail: '',
            registerPwd: '',
            confirmPwd: '',
            registerAccountError: '',
            registerEmailError: '',
            registerPwdError: '',
            confirmPwdError: '',
            isRegisteringLoading: false,

        }
    },
    created() {
        this.bg.backgroundImage = 'url(' + require('../assets/imgs/bg0' + new Date().getDay() + '.jpg') + ')'
    },
    watch: {
        $route: {
            handler(route) {
                this.redirect = route.query && route.query.redirect
            },
            immediate: true,
        },
    },
    methods: {
        toggleRegisterMode() {
            // 切换注册模式
            this.isRegistering = !this.isRegistering;
        },
        verifyAccount() {
            if (this.account !== 'admin') {
                this.accountError = ''
            } else {
                this.accountError = ''
            }
        },
        verifyPwd() {
            if (this.pwd !== 'admin') {
                this.pwdError = ''
            } else {
                this.pwdError = ''
            }
        },
        register() {

        },
        forgetPwd() {

        },
        submit(key, value) {
            if (this.account !== '' && this.pwd !== '') {
                // this.isShowLoading = true
                // 登陆成功 设置用户信息
                localStorage.setItem('userImg', 'https://avatars3.githubusercontent.com/u/22117876?s=460&v=4')
                localStorage.setItem('userName', '小明')
                // 登陆成功 假设这里是后台返回的 token
                getToken({ username: this.account, password: this.pwd }).then((data) => {
                    localStorage.setItem('token', data.data.token)
                    this.$router.push({ path: this.redirect || '/' })
                    getInfo().then((data) => {
                        localStorage.setItem('userName', data.data.name)
                    })
                })
            } else {
                if (this.account === '') {
                    this.accountError = '账号不能为空'
                }

                if (this.pwd !== 'admin') {
                    this.pwdError = '密码不为空'
                }
            }
        },
    },
}
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
