<template>
    <div class="home-container">
        <div class="home-content">
        </div>
    </div>
</template>

<script>
import { getInfo } from '@/api/login'

export default {
    name: 'home',
    data() {
        return {
            userInfo: '',
            postData: '',
            dataUrl: '',
        }
    },
    methods: {

    },
}
</script>

<style scoped>
.home-container {
    padding: 10px;
    padding-top: 5px;
}
.home-content {
    padding: 10px;
    border-radius: 5px;
    background: #fff;
}
</style>
