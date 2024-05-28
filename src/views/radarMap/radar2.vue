<template>
    <div class="container">
        <div ref="mainRadar" class="chart"></div>
        <div ref="javaBasicsRadar" class="chart"></div>
        <div ref="bsWebsiteRadar" class="chart"></div>
    </div>
</template>

<script>
import * as echarts from 'echarts';

export default {
    name: 'RadarCharts',
    mounted() {
        this.drawMainRadar();
        this.drawJavaBasicsRadar();
        this.drawBSWebsiteRadar();
    },
    methods: {
        drawMainRadar() {
            const chart = echarts.init(this.$refs.mainRadar);
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
            chart.setOption(option);

            // 为第一个雷达图添加点击事件
            chart.on('click', (params) => {
                // 检查点击的指标名称是否为 'Java基础技术'
                if (params.name === 'Java基础技术') {
                    // 跳转到第二个雷达图
                    this.navigateToSecondChart();
                }
            });
        },
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

            // 为第二个雷达图添加点击事件
            chart.on('click', (params) => {
                // 检查点击的指标名称是否为 'B/S网站开发技术'
                if (params.name === 'B/S网站开发技术') {
                    // 跳转到第三个雷达图
                    this.navigateToThirdChart();
                }
            });
        },
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
        navigateToSecondChart() {
            // 改变URL的哈希部分，跳转到第二个雷达图
            window.location.hash = '#javaBasicsRadar';
        },
        navigateToThirdChart() {
            // 改变URL的哈希部分，跳转到第三个雷达图
            window.location.hash = '#bsWebsiteRadar';
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
    max-height: 100vh; /* 限制容器的最大高度 */
    padding: 20px;
}

.chart {
    width: 100%;
    max-width: 800px; /* 限制图表的最大宽度 */
    height: 600px;
    margin-top: 20px;
}
</style>
