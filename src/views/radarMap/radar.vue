<template>
    <div class="container">
        <Card class="form-card" style="margin-bottom: 0">
            <i-form inline class="form-container">
                <FormItem label="学校">
                    <Select v-model="selectedSchool" placeholder="请选择学校" style="width: 250px;">
                        <Option v-for="opt in schools" :key="opt.value" :value="opt">{{ opt.label }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="岗位">
                    <Select v-model="selectedJob" placeholder="请选择岗位" style="width: 200px; font-size: 18px;">
                        <Option v-for="opt in jobs" :key="opt.value" :value="opt">{{ opt.label }}</Option>
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

        <div class="charts-container" style="margin-top: 0">
            <div class="row" style="width: 50%">
                <Card class="chart-card">
                    <div ref="AbilityRadar" class="chart"></div>
                </Card>
                <Card class="chart-card" style="height: 50%">
                    <div class="personal-info-container">

                        <ul>
                            <li v-for="info in personalInfoData" :key="info.label">
                                <strong>{{ info.label }}:</strong> {{ info.value }}
                            </li>
                        </ul>
                    </div>
                </Card>
            </div>
            <div class="row" style="width: 50%">
                <Card class="chart-card">
                    <div ref="knowledgeRadar" class="chart"></div>
                </Card>
                <Card class="chart-card">
                    <div ref="literacyRadar" class="chart" style="margin-bottom: 30px"></div>
                </Card>
            </div>
        </div>


        <Modal v-model="showSubRadar" width="50%" :styles="{ top: `${modalTop}px` }" @on-cancel="handleModalCancel">
            <p>{{ previousAbilityNm }} (层级: {{ currentLv - 1 }}) - 当前层级: {{ currentLv }}</p>
            <div v-if="subRadarData.length > 0" ref="subRadar" class="chart"></div>
            <p v-else>当前无下钻数据</p>
        </Modal>


    </div>
</template>
<script>
import * as echarts from 'echarts';
import { fetchAllSchools } from '@/api/schmanage';
import { getAbilityScores, getAverageScoreByType, getScoreAndKnowledgeName, getStudentLiteracy } from '@/api/radar';
import { Message, Modal } from 'view-design';
import { fetchAllJobs } from "@/api/Jobmanage";

export default {
    name: 'RadarCharts',
    data() {
        return {
            modalTop: 0,
            selectedJob: null, // 存储当前选中的 jobId
            jobs: [],
            selectedSchool: null,
            studentId: '',
            AbilityRadarData: [],
            knowledgeRadarData: [],
            studentLiteracyData: null,
            subRadarData: [],
            showSubRadar: false,
            AbilityChartInstance: null,
            knowledgeChartInstance: null,
            personalInfoChartInstance: null,
            literacyChartInstance: null,
            subChartInstance: null,
            schools: [],
            currentLv: 1,
            currentUpabilityId: null,
            abilityMap: {}, // 用于存储 abilityNm 到 abilityNo 的映射
            previousAbilityNm: '',
            personalInfoData: null,// 用于存储上一级的 abilityNm
        };
    },
    mounted() {
        this.calculateModalTop(); // 在 mounted 钩子中计算 modalTop
        window.addEventListener('resize', this.calculateModalTop); // 监听窗口大小变化
    },
    destroyed() {
        window.removeEventListener('resize', this.calculateModalTop);
    },
    created() {
        this.fetchSchools();
        this.fetchJobs();
    },
    methods: {
        calculateModalTop() {
            this.modalTop = (window.innerHeight - 400) / 2; // 计算 modalTop
        },
        fetchJobs() {
            fetchAllJobs()
                .then(response => {
                    if (Array.isArray(response.data)) {
                        this.jobs = response.data.map(job => ({
                            value: job.jobid,
                            label: job.jobname
                        }));
                    } else {
                        Message.error('获取岗位列表失败：无效的数据格式');
                    }
                })
                .catch(error => {
                    Message.error('获取岗位列表失败');
                });
        },
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
            if (this.selectedSchool && this.studentId && this.selectedJob) {
                this.fetchAbilityData();
                this.fetchKnowledgeData();
                this.fetchStudentLiteracyData();
            } else {
                Message.warning('请填写学校ID、岗位和学生学号');
            }
        },
        handleClear() {
            this.selectedSchool = null;
            this.selectedJob = null;
            this.studentId = '';
            this.showSubRadar = false;
            this.currentLv = 1;
            this.AbilityRadarData = [];
            this.knowledgeRadarData = [];
            this.studentLiteracyData = null;
            this.abilityMap = {};
            this.previousAbilityNm = '';
            this.personalInfoData = null; // Clear
            this.personalInfoData = null;
            this.selectedSchool = null;
            this.selectedJob = null;
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
            if (this.personalInfoChartInstance) {
                this.personalInfoChartInstance.clear();
            }
            if (this.literacyChartInstance) {
                this.literacyChartInstance.clear();
            }
        },
        fetchAbilityData() {
            const params = {
                jobId: this.selectedJob.value,
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
                    Message.error('获取能力数据失败');
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
        fetchStudentLiteracyData() {
            getStudentLiteracy(this.selectedSchool.value, this.studentId)
                .then(res => {
                    const data = res.data;
                    if (!data || Object.keys(data).length === 0) {
                        Message.warning('结果数据为空');
                        return;
                    }
                    this.studentLiteracyData = data;
                    this.drawPersonalInfo();
                    this.drawLiteracyRadar();
                })
                .catch(error => {
                    console.error(error);
                    Message.error('获取学生素养数据失败');
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
                        indicator: this.AbilityRadarData.map(item => ({ name: item.abilityNm, max: 100 })),
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
                        indicator: this.knowledgeRadarData.map(item => ({ name: item.type, max: 100 })),
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
        drawPersonalInfo() {
            const data = this.studentLiteracyData.studentInfo;
            if (!data) {
                console.error('No student information data available.');
                return;
            }
            const formatDate = (dateStr) => {
                const date = new Date(dateStr);
                return date.toISOString().split('T')[0];
            };
            const infoList = [
                { label: '姓名', value: data.studentnm },
                { label: '学校', value: data.schnm },
                { label: '院系', value: data.department },
                { label: '专业', value: data.major },
                { label: '政治面貌', value: data.party },
                { label: '生源地', value: data.hometown },
                { label: '入学时间', value: formatDate(data.enrollmentDate) },
                { label: '健康状况', value: data.health },
                { label: '出生日期', value: formatDate(data.birthday) },
            ];
            // Set personalInfoData to infoList
            this.personalInfoData = infoList;
        },
        drawLiteracyRadar() {
            this.$nextTick(() => {
                if (this.literacyChartInstance) {
                    this.literacyChartInstance.dispose();
                }
                this.literacyChartInstance = echarts.init(this.$refs.literacyRadar);
                const literacyData = this.studentLiteracyData.stuCharacterScore;
                console.log(literacyData);
                const option = {
                    title: {
                        text: '个人素养雷达图',
                    },
                    tooltip: {
                        trigger: 'item',
                    },
                    radar: {
                        indicator: [
                            { name: '卓越能力', max: 100 },
                            { name: '敬业精神', max: 100 },
                            { name: '勤工助学', max: 100 },
                            { name: '社团参与', max: 100 },
                            { name: '个人卫生', max: 100 }
                        ],
                    },
                    series: [
                        {
                            name: '素养评分',
                            type: 'radar',
                            data: [
                                {
                                    value: [
                                        literacyData.outstanding,
                                        literacyData.dedication,
                                        literacyData.workstudy,
                                        literacyData.participation,
                                        literacyData.healty
                                    ],
                                    name: '评分',
                                },
                            ],
                        },
                    ],
                };
                this.literacyChartInstance.setOption(option);
            });
        },
        drawSubRadar(abilityNo, lv) {
            this.showSubRadar = true;
            this.$nextTick(() => {
                if (this.subChartInstance) {
                    this.subChartInstance.dispose();
                }
                if (lv > 3) {
                    this.subRadarData = [];
                    return;
                }
                const params = {
                    jobId: this.selectedJob.value,
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
                            this.$nextTick(() => {
                                if (this.$refs.subRadar) {
                                    this.subChartInstance = echarts.init(this.$refs.subRadar);
                                    const option = {
                                        tooltip: {
                                            trigger: 'item',
                                        },
                                        radar: {
                                            indicator: data.map(item => ({ name: item.abilityNm, max: 100 })),
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
                                        this.showSubRadar = true;
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
                            });
                        }
                    })
                    .catch(error => {
                        console.error(error);
                        Message.error('获取数据失败');
                    });
            });
        },
        drawSubKnowledgeRadar(type, lv) {
            this.$nextTick(() => {
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
                                    indicator: data.map(item => ({ name: item.knowledgenm, max: 100 })),
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
            });
        },

        handleModalCancel() {
            this.showSubRadar = false;
            if (this.subChartInstance) {
                this.subChartInstance.dispose();
            }
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
    background-color: #e6f7ff;
    /* Light blue background color */
}

.form-card {
    width: 100%;
    margin-bottom: 20px;
    background-color: rgba(255, 255, 255, 0.7);
    /* Set background color with 90% opacity */
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

.query-button,
.clear-button {
    width: 120px;
    height: 50px;
    font-size: 18px;
    border-radius: 25px;
}

.charts-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    width: 100%;
    margin-top: 20px;
}

.chart-card {
    flex: 1;
    margin: 10px;
    border: 1px solid #d9d9d9;
    padding: 20px;
    background-color: rgba(255, 255, 255, 0.7);
    /* Set background color with 90% opacity */
    min-width: 300px;
    /* Ensure a minimum width for each chart card */
}

.chart {
    width: 100%;
    height: 300px;
    /* Adjust height to fit all charts */
}

.modal .chart {
    height: 400px;
    /* Reduced height */
}
</style>
