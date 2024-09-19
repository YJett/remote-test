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

                //    hidden: true,

            },
            {
                text: '知识体系',
                type: 'ios-paper',
                children: [
                    {
                        type: 'md-home',
                        name: 'home',
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
                text: '学生数据',
                type: 'ios-paper',
                children: [
                    {
                        type: 'ios-grid',
                        name: 'studentdaoru',
                        text: '数据导入',
                        // hidden 属性 隐藏此菜单 可以通过在地址栏上输入对应的 URL 来显示页面
                        // hidden: true,
                    },
                    // {
                    //     size: 18, // icon大小
                    //     type: 'ios-grid', // icon类型
                    //     name: 'studentmatch',
                    //     text: '数据匹配',
                    //     // hidden 属性 隐藏此菜单 可以通过在地址栏上输入对应的 URL 来显示页面
                    //     // hidden: true,
                    // },
                    // {
                    //     type: 'ios-grid',
                    //     name: 'studentquery',
                    //     text: '数据查询',
                    //     // hidden 属性 隐藏此菜单 可以通过在地址栏上输入对应的 URL 来显示页面
                    //     // hidden: true,
                    // }
                ],
            },
            {
                name: 'knowledgeskill', // 要跳转的路由名称 不是路径
                size: 18, // icon大小
                type: 'ios-paper', // icon类型
                text: '能力知识匹配', // 点击侧边栏跳到一个单独的路由页面，需要提前在 router.js 定义
            },
            {
                name: 'radar', // 要跳转的路由名称 不是路径
                size: 18, // icon大小
                type: 'ios-paper', // icon类型
                text: '学生画像', // 点击侧边栏跳到一个单独的路由页面，需要提前在 router.js 定义
            },
            {
                name: 'jobportray', // 要跳转的路由名称 不是路径
                size: 18, // icon大小
                type: 'ios-paper', // icon类型
                text: '人岗匹配', // 点击侧边栏跳到一个单独的路由页面，需要提前在 router.js 定义
            },
        ],
        adminMenuItems: [
            {
                name: 'password', // 要跳转的路由名称 不是路径
                size: 18, // icon大小
                type: 'ios-grid', // icon类型
                text: '修改密码', // 点击侧边栏跳到一个单独的路由页面，需要提前在 router.js 定义

                //    hidden: true,

            },
            {
                name: 'user', // 要跳转的路由名称 不是路径
                size: 18, // icon大小
                type: 'ios-grid', // icon类型
                text: '用户信息', // 点击侧边栏跳到一个单独的路由页面，需要提前在 router.js 定义
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
                text: '知识体系',
                type: 'ios-paper',
                children: [
                    {
                        type: 'md-home',
                        name: 'home',
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
                text: '学生数据',
                type: 'ios-paper',
                children: [
                    {
                        type: 'ios-grid',
                        name: 'studentdaoru',
                        text: '数据导入',
                        // hidden 属性 隐藏此菜单 可以通过在地址栏上输入对应的 URL 来显示页面
                        // hidden: true,
                    }
                    // {
                    //     size: 18, // icon大小
                    //     type: 'ios-grid', // icon类型
                    //     name: 'studentmatch',
                    //     text: '数据匹配',
                    //     // hidden 属性 隐藏此菜单 可以通过在地址栏上输入对应的 URL 来显示页面
                    //     // hidden: true,
                    // },
                    // {
                    //     type: 'ios-grid',
                    //     name: 'studentquery',
                    //     text: '数据查询',
                    //     // hidden 属性 隐藏此菜单 可以通过在地址栏上输入对应的 URL 来显示页面
                    //     // hidden: true,
                ],
            },
            // {
            //     name: 'test1', // 要跳转的路由名称 不是路径
            //     size: 18, // icon大小
            //     type: 'ios-grid', // icon类型
            //     text: 'test1', // 点击侧边栏跳到一个单独的路由页面，需要提前在 router.js 定义
            // },
            // {
            //     name: 'test2', // 要跳转的路由名称 不是路径
            //     size: 18, // icon大小
            //     type: 'ios-grid', // icon类型
            //     text: 'test2', // 点击侧边栏跳到一个单独的路由页面，需要提前在 router.js 定义
            // },
            // {
            //     name: 'test3', // 要跳转的路由名称 不是路径
            //     size: 18, // icon大小
            //     type: 'ios-grid', // icon类型
            //     text: 'test3', // 点击侧边栏跳到一个单独的路由页面，需要提前在 router.js 定义
            // },
            // {
            //     name: 'graphmatch', // 要跳转的路由名称 不是路径
            //     size: 18, // icon大小
            //     type: 'ios-paper', // icon类型
            //     text: 'graphmatch（测试）', // 点击侧边栏跳到一个单独的路由页面，需要提前在 router.js 定义
            // },
            {
                name: 'knowledgeskill', // 要跳转的路由名称 不是路径
                size: 18, // icon大小
                type: 'ios-paper', // icon类型
                text: '能力知识匹配', // 点击侧边栏跳到一个单独的路由页面，需要提前在 router.js 定义
            },
            {
                name: 'radar', // 要跳转的路由名称 不是路径
                size: 18, // icon大小
                type: 'ios-paper', // icon类型
                text: '学生画像', // 点击侧边栏跳到一个单独的路由页面，需要提前在 router.js 定义
            },
            {
                name: 'jobportray', // 要跳转的路由名称 不是路径
                size: 18, // icon大小
                type: 'ios-paper', // icon类型
                text: '人岗匹配', // 点击侧边栏跳到一个单独的路由页面，需要提前在 router.js 定义
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
        userMenuItems:[
            {
                name: 'password', // 要跳转的路由名称 不是路径
                size: 18, // icon大小
                type: 'ios-grid', // icon类型
                text: '修改密码', // 点击侧边栏跳到一个单独的路由页面，需要提前在 router.js 定义

                //    hidden: true,

            },
            {
                text: '知识体系',
                type: 'ios-paper',
                children: [
                    {
                        type: 'md-home',
                        name: 'home',
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
                text: '学生数据',
                type: 'ios-paper',
                children: [
                    {
                        type: 'ios-grid',
                        name: 'studentdaoru',
                        text: '数据导入',
                        // hidden 属性 隐藏此菜单 可以通过在地址栏上输入对应的 URL 来显示页面
                        // hidden: true,
                    },
                    // {
                    //     size: 18, // icon大小
                    //     type: 'ios-grid', // icon类型
                    //     name: 'studentmatch',
                    //     text: '数据匹配',
                    //     // hidden 属性 隐藏此菜单 可以通过在地址栏上输入对应的 URL 来显示页面
                    //     // hidden: true,
                    // },
                    // {
                    //     type: 'ios-grid',
                    //     name: 'studentquery',
                    //     text: '数据查询',
                    //     // hidden 属性 隐藏此菜单 可以通过在地址栏上输入对应的 URL 来显示页面
                    //     // hidden: true,
                    // }
                ],
            },
            {
                name: 'knowledgeskill', // 要跳转的路由名称 不是路径
                size: 18, // icon大小
                type: 'ios-paper', // icon类型
                text: '能力知识匹配', // 点击侧边栏跳到一个单独的路由页面，需要提前在 router.js 定义
            },
            {
                name: 'jobportray', // 要跳转的路由名称 不是路径
                size: 18, // icon大小
                type: 'ios-paper', // icon类型
                text: '人岗匹配', // 点击侧边栏跳到一个单独的路由页面，需要提前在 router.js 定义
            },
        ],
        companyMenuItems: [

            {
                name: 'user', // 要跳转的路由名称 不是路径
                size: 18, // icon大小
                type: 'ios-grid', // icon类型
                text: '用户信息', // 点击侧边栏跳到一个单独的路由页面，需要提前在 router.js 定义
            },

            {
                text: '能力体系',
                type: 'ios-paper',
                children: [
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
                name: 'radar', // 要跳转的路由名称 不是路径
                size: 18, // icon大小
                type: 'ios-paper', // icon类型
                text: '学生画像', // 点击侧边栏跳到一个单独的路由页面，需要提前在 router.js 定义
            },
            {
                name: 'jobportray', // 要跳转的路由名称 不是路径
                size: 18, // icon大小
                type: 'ios-paper', // icon类型
                text: '人岗匹配', // 点击侧边栏跳到一个单独的路由页面，需要提前在 router.js 定义
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
        setUserType(state, userType) {
            state.userType = userType
            // Set activeMenuItems based on userType
            if (userType === 0) {
                state.menuItems = state.adminMenuItems
            } else if(userType===1){
                state.menuItems = state.userMenuItems
            }else{
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
            } else if(userType===1) {
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



