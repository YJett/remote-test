import Vue from 'vue'
import mavonEditor from 'mavon-editor'
import axios from 'axios'
import ViewUI from 'view-design'
import App from './App'
import store from './store'
import router from './router'
import 'view-design/dist/styles/iview.css'
import './permission'
import 'mavon-editor/dist/css/index.css'


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
