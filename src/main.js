import Vue from 'vue'
import App from './App.vue'
import WebCommon from './WebCommon.vue'
import './registerServiceWorker'
import router from './router'
import vuetify from './plugins/vuetify';
import 'roboto-fontface/css/roboto/roboto-fontface.css'
import '@mdi/font/css/materialdesignicons.css'
import Vuex from 'vuex'
import VueQrcode from '@chenfengyuan/vue-qrcode';

Vue.config.productionTip = false
import VImageInput from 'vuetify-image-input/a-la-carte';
import VueClipboard from 'vue-clipboard2'
import _ from 'lodash';
Vue.prototype._ = _;
Vue.component("v-image-input", VImageInput);
Vue.component(VueQrcode.name, VueQrcode);
VueClipboard.config.autoSetContainer = true
Vue.use(VueClipboard)
Vue.use(Vuex)


Vue.prototype.$version = "0.1.0"
Vue.prototype.$WebCommon = WebCommon

const store = new Vuex.Store({
  state: {
    config: {
      isLogin: false,
    },
    //B站登录的缓存
    WebCommonCache: {
      sid: "",
      cookies: {}
    },
    logList: [],
    snackbar: {
      text: "(/=-=)/",
      show: false,
    },
  },
  mutations: {
    addLog(state, content) {
      state.logList.unshift({
        logTime: Date.now(),
        logContent: content,
      })
    }
  }
})


new Vue({
  store: store,
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app')
