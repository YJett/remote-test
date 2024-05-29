
<!--保存旧代码-->
<!--保存旧代码-->
<!--保存旧代码-->
<!--保存旧代码-->
<!--保存旧代码-->


<template>
    <div class="container">
        <div v-if="currentChart === 'mainRadar'" ref="mainRadar" class="chart"></div>
        <div v-if="currentChart !== 'mainRadar'" ref="subRadar" class="chart">
            <button @click="goBackToMain">返回</button>
        </div>
    </div>
</template>

<script>
import * as echarts from 'echarts';
import { getAbilityScores } from '@/api/radar';

export default {
    name: 'RadarCharts',
    data() {
        return {
            currentChart: 'mainRadar',
            mainRadarData: [],
            subRadarData: []
        };
    },
    mounted() {
        this.fetchData();
    },
    watch: {
        currentChart() {
            this.drawChart();
        },
    },
    methods: {
        fetchData() {
            getAbilityScores().then(res => {
                const data = res.data;
                this.processData(data);
                this.drawChart();
            });
        },
        processData(data) {
            // 处理数据并保存
            this.mainRadarData = data;
        },
        drawChart() {
            if (this.chartInstance) {
                this.chartInstance.dispose();
            }

            if (this.currentChart === 'mainRadar') {
                this.drawMainRadar();
            } else {
                this.drawSubRadar();
            }
        },
        drawMainRadar() {
            this.chartInstance = echarts.init(this.$refs.mainRadar);
            const option = {
                title: {
                    text: '能力评分雷达图',
                },
                tooltip: {
                    trigger: 'item',
                },
                radar: {
                    indicator: this.mainRadarData.map(item => ({ name: item.abilityNm, max: 100 })),
                },
                series: [
                    {
                        name: '能力评分',
                        type: 'radar',
                        data: [
                            {
                                value: this.mainRadarData.map(item => item.score),
                                name: '评分',
                            },
                        ],
                    },
                ],
            };
            this.chartInstance.setOption(option);

            // 添加点击事件
            this.chartInstance.on('click', (params) => {
                if (params.componentType === 'series') {
                    const clickedAbility = this.mainRadarData.find(item => item.abilityNm === params.name);
                    if (clickedAbility) {
                        this.currentChart = clickedAbility.abilityNm;
                        this.subRadarData = [clickedAbility]; // 假设子图只展示单个能力的数据
                    }
                }
            });
        },
        drawSubRadar() {
            this.chartInstance = echarts.init(this.$refs.subRadar);
            const option = {
                title: {
                    text: `${this.currentChart} 详情`,
                },
                radar: {
                    indicator: this.subRadarData.map(item => ({ name: item.abilityNm, max: 100 })),
                },
                series: [
                    {
                        name: '能力评分',
                        type: 'radar',
                        data: [
                            {
                                value: this.subRadarData.map(item => item.score),
                                name: '评分',
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
