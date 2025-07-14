import Vue from 'vue'
import Router from 'vue-router'


Vue.use(Router)

const commonRoutes = [
    {
        path: '/login',
        name: 'login',
        meta: { title: '登录' },
        component: () => import('../components/Login.vue'),
    },
    {
        path: '/other', // 点击侧边栏跳到一个单独的路由页面，需要定义，层级和其他顶级路由一样
        name: 'other',
        meta: { title: '单独的路由' },
        component: () => import('../views/Other.vue'),
    },
    {
        path: '/404',
        name: '404',
        meta: { title: '404' },
        component: () => import('../components/404.vue'),
    },
]

// 本地所有的页面 需要配合后台返回的数据生成页面
export const asyncRoutes = {
    //     boatUserManage: {
    //         path: 'user',
    //         name: 'user',
    //         meta: { title: '用户管理' },
    //         component: () => import('../views/BoatUserManage.vue'),
    //     },
    //     home: {
    //         path: 'home',
    //         name: 'home',
    //         meta: { title: '主页' },
    //         component: () => import('../views/Home.vue'),
    //     },
    // bulletin: {
    //     path: 'bulletin',
    //     name: 'bulletin',
    //     meta: { title: '公告管理' },
    //     component: () => import('../views/bulletin.vue'),
    // },
    password: {
        path: 'password',
        name: 'password',
        meta: { title: '修改密码' },
        component: () => import('../views/Password.vue'),
    },

    user: {
        path: 'user',
        name: 'user',
        meta: { title: '用户管理' },
        component: () => import('../views/UserManage.vue'),
    },
    companymanage: {
        path: 'companymanage',
        name: 'companymanage',
        meta: { title: '企业信息管理' },
        component: () => import('../views/CompanyManage.vue'),
    },
    schoolmanage: {
        path: 'schoolmanage',
        name: 'schoolmanage',
        meta: { title: '学校信息管理' },
        component: () => import('../views/SchoolManage.vue'),
    },
    majorgraph: {
        path: 'majorgraph',
        name: 'majorgraph',
        meta: { title: 'majorgraph' },
        component: () => import('../views/MajorKnowGraph.vue'),
    },
    home: {
        path: 'home',
        name: 'home',
        meta: { title: 'home' },
        component: () => import('../views/knowledge/KnowDaoru.vue'),
    },
    knowmanage: {
        path: 'knowmanage',
        name: 'knowmanage',
        meta: { title: 'knowmanage' },
        component: () => import('../views/knowledge/KnowManage.vue'),
    },
    labilitydaoru: {
        path: 'labilitydaoru',
        name: 'labilitydaoru',
        meta: { title: 'labilitydaoru' },
        component: () => import('../views/skill/SkillDaoru.vue'),
    },
    labilitymanage: {
        path: 'labilitymanage',
        name: 'labilitymanage',
        meta: { title: 'labilitymanage' },
        component: () => import('../views/skill/SkillManage.vue'),
    },
    studentdaoru: {
        path: 'studentdaoru',
        name: 'studentdaoru',
        meta: { title: '数据导入' },
        component: () => import('../views/student/StudentDaoru.vue'),
    },
    // studentmatch: {
    //     path: 'studentmatch',
    //     name: 'studentmatch',
    //     meta: { title: '数据匹配' },
    //     component: () => import('../views/student/StudentMatch.vue'),
    // },
    // studentquery: {
    //     path: 'studentquery',
    //     name: 'studentquery',
    //     meta: { title: '数据查询' },
    //     component: () => import('../views/student/StudentQuery.vue'),
    // },
    // test1: {
    //     path: 'test1',
    //     name: 'test1',
    //     meta: { title: 'test1' },
    //     component: () => import('../views/erbuilder/index.vue'),
    // },
    // test2: {
    //     path: 'test2',
    //     name: 'test2',
    //     meta: { title: 'test2' },
    //     component: () => import('../views/kgbuilder/index.vue'),
    // },
    // test3: {
    //     path: 'test3',
    //     name: 'test3',
    //     meta: { title: 'test3' },
    //     component: () => import('../views/kgbuilder/index_v1.vue'),
    // },
    graphmatch: {
        path: 'graphmatch',
        name: 'graphmatch',
        meta: { title: 'graphmatch' },
        component: () => import('../views/kgbuilder/graphmatch.vue'),
    },
    knowledgeskill: {
        path: 'knowledgeskill',
        name: 'knowledgeskill',
        meta: { title: 'graphmatch' },
        component: () => import('../views/knowledgegraph/KnowledgeSkill.vue'),
    },
    jobportray: {
        path: 'jobportray',
        name: 'jobportray',
        meta: { title: 'jobportray' },
        component: () => import('../views/portray/jobportray.vue'),
    },
    resumegenerate: {
        path: 'resumegenerate',
        name: 'resumegenerate',
        meta: { title: '简历生成' },
        component: () => import('../views/resumegenerate.vue'),
    },
    radar: {
        path: 'radar',
        name: 'radar',
        meta: { title: '学生画像' },
        component: () => import('../views/radarMap/radar.vue'),
    },
    teachingAssistant: {
        path: 'teaching-assistant',
        name: 'teachingAssistant',
        meta: { title: '辅助教学' },
        component: () => import('../views/TeachingAssistant.vue'),
    },

}

const createRouter = () => new Router({
    routes: commonRoutes,
})

const router = createRouter()

export function resetRouter() {
    const newRouter = createRouter()
    router.matcher = newRouter.matcher
}

export default router



