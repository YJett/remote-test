<template>
    <div class="home-container">
        <div class="home-content">
            <Button @click="exportData">导出统计表</Button>
        </div>
    </div>
</template>

<script>
import exportData from '../api/index'

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
        exportData() {
            exportData()
        },
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
