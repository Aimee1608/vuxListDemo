import Vue from 'vue'
import Vuex from 'vuex'
import VueRouter from 'vue-router'
import VueResource from 'vue-resource'
import store from "./store/index.js"
import './css/style.css'
import routes from './router/routes.js'

Vue.use(Vuex)
Vue.use(VueRouter)
Vue.use(VueResource)



const router = new VueRouter({
   // mode: 'history',
    routes
})

/** 验证用户是否登录 **/
router.beforeEach((to,from,next) => {
    if(to.matched.some( m => m.meta.auth)) {
        // console.log("先判断是否登录");
        if(to.name=='Login'){
            next();
        }else{
          if(localStorage.getItem('token')){
            Vue.http.get("http://flow.xingyuanauto.com/FlowProject/MarketingTest/public/index.php/port/Login/UserIsLogin?token="+localStorage.getItem('token')+"&url="+to.name,{withCredentials: true}).then(response => response.json()).then(num => {
                    // console.log('是否登录',num);
                    if(num.code==1001){
                        next();
                    }else{
                        alert('您的token已超时，请重新登录');
                        next('/Login');
                    }
            })
          }else{
            next('/Login');
          }

        }
  　} else {
        console.log("请先登录");
        next()
    }
})

var vm = new Vue({
  el: '#app',
  router,
  store
})
