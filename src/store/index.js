import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        isShowLoading: false, // 全局 loading
        // 左侧菜单栏数据
        menuItems: [
            {
                name: 'home', // 要跳转的路由名称 不是路径
                size: 18, // icon大小
                type: 'md-home', // icon类型
                text: '主页', // 文本内容
            },
            // {
            //     name: 'user', // 要跳转的路由名称 不是路径
            //     size: 18, // icon大小
            //     type: 'ios-grid', // icon类型
            //     text: '用户管理', // 点击侧边栏跳到一个单独的路由页面，需要提前在 router.js 定义
            // },
            {
                name: 'usermanage', // 要跳转的路由名称 不是路径
                size: 18, // icon大小
                type: 'ios-grid', // icon类型
                text: '用户管理', // 点击侧边栏跳到一个单独的路由页面，需要提前在 router.js 定义
            },
            {
                name: 'schoolmanage', // 要跳转的路由名称 不是路径
                size: 18, // icon大小
                type: 'ios-grid', // icon类型
                text: '学校信息管理', // 点击侧边栏跳到一个单独的路由页面，需要提前在 router.js 定义
            },
            {
                name: 'companymanage', // 要跳转的路由名称 不是路径
                size: 18, // icon大小
                type: 'ios-grid', // icon类型
                text: '企业信息管理', // 点击侧边栏跳到一个单独的路由页面，需要提前在 router.js 定义
            },
            {
                name: 'majorgraph', // 要跳转的路由名称 不是路径
                size: 18, // icon大小
                type: 'ios-grid', // icon类型
                text: '知识图谱', // 点击侧边栏跳到一个单独的路由页面，需要提前在 router.js 定义
            },
            // {
            //     name: 'bulletin', // 要跳转的路由名称 不是路径
            //     size: 18, // icon大小
            //     type: 'ios-grid', // icon类型
            //     text: '公告管理', // 点击侧边栏跳到一个单独的路由页面，需要提前在 router.js 定义
            // },
            {
                text: '知识体系',
                type: 'ios-paper',
                children: [
                    {
                        type: 'ios-grid',
                        name: 'knowdaoru',
                        text: '数据导入',
                        // hidden 属性 隐藏此菜单 可以通过在地址栏上输入对应的 URL 来显示页面
                        // hidden: true,
                    },
                    {
                        size: 18, // icon大小
                        type: 'ios-grid', // icon类型
                        name: 'knowmanage',
                        text: '体系管理',
                        // hidden 属性 隐藏此菜单 可以通过在地址栏上输入对应的 URL 来显示页面
                        // hidden: true,
                    }],
            },
            {
                text: '能力体系',
                type: 'ios-paper',
                children: [
                    {
                        type: 'ios-grid',
                        name: 'labilitydaoru',
                        text: '数据导入',
                        // hidden 属性 隐藏此菜单 可以通过在地址栏上输入对应的 URL 来显示页面
                        // hidden: true,
                    },
                    {
                        size: 18, // icon大小
                        type: 'ios-grid', // icon类型
                        name: 'labilitymanage',
                        text: '体系管理',
                        // hidden 属性 隐藏此菜单 可以通过在地址栏上输入对应的 URL 来显示页面
                        // hidden: true,
                    }],
            },
            {
                name: 'test1', // 要跳转的路由名称 不是路径
                size: 18, // icon大小
                type: 'ios-grid', // icon类型
                text: 'test1', // 点击侧边栏跳到一个单独的路由页面，需要提前在 router.js 定义
            },
            {
                name: 'test2', // 要跳转的路由名称 不是路径
                size: 18, // icon大小
                type: 'ios-grid', // icon类型
                text: 'test2', // 点击侧边栏跳到一个单独的路由页面，需要提前在 router.js 定义
            },
            {
                name: 'test3', // 要跳转的路由名称 不是路径
                size: 18, // icon大小
                type: 'ios-grid', // icon类型
                text: 'test3', // 点击侧边栏跳到一个单独的路由页面，需要提前在 router.js 定义
            },
            /*
            {
                text: '二级菜单',
                type: 'ios-paper',
                children: [
                    {
                        type: 'ios-grid',
                        name: 't1',
                        text: '表格',
                        // hidden 属性 隐藏此菜单 可以通过在地址栏上输入对应的 URL 来显示页面
                        // hidden: true,
                    },
                    {
                        size: 18, // icon大小
                        type: 'md-arrow-forward', // icon类型
                        text: '外链',
                        url: 'https://www.baidu.com',
                        isExternal: true, // 外链 跳到一个外部的 URL 页面
                    },
                    {
                        text: '三级菜单',
                        type: 'ios-paper',
                        children: [
                            {
                                type: 'ios-notifications-outline',
                                name: 'msg',
                                text: '查看消息',
                            },
                            {
                                type: 'md-lock',
                                name: 'password',
                                text: '修改密码',
                            },
                            {
                                type: 'md-person',
                                name: 'userinfo',
                                text: '基本资料',
                            },
                            {
                                size: 18, // icon大小
                                type: 'md-arrow-forward', // icon类型
                                text: '外链',
                                url: 'https://www.baidu.com',
                                isExternal: true, // 外链 跳到一个外部的 URL 页面
                            },
                        ],
                    },
                ],
            },
             */
        ],
        rewardDict: {
            1: '志愿时长',
            2: '第二课堂',
            3: '行为学分',
            4: '重修行为学分',
        },
    },
    mutations: {
        setMenus(state, items) {
            state.menuItems = [...items]
        },
        setLoading(state, isShowLoading) {
            state.isShowLoading = isShowLoading
        },
    },
})

export default store
