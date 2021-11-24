<template>
    <div>
        查看消息
        <input type="text" v-model="username">
        <input type="text" v-model="password">
        <button @click="handleLogin">登录</button>
    </div>
</template>

<script>
import { testPost } from '@/api'

export default {
    name: 'msg',
    data() {
        return {
            username: '',
            password: '',
        }
    },
    methods: {
        handleLogin() {
            testPost({ username: this.username, password: this.password }).then(res => console.log(res))
        },
    },
}
</script>

<style scoped>

</style>
