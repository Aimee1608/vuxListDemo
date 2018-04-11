const routes =[
    {
        path:'/',
        component: resolve => require(['../components/mainTem/Filtrate.vue'],resolve),
        meta:{auth:true,keepAlive: false},
        name:'Filtrate'
    },//首页
    {
        path:'/Home',
        component: resolve => require(['../components/mainTem/Home.vue'],resolve),
        meta:{auth:true,keepAlive: true },
        name:'Home'
    },//登录
    {
        path:'/Login',
        component: resolve => require(['../components/mainTem/Login.vue'],resolve),
        meta:{auth:true,keepAlive: false},
        name:'Login'
    },//最新案例
    {
        path:'/NewCase',
        component: resolve => require(['../components/mainTem/NewCase.vue'],resolve),
        meta:{auth:true,keepAlive: true},
        name:'NewCase'
    },//推荐
    {
        path:'/Recommend',
        component: resolve => require(['../components/mainTem/Recommend.vue'],resolve),
        meta:{auth:true,keepAlive: true},
        name:'Recommend'
    },//个人中心
    {
        path:'/User',
        component: resolve => require(['../components/mainTem/User.vue'],resolve),
        meta:{auth:true,keepAlive: true},
        name:'User'
    },//筛选
    {
        path:'/Filtrate',
        component: resolve => require(['../components/mainTem/Filtrate.vue'],resolve),
        meta:{auth:true,keepAlive: false},
        name:'Filtrate'
    },
    {//详情
        path:'/Detail',
        component: resolve => require(['../components/mainTem/Detail.vue'],resolve),
        meta:{auth:true,keepAlive: false},
        name:'Detail'
    }
]

export default routes
