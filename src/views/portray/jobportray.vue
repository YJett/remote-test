<template>
    <div class="container">
        <!-- 岗位能力查询 -->
        <div class="card">
            <h3>岗位能力查询</h3>
            <div class="query-section">
                <div class="row">
                    <span>选择岗位</span>
                    <Select v-model="selectedJobId" placeholder="请选择岗位" style="width: 200px; margin-left: 10px; margin-right: 30px;">
                        <Option v-for="job in jobs" :key="job.value" :value="job.value">{{ job.label }}</Option>
                    </Select>
                    <span>选择能力</span>
                    <Select v-model="selectedAbility" placeholder="请选择能力" style="width: 200px; margin-left: 10px; margin-right: 30px;">
                        <Option v-for="ability in abilities" :key="ability.value" :value="ability.value">{{ ability.label }}</Option>
                    </Select>
                    <span>选择级别</span>
                    <Select v-model="selectedLevel" placeholder="请选择级别" style="width: 200px; margin-left: 10px; margin-right: 30px;">
                        <Option v-for="level in levels" :key="level.value" :value="level.value">{{ level.label }}</Option>
                    </Select>
                </div>
                <div class="row" style="margin-top: 10px;">
                    <span>分数查询</span>
                    <Select v-model="selectedOperator" placeholder="符号" style="width: 80px; margin-left: 10px; margin-right: 10px;">
                        <Option v-for="operator in operators" :key="operator.value" :value="operator.value">{{ operator.label }}</Option>
                    </Select>
                    <Input v-model="abilityScore" placeholder="分数" style="width: 50px; margin-right: 30px;"/>
                </div>
            </div>
        </div>

        <!-- 知识能力查询 -->
        <div class="card" style="margin-top: 20px;">
            <h3>知识能力查询</h3>
            <div class="query-section">
                <div class="row">
                    <span>选择学校</span>
                    <Select v-model="selectedSchool" placeholder="请选择学校" style="width: 200px; margin-left: 10px; margin-right: 30px;">
                        <Option v-for="school in schools" :key="school.value" :value="school.value">{{ school.label }}</Option>
                    </Select>
                </div>
                <div class="row" style="margin-top: 10px;">
                    <div style="display: flex; align-items: center; margin-right: 100px;">
                        <span>专业核心课</span>
                        <Select v-model="selectedCoreCourseOperator" placeholder="符号"
                                style="width: 80px; margin-left: 5px; margin-right: 5px;">
                            <Option v-for="operator in operators" :key="operator.value" :value="operator.value">{{
                                    operator.label
                                }}
                            </Option>
                        </Select>
                        <Input v-model="coreCourseScore" placeholder="分数" style="width: 50px; margin-right: 20px;"/>
                    </div>
                    <div style="display: flex; align-items: center; margin-right: 100px;">
                        <span>专业拓展课</span>
                        <Select v-model="selectedExpCourseOperator" placeholder="符号"
                                style="width: 80px; margin-left: 5px; margin-right: 5px;">
                            <Option v-for="operator in operators" :key="operator.value" :value="operator.value">{{
                                    operator.label
                                }}
                            </Option>
                        </Select>
                        <Input v-model="expCourseScore" placeholder="分数" style="width: 50px; margin-right: 20px;"/>
                    </div>
                    <div style="display: flex; align-items: center;">
                        <span>专业基础课</span>
                        <Select v-model="selectedBasicCourseOperator" placeholder="符号"
                                style="width: 80px; margin-left: 5px; margin-right: 5px;">
                            <Option v-for="operator in operators" :key="operator.value" :value="operator.value">{{
                                    operator.label
                                }}
                            </Option>
                        </Select>
                        <Input v-model="basicCourseScore" placeholder="分数" style="width: 50px;"/>
                    </div>
                </div>
            </div>
        </div>

        <!-- 个人素养查询 -->
        <div class="card" style="margin-top: 20px;">
            <h3>个人素养查询</h3>
            <div class="query-section">
                <div class="row">
                    <span style="margin-right: 10px;">政治面貌</span>
                    <CheckboxGroup v-model="politicalStatus" style="display: flex; margin-right: 600px">
                        <Checkbox label="党员" style="margin-right: 5px;">党员</Checkbox>
                        <Checkbox label="预备党员" style="margin-right: 5px;">预备党员</Checkbox>
                        <Checkbox label="共青团员" style="margin-right: 5px;">共青团员</Checkbox>
                        <Checkbox label="群众" style="margin-right: 5px;">群众</Checkbox>
                        <Checkbox label="其他" style="margin-right: 5px;">其他</Checkbox>
                    </CheckboxGroup>
                </div>
                <div class="row" style="margin-top: 10px; align-items: center;">
                    <span style="margin-right: 5px;">证书</span>
                    <Input v-model="certificate" placeholder="请输入证书信息" style="width: 50%; margin-right: 400px"/>
                </div>
                <div class="row" style="margin-top: 10px; align-items: center;">
                    <span style="margin-right: 5px;">竞赛</span>
                    <Input v-model="competition" placeholder="请输入竞赛信息" style="width: 50%; margin-right: 400px"/>
                </div>
                <div class="row" style="margin-top: 10px; align-items: center;">
                    <span style="margin-right: 5px;">奖学金</span>
                    <Input v-model="scholarship" placeholder="请输入奖学金信息" style="width: 50%; margin-right: 400px "/>
                </div>
                <div class="row" style="margin-top: 10px; align-items: center;">
                    <span style="margin-right: 5px;">学生生源地</span>
                    <Input v-model="studentSource" placeholder="请输入生源地" style="width: 50%; margin-right: 400px"/>
                </div>
            </div>
        </div>

        <!-- 按钮 -->
        <div class="button-group">
            <i-button type="primary" size="large" @click="search" style="font-size: 18px;">搜索</i-button>
            <i-button size="large" @click="reset" style="font-size: 18px; margin-left: 20px;">重置</i-button>
            <i-button type="primary" size="large" @click="fetchLatestData" style="font-size: 18px; margin-left: 20px;">最新数据获取
            </i-button>
        </div>

        <!-- 查询结果 -->
        <div class="card" v-if="results.length" style="margin-top: 20px;">
            <h3>查询结果</h3>
            <table>
                <thead>
                <tr>
                    <th>No</th>
                    <th>姓名</th>
                    <th>学校</th>
                    <th>生源地</th>
                    <th>政治面貌</th>
                    <th>奖学金情况</th>
                    <th>竞赛情况</th>
                    <th>证书</th>
                    <th>绩点</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(result, index) in results" :key="index">
                    <td>{{ index + 1 }}</td>
                    <td>{{ result.studentNm }}</td>
                    <td>{{ result.schNm }}</td>
                    <td>{{ result.hometown }}</td>
                    <td>{{ result.party }}</td>
                    <td>{{ formatScholarship(result.scholarship) }}</td>
                    <td>{{ result.contest }}</td>
                    <td>{{ result.certificate }}</td>
                    <td>{{ result.gpa }}</td>
                </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
import {Select, Option, Input, CheckboxGroup, Checkbox, Button as IButton, Message} from 'view-design';
import {fetchAllSchools} from '@/api/schmanage';
import {fetchAllJobs} from '@/api/Jobmanage';
import {fetchAllAbilities,getNewData} from '@/api/ability';
import {getStudentInfo} from '@/api/jobportray';

export default {
    name: 'SearchPage',
    components: { IButton },
    data() {
        return {
            selectedAbilityNm: '',
            selectedJobName: '',
            selectedJobId: '', // 存储当前选中的 jobId
            jobs: [],
            selectedLevel: '',
            selectedAbility: '',
            selectedOperator: '',
            abilityScore: '',
            selectedSchool: '',
            selectedCoreCourseOperator: '',
            coreCourseScore: '',
            selectedExpCourseOperator: '',
            expCourseScore: '',
            selectedBasicCourseOperator: '',
            basicCourseScore: '',
            politicalStatus: [],
            certificate: '',
            competition: '',
            scholarship: '',
            studentSource: '',
            results: [],
            levels: [
                {value: '一级', label: '一级'},
                {value: '二级', label: '二级'},
                {value: '三级', label: '三级'},
                {value: '四级', label: '四级'},
                {value: '五级', label: '五级'}
            ],
            abilities: [],
            operators: [
                {value: '>', label: '>'},
                {value: '>=', label: '>='},
                {value: '<', label: '<'},
                {value: '<=', label: '<='}
            ],
            schools: [],
        };
    },
    created() {
        this.fetchSchools();
        this.fetchAbilities();
        this.fetchJobs();
    },
    methods: {
        async fetchLatestData() {
            try {
                await getNewData();
                Message.success('最新数据获取成功');
                // Optionally refresh your data here
            } catch (error) {
                Message.error('获取最新数据失败');
            }
        },
        fetchAbilities() {
            fetchAllAbilities()
                .then(response => {
                    if (Array.isArray(response.data)) {
                        this.abilities = response.data.map(ability => ({
                            value: ability.abilityid,
                            label: ability.abilitynm
                        }));
                        this.selectedAbility = this.abilities[0].value;
                        this.selectedAbilityNm = this.abilities[0].label;
                    } else {
                        Message.error('Failed to fetch abilities: Invalid data format');
                    }
                })
                .catch(error => {
                    Message.error('Failed to fetch abilities');
                });
        },
        fetchJobs() {
            fetchAllJobs()
                .then(response => {
                    if (Array.isArray(response.data)) {
                        this.jobs = response.data.map(job => ({
                            value: job.jobid,
                            label: job.jobname
                        }));
                        this.selectedJobId = this.jobs[0].value;
                        this.selectedJobName = this.jobs[0].label;
                    } else {
                        Message.error('Failed to fetch jobs: Invalid data format');
                    }
                })
                .catch(error => {
                    Message.error('Failed to fetch jobs');
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
                        Message.error('Failed to fetch schools: Invalid data format');
                    }
                })
                .catch(error => {
                    Message.error('Failed to fetch schools');
                });
        },
        search() {
            const group1 = this.selectedJobId && this.selectedAbility && this.selectedLevel && this.selectedOperator && this.abilityScore;
            const group2 = this.selectedSchool || (this.selectedCoreCourseOperator && this.coreCourseScore) || (this.selectedExpCourseOperator && this.expCourseScore) || (this.selectedBasicCourseOperator && this.basicCourseScore);

            if (!group1 && !group2) {
                Message.error('Either group1 (jobid, abilityId, score, scoreComparison) or group2 (schid, types, minScores, minScoreComparisons) must be provided.');
                return;
            }

            const params = {};
            if (group1) {
                params.jobid = this.selectedJobId;
                params.abilityId = this.selectedAbility;
                params.score = this.abilityScore;
                params.scoreComparison = this.selectedOperator;
            }
            if (group2) {
                params.schid = this.selectedSchool;
                params.types = [];
                params.minScores = [];
                params.minScoreComparisons = [];

                if (this.selectedCoreCourseOperator && this.coreCourseScore) {
                    params.types.push('专业核心课');
                    params.minScores.push(this.coreCourseScore);
                    params.minScoreComparisons.push(this.selectedCoreCourseOperator);
                }
                if (this.selectedExpCourseOperator && this.expCourseScore) {
                    params.types.push('专业拓展课');
                    params.minScores.push(this.expCourseScore);
                    params.minScoreComparisons.push(this.selectedExpCourseOperator);
                }
                if (this.selectedBasicCourseOperator && this.basicCourseScore) {
                    params.types.push('专业基础课');
                    params.minScores.push(this.basicCourseScore);
                    params.minScoreComparisons.push(this.selectedBasicCourseOperator);
                }
            }

            getStudentInfo(params)
                .then(response => {
                    if (response.data) {
                        this.results = response.data.map((item, index) => ({
                            No: index + 1,
                            studentNm: item.studentNm,
                            schNm: item.schNm,
                            hometown: item.hometown,
                            party: item.party,
                            scholarship: this.formatScholarship(item.scholarship),
                            contest: item.contest,
                            certificate: item.certificate,
                            gpa: item.gpa
                        }));
                    } else {
                        Message.error('查询结果数据格式不正确');
                    }
                })
                .catch(error => {
                    Message.error('查询失败');
                });
        },
        reset() {
            this.selectedJobId = '';
            this.selectedAbility = '';
            this.selectedLevel = '';
            this.selectedOperator = '';
            this.abilityScore = '';
            this.selectedSchool = '';
            this.selectedCoreCourseOperator = '';
            this.coreCourseScore = '';
            this.selectedExpCourseOperator = '';
            this.expCourseScore = '';
            this.selectedBasicCourseOperator = '';
            this.basicCourseScore = '';
            this.politicalStatus = [];
            this.certificate = '';
            this.competition = '';
            this.scholarship = '';
            this.studentSource = '';
            this.results = [];
        },
        formatScholarship(scholarship) {
            return scholarship.replace(/;/g, '\n');
        }
    }
};
</script>

<style scoped>
.container {
    width: 80%;
    margin: 0 auto;
}

.card {
    border: 1px solid #ccc;
    padding: 20px;
    margin-top: 20px;
    border-radius: 5px;
}

.query-section {
    display: flex;
    flex-direction: column;
}

.row {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
}

.button-group {
    display: flex;
    justify-content: center;
    margin-top: 20px;
}

.table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
}

.table th, .table td {
    border: 1px solid #ccc;
    padding: 10px;
    text-align: center;
}

.table th {
    background-color: #f9f9f9;
}
</style>

