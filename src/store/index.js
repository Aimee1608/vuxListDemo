import Vue from 'vue'
import Vuex from 'vuex'
// import * as getters from './getters.js'

Vue.use(Vuex)

/** 状态定义 */
export const state = {
  // linkList:[//展示列表
  //     'Home',
  //     'NewCase',
  //     'Recommend',
  //     'User'
  // ],
  money_id:sessionStorage.getItem('money_id')==undefined?0:parseInt(sessionStorage.getItem('money_id')),//推广金额存储
  // host:"http://www.markets.com/index.php/port",
  host:"http://flow.xingyuanauto.com/FlowProject/MarketingTest/public/index.php/port/",
  // host:"http://"+window.location.host+"/port/"//接口路径
}

export default new Vuex.Store({
    state,
})
