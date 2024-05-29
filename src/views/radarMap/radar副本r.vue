<template>
    <!--保存旧代码-->
    <!--保存旧代码-->
    <!--保存旧代码-->
    <!--保存旧代码-->
    <!--保存旧代码-->
    <!--保存旧代码-->
    <!--保存旧代码-->
    <!--保存旧代码-->
    <!--保存旧代码-->
    <!--保存旧代码-->
    <!--保存旧代码-->
    <!--保存旧代码-->
    <!--保存旧代码-->
    <div class="container">
        <div v-if="currentChart === 'mainRadar'" ref="mainRadar" class="chart"></div>
        <div v-if="currentChart === 'javaBasicsRadar'" ref="javaBasicsRadar" class="chart">
            <!-- 添加返回按钮 -->
            <button @click="goBackToMain">返回</button>
        </div>
        <div v-if="currentChart === 'bsWebsiteRadar'" ref="bsWebsiteRadar" class="chart">
            <!-- 添加返回按钮 -->
            <button @click="goBackToMain">返回</button>
        </div>
    </div>
</template>

<script>
import * as echarts from 'echarts';
import {getAbilityScores} from '@/api/radar';

export default {
    name: 'RadarCharts',
    data() {
        return {
            currentChart: 'mainRadar',
        };
    },
    mounted() {
        this.fetchData();
        this.drawChart();
    },
    watch: {
        currentChart() {
            this.drawChart();
        },
    },
    methods: {
        fetchData(){
            getAbilityScores().then(res => {
                console.log(res);
            });
        },
        drawChart() {
            if (this.chartInstance) {
                this.chartInstance.dispose(); // 确保每次切换图表时销毁之前的实例
            }
            if (this.currentChart === 'mainRadar') {
                this.drawMainRadar();
            } else if (this.currentChart === 'javaBasicsRadar') {
                this.drawJavaBasicsRadar();
            } else if (this.currentChart === 'bsWebsiteRadar') {
                this.drawBSWebsiteRadar();
            }
        },
        drawMainRadar() {
            this.chartInstance = echarts.init(this.$refs.mainRadar);
            const option = {
                title: {
                    text: 'Java工程师岗位能力要求',
                },
                radar: {
                    indicator: [
                        { name: 'Java基础技术', max: 50 },
                        { name: 'B/S网站开发技术', max: 50 },
                        { name: '软件项目管理', max: 50 },
                        { name: '系统测试', max: 50 },
                        { name: '使用框架开发企业级应用', max: 50 },
                    ],
                },
                series: [
                    {
                        name: '能力要求',
                        type: 'radar',
                        data: [
                            {
                                value: [50, 40, 30, 20, 40],
                                name: '能力',
                            },
                        ],
                    },
                ],
            };
            this.chartInstance.setOption(option);

            this.chartInstance.on('click', (params) => {
                if (params.componentType === 'series') {
                    if (params.name === 'Java基础技术') {
                        this.currentChart = 'javaBasicsRadar';
                    } else if (params.name === 'B/S网站开发技术') {
                        this.currentChart = 'bsWebsiteRadar';
                    }
                }
            });
        },
        drawJavaBasicsRadar() {
            this.chartInstance = echarts.init(this.$refs.javaBasicsRadar);
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
            this.chartInstance.setOption(option);
        },
        drawBSWebsiteRadar() {
            this.chartInstance = echarts.init(this.$refs.bsWebsiteRadar);
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
            this.chartInstance.setOption(option);
        },
        goBackToMain() {
            this.currentChart = 'mainRadar';
        },
    },
    beforeDestroy() {
        if (this.chartInstance) {
            this.chartInstance.dispose();
        }
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
</style>
