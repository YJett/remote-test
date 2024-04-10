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
    { path: '/', redirect: '/home' },
]

// 本地所有的页面 需要配合后台返回的数据生成页面
export const asyncRoutes = {
//     boatUserManage: {
//         path: 'user',
//         name: 'user',
//         meta: { title: '用户管理' },
//         component: () => import('../views/BoatUserManage.vue'),
//     },
    home: {
        path: 'home',
        name: 'home',
        meta: { title: '主页' },
        component: () => import('../views/Home.vue'),
    },
    // bulletin: {
    //     path: 'bulletin',
    //     name: 'bulletin',
    //     meta: { title: '公告管理' },
    //     component: () => import('../views/bulletin.vue'),
    // },
    usermanage: {
        path: 'usermanage',
        name: 'usermanage',
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
