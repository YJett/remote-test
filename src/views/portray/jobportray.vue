<template>
    <div class="container">
        <!-- 岗位能力查询 -->
        <div class="card" style="margin-top: 20px;">
            <h3>岗位能力查询</h3>
            <div class="row">
                <span>岗位</span>
                <Select v-model="selectedJobId" placeholder="请选择岗位" style="width: 150px; margin-right: 10px;">
                    <Option v-for="job in jobs" :key="job.jobId" :value="job.value">{{ job.label }}</Option>
                </Select>
                <span>等级</span>
                <Select v-model="selectedLevel" placeholder="请选择等级" style="width: 150px; margin-right: 10px;">
                    <Option v-for="level in levels" :key="level.value" :value="level.value">{{ level.label }}</Option>
                </Select>
                <div style="display: flex; align-items: center; margin-right: 100px;">
                    <span>能力域</span>
                    <Select v-model="selectedAbility" placeholder="请选择能力域" style="width: 150px; ">
                        <Option v-for="ability in abilities" :key="ability.value" :value="ability.value">{{ ability.label }}</Option>
                    </Select>
                    <Select v-model="selectedOperator" placeholder="符号" style="width: 80px; ">
                        <Option v-for="operator in operators" :key="operator.value" :value="operator.value">{{ operator.label }}</Option>
                    </Select>
                    <Input v-model="abilityScore" placeholder="分数" style="width: 80px; "/>
                </div>
            </div>
        </div>

        <!-- 知识能力查询 -->
        <div class="card" style="margin-top: 20px;">
            <div class="row" style="align-items: center; justify-content: space-between;">
                <h3>知识能力查询</h3>
                <div style="display: flex; align-items: center; margin-right: 600px;">
                    <span>学校</span>
                    <Select v-model="selectedSchool" placeholder="请选择学校" style="width: 200px;">
                        <Option v-for="opt in schools" :key="opt.value" :value="opt.value">{{ opt.label }}</Option>
                    </Select>
                </div>
            </div>
            <div class="query-section">
                <div class="row">
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
                    <Select v-model="selectedExpCourseOperator" placeholder="符号" style="width: 80px; margin-left: 5px; margin-right: 5px;">
                        <Option v-for="operator in operators" :key="operator.value" :value="operator.value">{{ operator.label }}</Option>
                    </Select>
                    <Input v-model="expCourseScore" placeholder="分数" style="width: 50px; margin-right: 20px;" />
                    </div>
                    <div style="display: flex; align-items: center; margin-right: 100px;">
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
                    <Input v-model="certificate" placeholder="请输入证书信息" style="width: 50%; margin-right: 400px" />
                </div>
                <div class="row" style="margin-top: 10px; align-items: center;">
                    <span style="margin-right: 5px;">竞赛</span>
                    <Input v-model="competition" placeholder="请输入竞赛信息" style="width: 50%; margin-right: 400px" />
                </div>
                <div class="row" style="margin-top: 10px; align-items: center;">
                    <span style="margin-right: 5px;">奖学金</span>
                    <Input v-model="scholarship" placeholder="请输入奖学金信息" style="width: 50%; margin-right: 400px " />
                </div>
                <div class="row" style="margin-top: 10px; align-items: center;">
                    <span style="margin-right: 5px;">学生生源地</span>
                    <Input v-model="studentSource" placeholder="请输入生源地" style="width: 50%; margin-right: 400px" />
                </div>
            </div>
        </div>

        <!-- 按钮 -->
        <div class="button-group">
            <i-button type="primary" size="large" @click="search" style="font-size: 18px;">搜索</i-button>
            <i-button size="large" @click="reset" style="font-size: 18px; margin-left: 20px;">重置</i-button>
            <i-button type="primary" size="large" @click="fetchLatestData" style="font-size: 18px; margin-left: 20px;">最新数据获取</i-button>
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
                <tr v-for="result in results" :key="result.no">
                    <td>{{ result.no }}</td>
                    <td>{{ result.name }}</td>
                    <td>{{ result.school }}</td>
                    <td>{{ result.source }}</td>
                    <td>{{ result.politicalStatus }}</td>
                    <td>{{ result.scholarship }}</td>
                    <td>{{ result.competition }}</td>
                    <td>{{ result.certificate }}</td>
                    <td>{{ result.gpa }}</td>
                </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
import { Select, Option, Input, CheckboxGroup, Checkbox, Button as IButton, Message } from 'view-design';
import { fetchAllSchools } from '@/api/schmanage';
import { fetchAllJobs } from '@/api/Jobmanage';


export default {
    data() {
        return {
            selectedJobName: '',
            selectedJobId:'', // 存储当前选中的 jobId
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
                {value: 'level1', label: '等级一'},
                {value: 'level2', label: '等级二'},
                {value: 'level3', label: '等级三'},
                {value: 'level4', label: '等级四'},
                {value: 'level5', label: '等级五'}
            ],
            abilities: [{value: 'ability1', label: '能力1'}, {value: 'ability2', label: '能力2'}],
            operators: [
                {value: '>', label: '>'},
                {value: '>=', label: '>='},
                {value: '<', label: '<'},
                {value: '<=', label: '<='}
            ],
            schools: [{value: 'school1', label: '学校1'}, {value: 'school2', label: '学校2'}
            ]
        };
    },
    created() {
        this.fetchSchools();
    },
    async mounted() {
        await this.fetchJobs();
    },
    methods: {
        fetchJobs() {
            fetchAllJobs()
                .then(response => {
                    if (Array.isArray(response.data)) {
                        this.jobs = response.data.map(job => ({
                            value: job.jobid,
                            label: job.jobname
                        }));
                        // console.log(this.jobs[0].value);
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
                            value: school.schName,
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
            // 模拟查询结果
            this.results = [
                {
                    no: 1,
                    name: '张三',
                    school: '学校A',
                    source: '地区1',
                    politicalStatus: '党员',
                    scholarship: '有',
                    competition: '国赛',
                    certificate: '计算机证书',
                    gpa: '3.8'
                },
                {
                    no: 2,
                    name: '李四',
                    school: '学校B',
                    source: '地区2',
                    politicalStatus: '预备党员',
                    scholarship: '无',
                    competition: '校赛',
                    certificate: '英语四级',
                    gpa: '3.5'
                }
            ];
        },
        reset() {
            // 重置所有查询条件和结果
            this.selectedJobId = '';
            this.selectedLevel = '';
            this.selectedAbility = '';
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
        fetchLatestData() {
            // 获取最新数据的逻辑
            Message.info('正在获取最新数据...');
        }
    }
}
</script>

<style scoped>
.container {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
    background-color: #e6f7ff; /* Light blue background color */
    height: 100vh;
    overflow-y: scroll;
}

.card {
    background: rgba(255, 255, 255, 0.7);
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    width: 90%;
    padding: 20px;
    margin-top: 20px;
}

.query-section {
    margin-top: 10px;
}

.row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 10px;
}

h3 {
    font-size: 24px;
    font-weight: 700;
    margin-bottom: 10px;
}

span {
    font-size: 16px;
    margin-right: 10px;
    font-weight: 500;
}

.button-group {
    display: flex;
    justify-content: center;
    margin-top: 20px;
}

.result-section {
    margin-top: 40px;
    width: 100%;
}

.result-card {
    background: rgba(255, 255, 255, 0.7);
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    padding: 20px;
    margin-bottom: 20px;
}

table {
    width: 100%;
    border-collapse: collapse;
}

th, td {
    padding: 10px;
    text-align: left;
    border: 1px solid #ddd;
}

th {
    background-color: #f4f4f4;
    font-weight: 700;
}
</style>
