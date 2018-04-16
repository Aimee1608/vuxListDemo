<!-- 用户中心 -->
<template>
    <!-- <div  style="height:100%;background:#fff;"> -->
        <view-box ref="viewBox">
            <div class="UserBox">
                <div class="headInfo" style="background-image:url(src/img/userbg.png)">
                    <img :src="userInfo.sex==0?'src/img/case.png':(userInfo.sex==1?'src/img/hboy.png':'src/img/hgirl.png')" onerror="this.src='src/img/case.png'" alt="">

                    <h1>
                        <p>{{userInfo.name}}</p>
                        <p>{{userInfo.phone}}</p>
                    </h1>
                </div>
                <div class="hasSave">
                      <h1><i class="fa fa-fw fa-star"></i>已收藏</h1>
                      <!-- 下拉刷新页面 -->
                      <scroller  lock-x class="scrollerSelf" height="300px"   use-pulldown use-pullup   v-model="status" :pullup-config="pullupDefault"   :pulldown-config="pulldownDefault" @on-pullup-loading="onPullupLoading"  @on-pulldown-loading="onPulldownLoading" ref="scroller" >
                            <div class="scrollBoxContent">
                                  <flexbox class="saveflexbox" :gutter="margin" wrap="wrap">
                                       <flexbox-item class="flexItem" :span="1/2" v-for="item in collectList" :key="item.id" >
                                          <a :href="'#/Detail?id='+item.pro_id">
                                              <img :src="item.img_url?item.img_url:'src/img/case02.jpg'" onerror="this.src='src/img/case02.jpg'" alt="">
                                              <p>{{item.pro_name}}</p>
                                          </a>
                                          <i @click="CancelSaveFun(item.pro_id)" class="fa fa-fw fa-trash-o"></i>
                                       </flexbox-item>
                                  </flexbox>
                                  <!-- <div class="morecontent" @click="addmoreFun">{{morecontent}}</div> -->
                                  <p v-show="noMore" style="text-align:center;line-height:3;">没有更多数据</p>
                            </div>
                      </scroller>
                </div>
                <div class="logout" @click="LogoutFun">
                    退出登录
                </div>
                <!-- 显示隐藏 -->
                <toast v-model="toastShow" type="text" :time="1000" position="middle">{{toastText}}</toast>
                <toast v-model="toastLogout" :time="1000" :type="logoutType">{{toastLogoutText}}</toast>
            </div>
            <wbc-footer></wbc-footer>
        </view-box>
    <!-- </div> -->
</template>

<script>
import footer from '../publicTem/footer.vue'
import {Scroller ,LoadMore, ViewBox,Flexbox, FlexboxItem,Toast } from 'vux'
import {UserCollectList,Collection,UserInformation,LoginOut,wxShare,ProgammeShareNum} from '../../pubJS/server.js'
    export default {
        name:'User',
        data() { //选项 / 数据
            return {
              pageId:0,
              collectList:[],
              toastShow:false,
              toastText:'',
              margin:0,
              userInfo:'',
              toastLogout:false,
              toastLogoutText:'',
              logoutType:'success',
              // morecontent:'',
                noMore:false,
              //下拉刷新页面
              onFetchingDown:false,//是否正在滚动
              status:{//上拉下拉加载的状态储存
                   pullupStatus:'default',//上拉加载更多
                   pulldownStatus:'default',//下拉刷新页面
              },
              pulldownDefault:{//下拉刷新组件配置
                    content: '下拉刷新',
                    // height: 40,
                    autoRefresh: false,
                    downContent: '下拉刷新',
                    upContent: '下拉刷新',
                    loadingContent: '加载中...',
                    clsPrefix: 'xs-plugin-pulldown-'
              },
              pullupDefault:{//上拉加载组件配置
                    content: '上拉加载更多',
                    pullUpHeight: 70,
                    height: 50,
                    autoRefresh: false,
                    downContent: '上拉加载更多',
                    upContent: '上拉加载更多',
                    loadingContent: '加载中...',
                    clsPrefix: 'xs-plugin-pullup-'
              },
            }
        },
        methods: { //事件处理器
            LogoutFun(){//退出登录
              var that = this;
                LoginOut(that.token,function(result){
                    // console.log('退出登录',result);
                    if(result.code==1001){
                        localStorage.clear();
                        that.logoutType = 'success';
                        that.toastLogoutText="退出登录成功";
                        that.toastLogout=true;
                        var timer = setTimeout(function(){
                              that.$router.push({path:"/Login"});
                              clearTimeout(timer);
                              timer = null;
                        },1000);
                    }else{
                      that.logoutType = 'cancel';
                        that.toastLogoutText="退出登录失败";
                        that.toastLogout=true;
                    }
                })

            },
            //下拉刷新页面
            onPulldownLoading(initPage){//下拉刷新页面
                var that = this;
                // var e = e||e.event；
                // e.prevebtDefault();
                console.log("下下下下下下下下下下",this.onFetchingDown,this.status.pullupStatus);
                if (!that.onFetchingDown) {
                  if(initPage){
                      that.pageId = 0;
                      that.collectList = [];
                      //重新设置位置
                       that.$nextTick(() => {
                        that.$refs.scroller.reset({top: -46});
                      });
                  }
                    that.onFetchingDown = true;
                    var timer = setTimeout(() => {
                      //启用上拉刷新
                      // that.$refs.scroller.enablePullup();
                      //页面数据清空，重新加载数据
                      that.getListFun(true);
                      that.$nextTick(() => {
                        that.$refs.scroller.reset({top:-10});
                      })
                      that.onFetchingDown = false;
                      clearTimeout(timer);
                      timer = null;
                   }, 1000)
                  // do nothing
                } else {
                    // console.log('222222222',that.bottomCount);
                }
            },
            onPullupLoading(){//上拉加载更多
                var that = this;
                // console.log("上上上上上上上上上",this.status.pullupStatus);
                if (this.status.pullupStatus) {
                    var timer = setTimeout(() => {
                          that.getListFun(false);
                          that.status.pullupStatus = 'default';
                          clearTimeout(timer);
                          timer = null;
                    }, 500)
                  // do nothing
                } else {
                    console.log("滚滚滚");
                }
            },
            // addmoreFun(){
            //   var that = this;
            //   if(that.morecontent == "没有更多数据"){
            //     return
            //   }
            //   that.getListFun(false);
            // },
            getListFun(initPage){
              var that = this;
              if(initPage){
                  that.pageId = 0;
                  that.collectList = [];

              }
              UserCollectList(that.token,that.pageId,function(result){
                // console.log('收藏列表',result);
                // console.log('PPPPPPP',that.pageId);

                if(result.code == 1001){
                      that.collectList = that.collectList.concat(result.data);
                      that.pageId = result.data[result.data.length-1].id;
                      if(result.data.length<4){
                        that.noMore = true;
                        //禁止执行上拉加载事件
                        that.$refs.scroller.disablePullup();
                          // that.morecontent = "没有更多数据";
                      }else{
                        //  that.morecontent = "点击加载更多";
                        that.noMore = false;
                        that.$refs.scroller.enablePullup();
                      }
                }else if(result.code == 1005){
                      // that.morecontent = "没有更多数据";
                      that.noMore = true;
                      that.$refs.scroller.disablePullup();
                }else{
                    alert('获取分类失败');
                    that.noMore = false;
                    that.$refs.scroller.enablePullup();
                }
              })


            },
            CancelSaveFun(id){//取消收藏
                // console.log('取消收藏');
                // var oEvent = event;
                // oEvent.cancelBubble = true;
                // oEvent.stopPropagation();
                var that = this;
                Collection(that.token,id,function(result){
                  if(result.code==1001){
                      // console.log('收藏取消收藏',result);
                       that.getListFun(true);

                        // that.toastText = '取消收藏';
                        that.toastShow = true;
                  }else{
                    alert('修改失败')
                  }

                })
            },
        },
        components: { //定义组件
            'wbc-footer':footer,
             ViewBox,
             Flexbox,
             FlexboxItem,
             Toast,//提示
             Scroller,
             LoadMore,
        },
        created() { //生命周期函数
          var that = this;
          if(localStorage.getItem('token')){
            // console.log(localStorage.getItem('token'),99999);
            that.token = localStorage.getItem('token');
            that.getListFun(true);
            UserInformation(that.token,function(result){
              if(result.code==1001){
                // console.log('用户信息',result);
                that.userInfo =result.data;
              }
            })
          }
          wxShare({
              title: '泉水系统', // 分享标题
              desc: '泉水系统啦啦啦', // 分享描述
              link: window.location.href, // 分享链接
              // imgUrl: 'src/img/share.png', // 分享图标
            //   debug:true
          },function(){//分享成功后的回调函数
            // ProgammeShareNum('',that.$router.name,function(result){
            //   console.log(result);
            //   // alert('分享code'+result.code);
            // })
          });
        },
        //下拉刷新页面
        mounted () {
           // this.$nextTick(() => {
           //   this.$refs.scroller.reset({top: -46})
           // })
         },
    }
</script>

<style>
.UserBox {
    width: 100%;
    height:100%;
    box-sizing: border-box;
    background: #fff;
    padding-top: 6.667vw;
    padding-bottom:12vw;
    position: absolute;
    top:0;
    overflow: auto;
}
/**下拉刷新页面**/
.UserBox .scrollBoxContent{
    width:100%;
    height:auto;
    /*margin-top:2vw;*/
    position: relative;
    /*background: pink;*/
    overflow-x: hidden;
    overflow-y: scroll;
    /*overflow-y: hidden;*/
    /*overflow: auto;*/
    box-sizing: border-box;

}
.UserBox .scrollerSelf{
  overflow-x: hidden;
  overflow-y: scroll;
  /*overflow-y: hidden;*/
  /*height: 65vw;*/
  /* background: pink; */
}



/*******原始内容部分******/
.UserBox .headInfo{
    width:89.33vw;
    height:32vw;
    background-size: 100% 100%;
    margin:0 auto;
    position: relative;
    border-radius: 7px;
    box-shadow: 0 10px 30px rgba(50,108,198,.5);
}
.UserBox .headInfo img{
    width:16vw;
    height:16vw;
    position: absolute;
    left:9vw;
    top:8vw;
    border-radius: 50%;
    object-fit: cover;
    background: #fff;
    /*vertical-align: middle;*/
}
.UserBox .headInfo h1{
    position: absolute;
    left:32vw;
    top:8vw;
    color:#fff;
    font-size: 15px;
    line-height: 1.8;


}
.UserBox .morecontent{
  text-align: center ;
}

.UserBox .hasSave{
    width:89vw;
    min-height: 50vh;
    margin:6.68vw auto;
    height:auto;
    /*border: 1px solid gray;*/
    overflow-x: hidden;
}
.UserBox .hasSave h1 {
    margin-bottom: 2vw;
    font-size: 15px;
}
.UserBox .hasSave h1 i{
    color:#377be2;
}
.UserBox .hasSave .saveflexbox  .flexItem:nth-child(odd){
    padding-right:2vw;
    box-sizing: border-box;
}
.UserBox .hasSave .saveflexbox  .flexItem:nth-child(even){
    padding-left:2vw;
    box-sizing: border-box;
}
.UserBox .hasSave .saveflexbox  .flexItem{
    margin-bottom: 4vw;
    position: relative;
}
.UserBox .hasSave .saveflexbox  .flexItem img{
    width:100%;
    height:20vw;
    border-radius: 4px;
    object-fit: cover;
}
.UserBox .hasSave .saveflexbox  .flexItem  p{
    text-align: center;
    padding: 2vw 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.UserBox .hasSave .saveflexbox  .flexItem  i{
    width:8.5vw;
    height:8.5vw;
    line-height: 8.5vw;
    border-radius: 50%;
    color:#fff;
    font-size: 5vw;
    display: block;
    position: absolute;

    top:10vw;
    background: #377be2;
    text-align: center;

}
.UserBox .hasSave .saveflexbox  .flexItem:nth-child(even)   i{
    right:2vw;
}
.UserBox .hasSave .saveflexbox  .flexItem:nth-child(odd)   i{
    right:4vw;
}
/****退出登录****/
.UserBox .logout{
    width:89vw;
    height:10.8vw;
    line-height: 10.8vw;
    background: #377be2;
    border-radius: 5px;
    margin:0 auto;
    text-align: center;
    font-size: 16px;
    color:#fff;
    margin-bottom:4vw;
    box-shadow: 0 8px 15px rgba(50,108,198,.3);
}

</style>
