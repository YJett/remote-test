import Vue from 'vue'
import mavonEditor from 'mavon-editor'
import axios from 'axios'
import ViewUI from 'view-design'
import moment from 'moment'
import App from './App'
import store from './store'
import router from './router'
import 'view-design/dist/styles/iview.css'
import './permission'
import 'mavon-editor/dist/css/index.css'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

Vue.prototype.$moment = moment
Vue.use(ElementUI)

moment.locale('zh-cn') // 这里是进行了汉化 不写这句默认格式是外国的

Vue.config.productionTip = false
Vue.use(ViewUI)
Vue.use(mavonEditor)

Vue.prototype.$axios = axios

new Vue({
    el: '#app',
    router,
    store,
    render: h => h(App),
})
