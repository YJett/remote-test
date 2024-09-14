<template>
    <div class="container">
        <!-- 岗位能力查询 -->
        <div class="card query-card">
            <div class="query-section">
                <div class="row">
                    <h3 style="margin-right: 20px;">岗位能力查询</h3>
                    <span>选择岗位<span style="color: red;font-size: 12px; font-weight: bold;">*必选</span></span>
                    <Select v-model="selectedJobId" placeholder="请选择岗位" style="width: 200px; margin-left: 10px; margin-right: 30px;">
                        <Option v-for="job in jobs" :key="job.value" :value="job.value">{{ job.label }}</Option>
                    </Select>
                    <span>选择能力</span>
                    <Select v-model="selectedAbility" placeholder="请选择能力" style="width: 200px; margin-left: 10px; margin-right: 30px;">
                        <Option v-for="ability in abilities" :key="ability.value" :value="ability.value">{{ ability.label }}</Option>
                    </Select>
                    <Select v-model="selectedOperator" placeholder="符号" style="width: 80px; margin-left: -20px; margin-right: 10px;">
                        <Option v-for="operator in operators" :key="operator.value" :value="operator.value">{{ operator.label }}</Option>
                    </Select>
                    <Input v-model="abilityScore" placeholder="分数" style="width: 50px; margin-right: 30px;"/>
                </div>
            </div>
        </div>

        <!-- 知识能力查询 -->
        <div class="card query-card" style="margin-top: 20px;">
            <div class="query-section">
                <div class="row">
                    <h3 style="margin-right: 20px;">知识能力查询</h3>
                    <span>选择学校<span style="color: red;font-size: 12px; font-weight: bold;">*必选</span></span>
                    <Select
                        v-model="selectedSchool"
                        placeholder="请选择学校"
                        class="transparent-input"
                        style="width: 300px;"
                        :disabled="isSchoolLocked"
                    >
                        <Option v-for="opt in schools" :key="opt.value" :value="opt.value">{{ opt.label }}</Option>
                    </Select>
                    <div style="display: flex; align-items: center; margin-right: 50px;">
                        <span>专业核心课</span>
                        <Select v-model="selectedCoreCourseOperator" placeholder="符号"
                                style="width: 80px; margin-left: 5px; margin-right: 5px;">
                            <Option v-for="operator in operators" :key="operator.value" :value="operator.value">{{ operator.label }}</Option>
                        </Select>
                        <Input v-model="coreCourseScore" placeholder="分数" style="width: 50px; margin-right: 20px;"/>
                    </div>
                    <div style="display: flex; align-items: center; margin-right: 50px;">
                        <span>专业拓展课</span>
                        <Select v-model="selectedExpCourseOperator" placeholder="符号"
                                style="width: 80px; margin-left: 5px; margin-right: 5px;">
                            <Option v-for="operator in operators" :key="operator.value" :value="operator.value">{{ operator.label }}</Option>
                        </Select>
                        <Input v-model="expCourseScore" placeholder="分数" style="width: 50px; margin-right: 20px;"/>
                    </div>
                    <div style="display: flex; align-items: center;">
                        <span>专业基础课</span>
                        <Select v-model="selectedBasicCourseOperator" placeholder="符号"
                                style="width: 80px; margin-left: 5px; margin-right: 5px;">
                            <Option v-for="operator in operators" :key="operator.value" :value="operator.value">{{ operator.label }}</Option>
                        </Select>
                        <Input v-model="basicCourseScore" placeholder="分数" style="width: 50px;"/>
                    </div>
                </div>
            </div>
        </div>

        <!-- 个人素养查询 -->
        <div class="card query-card" style="margin-top: 20px;">
            <div class="query-section">
                <div class="row">
                    <h3 style="margin-right: 20px;">个人素养查询</h3>
                    <!-- 将CheckboxGroup改为RadioGroup，并且将v-model="politicalStatus"应用到RadioGroup上 -->
                    <RadioGroup v-model="politicalStatus" style="display: flex; margin-right: 600px">
                        <Radio label="党员" style="margin-right: 5px;">党员</Radio>
                        <Radio label="预备党员" style="margin-right: 5px;">预备党员</Radio>
                        <Radio label="共青团员" style="margin-right: 5px;">共青团员</Radio>
                        <Radio label="群众" style="margin-right: 5px;">群众</Radio>
                    </RadioGroup>
                    <div class="row" style="margin-top: 10px; align-items: center;">
                        <span style="margin-left: -500px;">学生生源地</span>
                        <Input v-model="studentSource" placeholder="请输入生源地" style="width: 300px; margin-left: 10px"/>
                    </div>
                </div>
                <div class="row" style="margin-top: 10px; align-items: center;">
                    <span style="margin-right: 5px;">证书</span>
                    <Input v-model="certificate" placeholder="请输入证书信息" style="width: 300px; margin-left: 10px"/>
                    <span style="margin-left: 20px;">竞赛</span>
                    <Input v-model="competition" placeholder="请输入竞赛信息" style="width: 300px; margin-left: 10px"/>
                    <span style="margin-left: 20px;">奖学金</span>
                    <Input v-model="scholarship" placeholder="请输入奖学金信息" style="width: 300px; margin-left: 10px"/>
                </div>
            </div>
        </div>

        <!-- 按钮 -->
        <div class="button-group">
            <i-button type="primary" size="large" @click="search" style="font-size: 18px;">搜索</i-button>
            <i-button size="large" @click="reset" style="font-size: 18px; margin-left: 20px;">重置</i-button>
            <i-button type="primary" size="large" @click="fetchLatestData" style="font-size: 18px; margin-left: 20px;">最新数据获取</i-button>
        </div>

        <div class="card result-card" v-if="results.length" style="margin-top: 20px;">
            <h3>查询结果</h3>
            <table class="result-table">
                <thead>
                <tr>
                    <th>No</th>
                    <th>姓名</th>
                    <th>学号</th>
                    <th>学校</th>
                    <th>生源地</th>
                    <th>政治面貌</th>
                    <th>奖学金情况</th>
                    <th>竞赛情况</th>
                    <th>证书</th>
<!--                    <th>绩点</th>-->
                </tr>
                </thead>
                <tbody>
                <tr v-for="(result, index) in paginatedResults" :key="index">
                    <td>{{ index + 1 + (currentPage - 1) * pageSize }}</td>
                    <td>{{ result.studentNm || '' }}</td>
                    <td>
         <span
             class="clickable"
             @click="handleRadarPage(result)"
             style="color: blue; cursor: pointer;"
         >
    {{ result.studentNo || '' }}
    </span>
                    </td>
                    <td>{{ result.schName || '' }}</td>
                    <td>{{ result.hometown || '' }}</td>
                    <td>{{ result.party || '' }}</td>
                    <td v-html="formatScholarship(result.scholarship)"></td>
                    <td>{{ result.contest || '' }}</td>
                    <td>{{ result.certificate || '' }}</td>
<!--                    <td>{{ result.gpa !== null && result.gpa !== undefined ? result.gpa : '' }}</td>-->
                </tr>
                </tbody>
            </table>
            <div class="pagination">
                <i-button @click="prevPage" :disabled="currentPage === 1">上一页</i-button>
                <span>第 {{ currentPage }} 页 / 共 {{ totalPages }} 页</span>
                <i-button @click="nextPage" :disabled="currentPage === totalPages">下一页</i-button>
                <span>跳转到:</span>
                <input type="number" v-model.number="jumpPage" @keyup.enter="goToPage" style="width: 50px;"/>
                <i-button @click="goToPage">跳转</i-button>
            </div>
        </div>
    </div>
</template>

<script>
import {Select, Option, Input, CheckboxGroup, Checkbox, Button as IButton, Message} from 'view-design';
import {fetchAllSchools,getSchNameByLoginName} from '@/api/schmanage';
import {fetchAllJobs} from '@/api/Jobmanage';
import {fetchAllAbilities, getNewData} from '@/api/ability';
import {getStudentInfo} from '@/api/jobportray';

export default {
    name: 'SearchPage',
    components: {IButton},
    data() {
        return {
            isSchoolLocked: false,
            selectedAbilityNm: '',
            selectedJobName: '',
            selectedJobId: '',
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
            politicalStatus: '',
            certificate: '',
            competition: '',
            scholarship: '',
            studentSource: '',
            results: [],
            abilities: [],
            operators: [
                {value: '>', label: '>'},
                {value: '>=', label: '>='},
                {value: '<', label: '<'},
                {value: '<=', label: '<='}
            ],
            schools: [],
            currentPage: 1,
            pageSize: 10,
            jumpPage: 1
        };
    },
    computed: {
        paginatedResults() {
            const start = (this.currentPage - 1) * this.pageSize;
            const end = start + this.pageSize;
            return this.results.slice(start, end);
        },
        totalPages() {
            return Math.ceil(this.results.length / this.pageSize);
        }
    },
    mounted() {
        // 恢复查询结果
        const savedResults = localStorage.getItem('studentResults');
        if (savedResults) {
            this.results = JSON.parse(savedResults);
        }

        // 恢复表单输入
        const savedFormData = localStorage.getItem('formData');
        const savedPage = localStorage.getItem('currentPage');
        if (savedPage) {
            this.currentPage = parseInt(savedPage, 10);
        }

        // 恢复选择的岗位和学校
        const savedJobId = localStorage.getItem('selectedJobId');
        if (savedJobId) {
            this.selectedJobId = savedJobId;
        }

        const savedSchool = localStorage.getItem('selectedSchool');
        if (savedSchool) {
            this.selectedSchool = savedSchool;
        }
        if (savedFormData) {
            const formData = JSON.parse(savedFormData);
            this.selectedJobId = formData.selectedJobId;
            this.selectedSchool = formData.selectedSchool;
            this.selectedAbility = formData.selectedAbility;
            this.selectedOperator = formData.selectedOperator;
            this.abilityScore = formData.abilityScore;
            this.selectedCoreCourseOperator = formData.selectedCoreCourseOperator;
            this.coreCourseScore = formData.coreCourseScore;
            this.selectedExpCourseOperator = formData.selectedExpCourseOperator;
            this.expCourseScore = formData.expCourseScore;
            this.selectedBasicCourseOperator = formData.selectedBasicCourseOperator;
            this.basicCourseScore = formData.basicCourseScore;
            this.politicalStatus = formData.politicalStatus;
            this.certificate = formData.certificate;
            this.competition = formData.competition;
            this.scholarship = formData.scholarship;
            this.studentSource = formData.studentSource;
        }
    },

    created() {
        this.initialize();
        this.fetchSchools();
        this.fetchAbilities();
        this.fetchJobs();
    },
    methods: {

        initialize() {
            this.fetchSchools();
            const flg = parseInt(localStorage.getItem('flg'));
            const userName = localStorage.getItem('name');
            if (flg === 1 && userName) {
                this.isSchoolLocked = true;
                this.getSchoolName(userName);
            }
        },
        getSchoolName(loginName) {
            getSchNameByLoginName(loginName).then(response => {
                this.selectedSchool = response.data;
            }).catch(error => {
                console.error('获取学校名称失败:', error);
                Message.error('获取学校名称失败');
            });
        },
        prevPage() {
            if (this.currentPage > 1) {
                this.currentPage--;
            }
        },
        nextPage() {
            if (this.currentPage < this.totalPages) {
                this.currentPage++;
            }
        },
        goToPage() {
            if (this.jumpPage > 0 && this.jumpPage <= this.totalPages) {
                this.currentPage = this.jumpPage;
            } else {
                Message.error('页码超出范围');
            }
        },
        async fetchLatestData() {
            try {
                await getNewData();
                Message.success('最新数据获取成功');
            } catch (error) {
                Message.error('获取最新数据失败');
            }
        },
        async fetchAbilities() {
            try {
                const response = await fetchAllAbilities();
                this.abilities = response.data.map(ability => ({
                    label: ability.abilitynm,
                    value: ability.abilityno
                }));
            } catch (error) {
                Message.error('获取能力信息失败');
            }
        },
        async fetchJobs() {
            try {
                const response = await fetchAllJobs();
                this.jobs = response.data.map(job => ({
                    label: job.jobname,
                    value: job.jobid
                }));
            } catch (error) {
                Message.error('获取岗位信息失败');
            }
        },
        async fetchSchools() {
            try {
                const response = await fetchAllSchools();
                this.schools = response.data
                    .filter(school => school.status !== 9)
                    .map(school => ({
                        label: school.schName,
                        value: school.schName,
                        id: school.schId
                    }));
            } catch (error) {
                Message.error('获取学校信息失败');
            }
        },
        search() {
            if (!this.selectedJobId || !this.selectedSchool) {
                Message.error('请选择岗位和学校');
                return;
            }
            const selectedSchoolObj = this.schools.find(school => school.value === this.selectedSchool);
            const schId = selectedSchoolObj ? selectedSchoolObj.id : '';

            const group1 = this.selectedAbility && this.selectedOperator && this.abilityScore;

            const group2 = (this.selectedCoreCourseOperator && this.coreCourseScore) || (this.selectedExpCourseOperator && this.expCourseScore) || (this.selectedBasicCourseOperator && this.basicCourseScore);

            const group3 = (this.politicalStatus) || (this.certificate ) || (this.competition) || (this.studentSource ) || (this.scholarship );
            // if (!group1 || !group2 || !group3) {
            //     Message.error('至少需要填写一个查询条件');
            //     return;
            // }

            const params = {};
            params.jobid = this.selectedJobId;
            params.schid = schId;

            if (group1) {
                params.abilityId = this.selectedAbility;
                params.score = this.abilityScore;
                params.scoreComparison = this.selectedOperator;
            }
            if (group2) {
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

            if (group3){
                params.party = this.politicalStatus|| null;
                params.cinfo = this.certificate || null;
                params.binfo = this.competition || null;
                params.ainfo = this.scholarship || null;
                params.hometown = this.studentSource || null;
            }

            // console.log('请求参数:', params);
            getStudentInfo(params)
                .then(response => {
                    if (response.data) {
                        this.results = response.data.map((item, index) => ({
                            studentNo:item.studentNo,
                            studentNm: item.studentNm,
                            schName: item.schName,
                            hometown: item.hometown,
                            party: item.party,
                            scholarship: item.scholarship,
                            contest: item.contest,
                            certificate: item.certificate,
                            gpa: item.gpa
                        }));
                        if (this.results.length === 0) {
                            Message.info('查询无结果');
                        } else {
                            // 存储查询结果到 localStorage 中
                            localStorage.setItem('studentResults', JSON.stringify(this.results));
                        }
                    } else {
                        Message.error('查询结果数据格式不正确');
                    }
                })
                .catch(error => {
                    console.error('Error:', error); // 添加日志
                    Message.error('查询失败');
                });
            // 存储表单输入到 localStorage
            const formData = {
                selectedJobId: this.selectedJobId,
                selectedSchool: this.selectedSchool,
                selectedAbility: this.selectedAbility,
                selectedOperator: this.selectedOperator,
                abilityScore: this.abilityScore,
                selectedCoreCourseOperator: this.selectedCoreCourseOperator,
                coreCourseScore: this.coreCourseScore,
                selectedExpCourseOperator: this.selectedExpCourseOperator,
                expCourseScore: this.expCourseScore,
                selectedBasicCourseOperator: this.selectedBasicCourseOperator,
                basicCourseScore: this.basicCourseScore,
                politicalStatus: this.politicalStatus,
                certificate: this.certificate,
                competition: this.competition,
                scholarship: this.scholarship,
                studentSource: this.studentSource
            };
            localStorage.setItem('formData', JSON.stringify(formData));
            localStorage.setItem('results', JSON.stringify(this.results));

            // 你可以选择存储其他需要保持的状态，如页码、选择的岗位和学校等
            localStorage.setItem('currentPage', this.currentPage);
            localStorage.setItem('selectedJobId', this.selectedJobId);
            localStorage.setItem('selectedSchool', this.selectedSchool);
        },
        handleRadarPage(result) {
            // 从结果中提取需要的参数
            const studentNo = result.studentNo;

            // 查找学校对象并获取 schoolId
            const SchoolObj = this.schools.find(school => school.value === result.schName);
            const schoolId = SchoolObj ? SchoolObj.id : ''; // 确保使用正确的属性来获得 schoolId


            // 调用 goToRadarPage 方法，并传递 schoolId、studentNo 和 jobId
            this.goToRadarPage(schoolId, studentNo, this.selectedJobId);
        },

        // 跳转到雷达图页面的方法
        goToRadarPage(schoolId, studentNo, jobId) {
            // console.log('Navigating to radar page with parameters:');
            // console.log('School ID:', schoolId);
            // console.log('Student Number:', studentNo);
            // console.log('Job ID:', jobId);
            this.$router.push({
                path: '/radar',
                query: {
                    schId: schoolId,
                    jobId: jobId,
                    studentNo: studentNo
                },
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
            this.politicalStatus = '';
            this.certificate = '';
            this.competition = '';
            this.scholarship = '';
            this.studentSource = '';
            this.results = [];
            localStorage.removeItem('studentResults');
            localStorage.removeItem('formData');
        },
        formatScholarship(scholarship) {
            return scholarship ? scholarship.replace(/;/g, '<br>') : '';
        },
    }
};
</script>

<style scoped>
.container {
    width: 100%;
    padding: 10px; /* 缩小整体页面的内边距 */
    overflow-y: auto; /* 启用垂直滚动条 */
    max-height: 100vh; /* 限制容器的最大高度为视窗高度 */
    background-color: #e6f7ff; /* Light blue background color */
    font-size: 14px; /* 缩小整体页面的字体 */
}
.result-card {
    width: 100%; /* 使查询结果框与查询框一样宽 */
    overflow-y: auto; /* 查询结果框内加入垂直滚动条 */
    max-height: 300px; /* 设定查询结果框的最大高度 */
}

.card {
    border: 1px solid #ccc;
    padding: 10px; /* 缩小卡片的内边距 */
    margin-top: 10px; /* 缩小卡片的上边距 */
    border-radius: 5px;
}

.query-card {
    width: 100%;
}

.query-section {
    display: flex;
    flex-direction: column;
}

.row {
    display: flex;
    align-items: center;
    margin-bottom: 5px; /* 缩小行之间的间距 */
}

.button-group {
    display: flex;
    justify-content: center;
    margin-top: 10px; /* 缩小按钮组的上边距 */
}

.result-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 10px; /* 缩小表格的上边距 */
}

.result-table th, .result-table td {
    border: 1px solid #ccc;
    padding: 5px; /* 缩小表格单元格的内边距 */
    text-align: center;
}

.result-table th {
    background-color: #f9f9f9;
}
</style>
