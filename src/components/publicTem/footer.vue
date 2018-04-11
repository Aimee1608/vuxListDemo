<template>
    <tabbar  class="footerBox"   >
      <tabbar-item :selected="$route.name == 'Home'" :link="{path:'/Home'}" >
        <i slot="icon" class="fa fa-fw fa-home"></i>
        <span slot="label">首页</span>
      </tabbar-item>
      <tabbar-item :selected="$route.name == 'NewCase'" :link="{path:'/NewCase'}">
          <i slot="icon" class="fa fa-fw fa-bookmark-o"></i>
          <i slot="icon-active" class="fa fa-fw fa-bookmark"></i>
        <span slot="label">最新案例</span>
      </tabbar-item>
      <tabbar-item  :selected="$route.name == 'Recommend'" :link="{path:'/Recommend'}">
          <i slot="icon" class="fa fa-fw fa-thumbs-o-up"></i>
          <i slot="icon-active" class="fa fa-fw fa-thumbs-up"></i>
        <span slot="label">推荐</span>
      </tabbar-item>
      <tabbar-item  :selected="$route.name == 'User'" :link="{path:'/User'}">
          <i slot="icon" class="fa fa-fw fa-user-o"></i>
          <i slot="icon-active" class="fa fa-fw fa-user"></i>
        <span slot="label">个人中心</span>
      </tabbar-item>
    </tabbar>
</template>

<script>
import { Tabbar, TabbarItem} from 'vux'

export default {
        data() { //选项 / 数据
            return {
                index:localStorage.getItem('tabIndex')?parseInt(localStorage.getItem('tabIndex')):0,//当前展示的tabbar-item
                query:'',
                linkList:[//展示列表
                    'Home',
                    'NewCase',
                    'Recommend',
                    'User'
                ]
            }
        },
        methods:{
        },
          components: {
            Tabbar,
            TabbarItem
        },
        create(){

        }
}
</script>
<style>
.footerBox{
    /*position: fixed;*/
}
.footerBox .weui-tabbar__item.weui-bar__item_on .weui-tabbar__icon,.footerBox  .weui-tabbar__item.weui-bar__item_on .weui-tabbar__icon > i,.footerBox  .weui-tabbar__item.weui-bar__item_on .weui-tabbar__label{
    color:#377be2;
}

</style>
