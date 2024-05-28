<template>
    <div>
        <button @click="goBack">返回</button>
        <div ref="bsWebsiteRadar" class="chart"></div>
    </div>
</template>

<script>
import * as echarts from 'echarts';

export default {
    name: 'BSWebsiteRadar',
    mounted() {
        this.drawBSWebsiteRadar();
    },
    methods: {
        drawBSWebsiteRadar() {
            const chart = echarts.init(this.$refs.bsWebsiteRadar);
            const option = {
                title: {
                    text: 'B/S网站开发技术',
                },
                radar: {
                    indicator: [
                        { name: '会使用JSP开发', max: 50 },
                        { name: '会使用Web容器', max: 50 },
                        { name: '会使用JSP+Servlet+JavaBean', max: 50 },
                        { name: '会使用Session、Cookie', max: 50 },
                        { name: '会使用Commons-FileUpload', max: 50 },
                        { name: '会结合jQuery', max: 50 },
                        { name: '会使用JNDI、DataSource', max: 50 },
                    ],
                },
                series: [
                    {
                        name: 'B/S网站开发技术',
                        type: 'radar',
                        data: [
                            {
                                value: [50, 40, 30, 20, 40, 30, 50],
                                name: 'B/S网站开发技术',
                            },
                        ],
                    },
                ],
            };
            chart.setOption(option);
        },
        goBack() {
            window.parent.postMessage('mainRadar', '*');
        },
    },
};
</script>

<style scoped>
.chart {
    width: 100%;
    height: 600px;
}
</style>
