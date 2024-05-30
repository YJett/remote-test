<template>
    <div class="container">
        <i-form inline>
            <form-item label="学校ID">
                <i-input v-model="schoolId" placeholder="请输入学校ID"></i-input>
            </form-item>
            <form-item label="学生ID">
                <i-input v-model="studentId" placeholder="请输入学生ID"></i-input>
            </form-item>
            <form-item>
                <i-button type="primary" @click="handleSearch">查询</i-button>
            </form-item>
        </i-form>

        <div class="charts-container" v-if="showSubRadar">
            <div ref="mainRadar" class="chart"></div>
            <div ref="subRadar" class="chart"></div>
        </div>
        <div ref="mainRadar" class="chart" v-else></div>
    </div>
</template>

<script>
import * as echarts from 'echarts';
import { getAbilityScores } from '@/api/radar';

export default {
    name: 'RadarCharts',
    data() {
        return {
            schoolId: '',
            studentId: '',
            mainRadarData: [],
            showSubRadar: false,
            mainChartInstance: null,
            subChartInstance: null
        };
    },
    methods: {
        handleSearch() {
            if (this.schoolId && this.studentId) {
                this.fetchData();
            } else {
                this.$Message.warning('请填写学校ID和学生ID');
            }
        },
        fetchData() {
            const params = {
                jobId: 82,
                schId: this.schoolId,
                studentId: this.studentId,
                lv: 1,
            };
            getAbilityScores(params.jobId, params.schId, params.studentId, params.lv)
                .then(res => {
                    const data = res.data;
                    this.processData(data);
                    this.drawChart();
                })
                .catch(error => {
                    console.error(error);
                    this.$Message.error('获取数据失败');
                });
        },
        processData(data) {
            this.mainRadarData = data;
        },
        drawChart() {
            this.$nextTick(() => {
                if (this.mainChartInstance) {
                    this.mainChartInstance.dispose();
                }
                this.drawMainRadar();
            });
        },
        drawMainRadar() {
            this.mainChartInstance = echarts.init(this.$refs.mainRadar);
            const option = {
                title: {
                    text: '能力评分雷达图',
                },
                tooltip: {
                    trigger: 'item',
                },
                radar: {
                    indicator: this.mainRadarData.map(item => ({name: item.abilityNm, max: 100})),
                    triggerEvent: true
                },
                series: [
                    {
                        name: '能力评分',
                        type: 'radar',
                        data: [
                            {
                                value: this.mainRadarData.map(item => item.score),
                                name: '评分',
                                abilityNo: this.mainRadarData.map(item => item.abilityNo),
                            },
                        ],
                    },
                ],
            };
            this.mainChartInstance.setOption(option);

            // 添加点击事件
            this.mainChartInstance.on('click', (params) => {
                console.log(params); // 输出点击事件的信息以供调试
                this.showSubRadar = true;
                this.$nextTick(() => {
                    this.drawSubRadar();
                });
            });
        },
        drawSubRadar() {
            if (this.subChartInstance) {
                this.subChartInstance.dispose();
            }
            this.subChartInstance = echarts.init(this.$refs.subRadar);
            const subRadarData = [
                {type: "专业基础课", score: 79},
                {type: "专业核心课", score: 78},
                {type: "专业拓展课", score: 81},
                {type: "公共基础课", score: 72}
            ];
            const option = {
                title: {
                    text: '知识评分雷达图',
                },
                tooltip: {
                    trigger: 'item',
                },
                radar: {
                    indicator: subRadarData.map(item => ({name: item.type, max: 100})),
                },
                series: [
                    {
                        name: '能力评分',
                        type: 'radar',
                        data: [
                            {
                                value: subRadarData.map(item => item.score),
                                name: '评分',
                            },
                        ],
                    },
                ],
            };
            this.subChartInstance.setOption(option);
        },
        goBackToMain() {
            this.showSubRadar = false;
        },
    },
    beforeDestroy() {
        if (this.mainChartInstance) {
            this.mainChartInstance.dispose();
        }
        if (this.subChartInstance) {
            this.subChartInstance.dispose();
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

.charts-container {
    display: flex;
    justify-content: space-between;
    width: 100%;
}

.chart {
    width: 48%;
    height: 600px;
    margin-top: 20px;
}
</style>
