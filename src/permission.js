import { LoadingBar } from 'view-design'
import createRoutes from '@/utils/createRoutes'
import router, { asyncRoutes } from './router'
import store from './store'
import { getDocumentTitle, resetTokenAndClearUser } from './utils'

// 是否有菜单数据
let hasMenus = false
router.beforeEach(async (to, from, next) => {
    document.title = getDocumentTitle(to.meta.title)
    LoadingBar.start()
    if (localStorage.getItem('token')) {
        if (to.path === '/login') {
            next({ path: '/' })
        } else if (hasMenus) {
            next()
        } else {
            try {
                // 这里可以用 await 配合请求后台数据来生成路由
                // const data = await axios.get('xxx')
                // const routes = createRoutes(data)
                let menuItems = store.state.menuItems
                const routes = createRoutes(menuItems)
                // 动态添加路由
                router.addRoutes(routes)
                hasMenus = true
                if (to.path === '/') {
                    const firstRoute = findFirstAvailableRoute(menuItems)
                    if (firstRoute) {
                        next({ path: firstRoute, replace: true })
                    } else {
                        next('/404')
                    }
                } else {
                    next({ ...to, replace: true })
                }
            } catch (error) {
                resetTokenAndClearUser()
                next(`/login?redirect=${to.path}`)
            }
        }
    } else {
        hasMenus = false
        if (to.path === '/login') {
            next()
        } else {
            next(`/login?redirect=${to.path}`)
        }
    }
})

router.afterEach(() => {
    LoadingBar.finish()
})

function findFirstAvailableRoute(items) {
    for (const item of items) {
        if (item.hidden) {
            continue
        }
        if (item.name && asyncRoutes[item.name]) {
            return asyncRoutes[item.name].path
        }
        if (item.children) {
            const childRoute = findFirstAvailableRoute(item.children)
            if (childRoute) {
                return childRoute
            }
        }
    }
    return null
}
