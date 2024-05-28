<template>
    <div class="container">
        <iframe v-if="currentChart === 'mainRadar'" src="/radarMain.html" class="chart" frameborder="0"></iframe>
        <iframe v-if="currentChart === 'javaBasicsRadar'" src="/radarJavaBasics.html" class="chart" frameborder="0"></iframe>
        <iframe v-if="currentChart === 'bsWebsiteRadar'" src="/radarBSWebsite.html" class="chart" frameborder="0"></iframe>
        <button v-if="currentChart !== 'mainRadar'" @click="goBackToMain" class="back-button">返回</button>
    </div>
</template>

<script>
export default {
    name: 'RadarCharts',
    data() {
        return {
            currentChart: 'mainRadar',
        };
    },
    mounted() {
        window.addEventListener('message', this.handleMessage);
    },
    beforeDestroy() {
        window.removeEventListener('message', this.handleMessage);
    },
    methods: {
        handleMessage(event) {
            if (['mainRadar', 'javaBasicsRadar', 'bsWebsiteRadar'].includes(event.data)) {
                this.currentChart = event.data;
            }
        },
        goBackToMain() {
            this.currentChart = 'mainRadar';
        },
    },
};
</script>

<style>
.container {
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow-y: auto;
    max-height: 100vh;
    padding: 20px;
}

.chart {
    width: 100%;
    max-width: 800px;
    height: 600px;
    margin-top: 20px;
}

.back-button {
    margin-top: 20px;
    padding: 10px 20px;
    font-size: 16px;
    cursor: pointer;
}
</style>
