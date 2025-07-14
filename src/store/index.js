import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        userType: 0,
        isShowLoading: false, // 全局 loading
        // 左侧菜单栏数据
        menuItems: [
            {
                name: 'password', // 要跳转的路由名称 不是路径
                size: 18, // icon大小
                type: 'ios-grid', // icon类型
                text: '修改密码', // 点击侧边栏跳到一个单独的路由页面，需要提前在 router.js 定义
                hidden: true, // 隐藏此菜单项
            },
            {
                name: 'user', // 要跳转的路由名称 不是路径
                size: 18, // icon大小
                type: 'ios-grid', // icon类型
                text: '用户信息', // 点击侧边栏跳到一个单独的路由页面，需要提前在 router.js 定义
                hidden: true, // 隐藏此菜单项
            },
            {

                text: '基本信息',
                type: 'ios-paper',
                children: [
                    {
                        name: 'schoolmanage', // 要跳转的路由名称 不是路径
                        size: 18, // icon大小
                        type: 'ios-grid', // icon类型
                        text: '学校信息管理', // 点击侧边栏跳到一个单独的路由页面，需要提前在 router.js 定义
                        hidden: true, // 隐藏此菜单项
                    },
                    {
                        name: 'companymanage', // 要跳转的路由名称 不是路径
                        size: 18, // icon大小
                        type: 'ios-grid', // icon类型
                        text: '企业信息管理', // 点击侧边栏跳到一个单独的路由页面，需要提前在 router.js 定义
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
                    },
                    {
                        size: 18, // icon大小
                        type: 'ios-grid', // icon类型
                        name: 'labilitymanage',
                        text: '体系管理',
                    }],
            },
            {
                text: '知识体系',
                type: 'ios-paper',
                children: [
                    {
                        type: 'md-home',
                        name: 'home',
                        text: '数据导入',
                    },
                    {
                        size: 18, // icon大小
                        type: 'ios-grid', // icon类型
                        name: 'knowmanage',
                        text: '体系管理',
                    }],
            },
            {
                text: '学生数据',
                type: 'ios-paper',
                hidden: true, // 隐藏整个菜单组
                children: [
                    {
                        type: 'ios-grid',
                        name: 'studentdaoru',
                        text: '数据导入',
                    }
                ],
            },
            {
                name: 'knowledgeskill', // 要跳转的路由名称 不是路径
                size: 18, // icon大小
                type: 'ios-paper', // icon类型
                text: '能力知识匹配',
            },
            {
                name: 'radar', // 要跳转的路由名称 不是路径
                size: 18, // icon大小
                type: 'ios-paper', // icon类型
                text: '学生画像',
            },
            {
                name: 'jobportray',
                type: 'ios-paper',
                text: '人岗匹配',
            },
            {
                name: 'resumegenerate',
                size: 18,
                type: 'ios-grid',
                text: '简历生成',
                hidden: true,
            },
            {
                name: 'teachingAssistant', // 要跳转的路由名称 不是路径
                size: 18, // icon大小
                type: 'ios-school', // icon类型
                text: '辅助教学',
                hidden: true,
            },
        ],
        //管理员
        adminMenuItems: [
            {
                name: 'password', // 要跳转的路由名称 不是路径
                size: 18, // icon大小
                type: 'ios-grid', // icon类型
                text: '修改密码',
            },
            {
                name: 'user', // 要跳转的路由名称 不是路径
                size: 18, // icon大小
                type: 'ios-grid', // icon类型
                text: '用户信息',
                hidden: true,
            },
            {

                text: '基本信息',
                type: 'ios-paper',
                children: [
                    {
                        name: 'schoolmanage',
                        size: 18,
                        type: 'ios-grid',
                        text: '学校信息管理',
                        hidden: true,
                    },
                    {
                        name: 'companymanage',
                        size: 18,
                        type: 'ios-grid',
                        text: '企业信息管理',
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
                    },
                    {
                        size: 18,
                        type: 'ios-grid',
                        name: 'labilitymanage',
                        text: '体系管理',
                    }],
            },
            {
                text: '知识体系',
                type: 'ios-paper',
                children: [
                    {
                        type: 'md-home',
                        name: 'home',
                        text: '数据导入',
                    },
                    {
                        size: 18,
                        type: 'ios-grid',
                        name: 'knowmanage',
                        text: '体系管理',
                    }],
            },
            {
                text: '学生数据',
                type: 'ios-paper',
                hidden: true,
                children: [
                    {
                        type: 'ios-grid',
                        name: 'studentdaoru',
                        text: '数据导入',
                    }
                ],
            },
            {
                name: 'knowledgeskill',
                size: 18,
                type: 'ios-paper',
                text: '能力知识匹配',
            },
            {
                name: 'radar',
                size: 18,
                type: 'ios-paper',
                text: '学生画像',
            },
            {
                name: 'jobportray',
                size: 18,
                type: 'ios-paper',
                text: '人岗匹配',
            },
            {
                name: 'resumegenerate',
                size: 18,
                type: 'ios-grid',
                text: '简历生成',
                hidden: true,
            },
            {
                name: 'teachingAssistant',
                size: 18,
                type: 'ios-school',
                text: '辅助教学',
                hidden: true,
            },
        ],
        // 学校
        userMenuItems: [
            {
                name: 'password',
                size: 18,
                type: 'ios-grid',
                text: '修改密码',
            },
            {
                text: '知识体系',
                type: 'ios-paper',
                children: [
                    {
                        type: 'md-home',
                        name: 'home',
                        text: '数据导入',
                    },
                    {
                        size: 18,
                        type: 'ios-grid',
                        name: 'knowmanage',
                        text: '体系管理',
                    }],
            },
            {
                text: '学生数据',
                type: 'ios-paper',
                hidden: true,
                children: [
                    {
                        type: 'ios-grid',
                        name: 'studentdaoru',
                        text: '数据导入',
                    },
                ],
            },
            {
                name: 'knowledgeskill',
                size: 18,
                type: 'ios-paper',
                text: '能力知识匹配',
            },
            {
                name: 'radar', // 要跳转的路由名称 不是路径
                size: 18, // icon大小
                type: 'ios-paper', // icon类型
                text: '学生画像', // 点击侧边栏跳到一个单独的路由页面，需要提前在 router.js 定义
                hidden: true,
                children: [
                    {
                        name: 'resumegenerate',
                        size: 18,
                        type: 'ios-grid',
                        text: '简历生成',
                    },
                ],
            },
            {
                name: 'jobportray',
                size: 18,
                type: 'ios-paper',
                text: '人岗匹配',
            },
            {
                name: 'teachingAssistant',
                size: 18,
                type: 'ios-school',
                text: '辅助教学',
                hidden: true,
            },
        ],
        // 企业
        companyMenuItems: [
            {
                text: '能力体系',
                type: 'ios-paper',
                children: [
                    {
                        size: 18,
                        type: 'ios-grid',
                        name: 'labilitymanage',
                        text: '体系管理',
                    }],
            },
            {
                text: '知识体系',
                type: 'ios-paper',
                children: [
                    {
                        size: 18,
                        type: 'ios-grid',
                        name: 'knowmanage',
                        text: '体系管理',
                    }],
            },
            {
                name: 'knowledgeskill',
                size: 18,
                type: 'ios-paper',
                text: '能力知识匹配',
            },
            {
                name: 'radar',
                size: 18,
                type: 'ios-paper',
                text: '学生画像',
            },
            {
                name: 'jobportray',
                size: 18,
                type: 'ios-paper',
                text: '人岗匹配',
            },
            {
                name: 'resumegenerate',
                size: 18,
                type: 'ios-grid',
                text: '简历生成',
                hidden: true,
            },
            {
                name: 'teachingAssistant',
                size: 18,
                type: 'ios-school',
                text: '辅助教学',
                hidden: true,
            },
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
        setUserType(state, userType) {
            state.userType = userType
            // Set activeMenuItems based on userType
            if (userType === 0) {
                state.menuItems = state.adminMenuItems
            } else if (userType === 1) {
                state.menuItems = state.userMenuItems
            } else {
                state.menuItems = state.companyMenuItems
            }
        }
    },
    actions: {
        setUserType({ commit, state }, userType) {
            commit('setUserType', userType);
            // 根据 userType 设置 menuItems
            if (userType === 0) {
                commit('setMenus', state.adminMenuItems);
            } else if (userType === 1) {
                commit('setMenus', state.userMenuItems);
            } else {
                commit('setMenus', state.companyMenuItems);
            }
        },
        initialize({ dispatch }) {
            // 检查 localStorage 中是否有 userType
            const userType = localStorage.getItem('userType');
            if (userType !== null) {
                dispatch('setUserType', parseInt(userType, 10));
            }
        }
    },
})

export default store