<template>
    <div>
        <button @click="goBack">返回</button>
        <div ref="javaBasicsRadar" class="chart"></div>
    </div>
</template>

<script>
import * as echarts from 'echarts';

export default {
    name: 'JavaBasicsRadar',
    mounted() {
        this.drawJavaBasicsRadar();
    },
    methods: {
        drawJavaBasicsRadar() {
            const chart = echarts.init(this.$refs.javaBasicsRadar);
            const option = {
                title: {
                    text: 'Java基础技术',
                },
                radar: {
                    indicator: [
                        { name: '编写简单控制台程序', max: 50 },
                        { name: '用简单算法实现业务需求', max: 50 },
                        { name: '会使用MyEclipse', max: 50 },
                        { name: '文件读取', max: 50 },
                        { name: '面向对象编程', max: 50 },
                        { name: '实现常用I/O操作', max: 50 },
                        { name: '会使用JDBC', max: 50 },
                        { name: '熟练运用Java常用API', max: 50 },
                        { name: '会使用异常处理', max: 50 },
                    ],
                },
                series: [
                    {
                        name: 'Java基础技术',
                        type: 'radar',
                        data: [
                            {
                                value: [50, 40, 30, 20, 30, 40, 50, 40, 30],
                                name: 'Java基础技术',
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
