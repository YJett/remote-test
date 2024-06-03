<template>
    <div class="container">
        <Card class="form-card">
            <i-form inline class="form-container">
                <FormItem label="学校" v-if="selectedIdentity === 'sch'">
                    <Select v-model="selectedSchool" placeholder="请选择学校" style="width: 250px;">
                        <Option v-for="opt in schools" :key="opt.value" :value="opt">{{ opt.label }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="学生学号">
                    <i-input v-model="studentId" placeholder="请输入学生学号" style="width: 250px;"></i-input>
                </FormItem>
                <FormItem class="button-container">
                    <i-button type="primary" @click="handleSearch" shape="round" class="query-button">查询</i-button>
                    <i-button type="warning" @click="handleClear" shape="round" class="clear-button">清除</i-button>
                </FormItem>
            </i-form>
        </Card>

        <div class="charts-container">
            <Card class="chart-card">
                <div ref="AbilityRadar" class="chart"></div>
            </Card>
            <Card class="chart-card">
                <div ref="knowledgeRadar" class="chart"></div>
            </Card>
        </div>

        <Modal v-model="showSubRadar" width="50%" :styles="{ top: '10px' }" @on-ok="handleModalOk" @on-cancel="handleModalCancel">
            <p>{{ previousAbilityNm }} (层级: {{ currentLv - 1 }}) - 当前层级: {{ currentLv }}</p>
            <div v-if="subRadarData.length > 0" ref="subRadar" class="chart"></div>
            <p v-else>当前无下钻数据</p>
        </Modal>
    </div>
</template>

<script>
import * as echarts from 'echarts';
import {fetchAllSchools} from '@/api/schmanage';
import {getAbilityScores, getAverageScoreByType, getScoreAndKnowledgeName} from '@/api/radar';
import {Message, Modal} from 'view-design';

export default {
    name: 'RadarCharts',
    data() {
        return {
            selectedIdentity: 'sch',
            selectedSchool: null,
            studentId: '',
            AbilityRadarData: [],
            knowledgeRadarData: [],
            subRadarData: [],
            showSubRadar: false,
            AbilityChartInstance: null,
            knowledgeChartInstance: null,
            subChartInstance: null,
            schools: [],
            currentLv: 1,
            currentUpabilityId: null,
            abilityMap: {}, // 用于存储 abilityNm 到 abilityNo 的映射
            previousAbilityNm: '', // 用于存储上一级的 abilityNm
        };
    },
    created() {
        this.fetchSchools();
    },
    methods: {
        fetchSchools() {
            fetchAllSchools()
                .then(response => {
                    if (Array.isArray(response.data)) {
                        this.schools = response.data.map(school => ({
                            value: school.schId,
                            label: school.schName
                        }));
                    } else {
                        Message.error('获取学校列表失败：无效的数据格式');
                    }
                })
                .catch(error => {
                    Message.error('获取学校列表失败');
                });
        },
        handleSearch() {
            if (this.selectedSchool && this.studentId) {
                this.fetchData();
                this.fetchKnowledgeData();
            } else {
                Message.warning('请填写学校ID和学生学号');
            }
        },
        handleClear() {
            this.selectedSchool = null;
            this.studentId = '';
            this.showSubRadar = false;
            this.currentLv = 1;
            if (this.AbilityChartInstance) {
                this.AbilityChartInstance.clear();
            }
            if (this.knowledgeChartInstance) {
                this.knowledgeChartInstance.clear();
            }
            if (this.subChartInstance) {
                this.subChartInstance.clear();
            }
        },
        fetchData() {
            const params = {
                jobId: 82,
                schId: this.selectedSchool.value,
                studentId: this.studentId,
                lv: 1,
            };
            getAbilityScores(params.jobId, params.schId, params.studentId, params.lv)
                .then(res => {
                    const data = res.data;
                    this.processData(data);
                    this.drawAbilityRadar();
                })
                .catch(error => {
                    console.error(error);
                    Message.error('获取数据失败');
                });
        },
        fetchKnowledgeData() {
            getAverageScoreByType(this.selectedSchool.value, this.studentId)
                .then(res => {
                    const data = res.data;
                    this.processKnowledgeData(data);
                    this.drawKnowledgeRadar();
                })
                .catch(error => {
                    console.error(error);
                    Message.error('获取知识评分数据失败');
                });
        },
        processData(data) {
            this.AbilityRadarData = data;
            this.abilityMap = {}; // 重置映射
            data.forEach(item => {
                this.abilityMap[item.abilityNm] = item.abilityNo; // 记录 abilityNm 到 abilityNo 的映射
            });
        },
        processKnowledgeData(data) {
            this.knowledgeRadarData = data;
        },
        drawAbilityRadar() {
            this.$nextTick(() => {
                if (this.AbilityChartInstance) {
                    this.AbilityChartInstance.dispose();
                }
                this.AbilityChartInstance = echarts.init(this.$refs.AbilityRadar);
                const option = {
                    title: {
                        text: '能力评分雷达图',
                    },
                    tooltip: {
                        trigger: 'item',
                    },
                    radar: {
                        indicator: this.AbilityRadarData.map(item => ({name: item.abilityNm, max: 100})),
                        triggerEvent: true
                    },
                    series: [
                        {
                            name: '能力评分',
                            type: 'radar',
                            data: [
                                {
                                    value: this.AbilityRadarData.map(item => item.score),
                                    name: '评分',
                                },
                            ],
                        },
                    ],
                };
                this.AbilityChartInstance.setOption(option);

                // 添加点击事件
                this.AbilityChartInstance.on('click', (params) => {
                    if (params.componentType === 'radar' && params.name) {
                        const abilityNo = this.abilityMap[params.name];
                        this.currentUpabilityId = abilityNo;
                        this.currentLv = 2;
                        this.previousAbilityNm = params.name;
                        this.showSubRadar = true;
                        this.$nextTick(() => {
                            this.drawSubRadar(abilityNo, this.currentLv);
                        });
                    }
                });
            });
        },
        drawKnowledgeRadar() {
            this.$nextTick(() => {
                if (this.knowledgeChartInstance) {
                    this.knowledgeChartInstance.dispose();
                }
                this.knowledgeChartInstance = echarts.init(this.$refs.knowledgeRadar);
                const option = {
                    title: {
                        text: '知识评分雷达图',
                    },
                    tooltip: {
                        trigger: 'item',
                    },
                    radar: {
                        indicator: this.knowledgeRadarData.map(item => ({name: item.type, max: 100})),
                        triggerEvent: true
                    },
                    series: [
                        {
                            name: '知识评分',
                            type: 'radar',
                            data: [
                                {
                                    value: this.knowledgeRadarData.map(item => item.avg_score),
                                    name: '评分',
                                },
                            ],
                        },
                    ],
                };
                this.knowledgeChartInstance.setOption(option);

                // 添加点击事件
                this.knowledgeChartInstance.on('click', (params) => {
                    if (params.componentType === 'radar' && params.name) {
                        const type = params.name;
                        this.currentLv = 2;
                        this.previousAbilityNm = type;
                        this.showSubRadar = true;
                        this.$nextTick(() => {
                            this.drawSubKnowledgeRadar(type, this.currentLv);
                        });
                    }
                });
            });
        },
        drawSubRadar(abilityNo, lv) {
            if (this.subChartInstance) {
                this.subChartInstance.dispose();
            }
            if (lv > 3) {
                this.subRadarData = [];
                return;
            }
            const params = {
                jobId: 82,
                schId: this.selectedSchool.value,
                studentId: this.studentId,
                lv: lv,
                upabilityId: abilityNo
            };
            getAbilityScores(params.jobId, params.schId, params.studentId, params.lv, params.upabilityId)
                .then(res => {
                    const data = res.data;
                    if (!data || data.length === 0) {
                        this.subRadarData = [];
                    } else {
                        this.subRadarData = data;
                        this.subChartInstance = echarts.init(this.$refs.subRadar);
                        const option = {
                            tooltip: {
                                trigger: 'item',
                            },
                            radar: {
                                indicator: data.map(item => ({name: item.abilityNm, max: 100})),
                                triggerEvent: true
                            },
                            series: [
                                {
                                    name: '知识评分',
                                    type: 'radar',
                                    data: [
                                        {
                                            value: data.map(item => item.score),
                                            name: '评分',
                                        },
                                    ],
                                },
                            ],
                        };
                        this.subChartInstance.setOption(option);

                        // 添加点击事件
                        this.subChartInstance.on('click', (params) => {
                            if (params.componentType === 'radar' && params.name) {
                                const abilityNo = data.find(item => item.abilityNm === params.name).abilityNo;
                                this.currentUpabilityId = abilityNo;
                                this.currentLv += 1;
                                this.previousAbilityNm = params.name;
                                this.$nextTick(() => {
                                    this.drawSubRadar(abilityNo, this.currentLv);
                                });
                            }
                        });
                    }
                })
                .catch(error => {
                    console.error(error);
                    Message.error('获取数据失败');
                });
        },
        drawSubKnowledgeRadar(type, lv) {
            if (this.subChartInstance) {
                this.subChartInstance.dispose();
            }
            if (lv > 3) {
                this.subRadarData = [];
                return;
            }
            getScoreAndKnowledgeName(this.selectedSchool.value, this.studentId, type)
                .then(res => {
                    const data = res.data;
                    if (!data || data.length === 0) {
                        this.subRadarData = [];
                    } else {
                        this.subRadarData = data;
                        this.subChartInstance = echarts.init(this.$refs.subRadar);
                        const option = {
                            tooltip: {
                                trigger: 'item',
                            },
                            radar: {
                                indicator: data.map(item => ({name: item.knowledgenm, max: 100})),
                                triggerEvent: true
                            },
                            series: [
                                {
                                    name: '知识评分',
                                    type: 'radar',
                                    data: [
                                        {
                                            value: data.map(item => item.score),
                                            name: '评分',
                                        },
                                    ],
                                },
                            ],
                        };
                        this.subChartInstance.setOption(option);
                    }
                })
                .catch(error => {
                    console.error(error);
                    Message.error('获取课程评分数据失败');
                });
        },
        handleModalOk() {
            this.showSubRadar = false;
        },
        handleModalCancel() {
            this.showSubRadar = false;
        }
    },
    beforeDestroy() {
        if (this.AbilityChartInstance) {
            this.AbilityChartInstance.dispose();
        }
        if (this.knowledgeChartInstance) {
            this.knowledgeChartInstance.dispose();
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
    width: 100%;
}

.form-card {
    width: 100%;
    margin-bottom: 20px;
}

.form-container {
    display: flex;
    align-items: center;
    justify-content: space-around;
    width: 100%;
}

.button-container {
    display: flex;
    gap: 20px;
}

.query-button, .clear-button {
    width: 120px;
    height: 50px;
    font-size: 18px;
    border-radius: 25px;
}

.charts-container {
    display: flex;
    justify-content: space-between;
    width: 100%;
    margin-top: 20px;
}

.chart-card {
    flex: 1;
    margin: 0 10px;
    border: 1px solid #d9d9d9;
    padding: 20px;
}

.chart {
    width: 100%;
    height: calc(100vh - 220px); /* Ensure it takes up the remaining height */
}

.modal .chart {
    height: 400px; /* Reduced height */
}
</style>
