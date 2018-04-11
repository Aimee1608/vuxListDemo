<template>
  <div class="">
      <div class="headerBox">
          <div class="filtrateBack" v-if="this.$route.path=='/Home'" @click="GoFiltrate">
              <i class="left"></i><span>筛选</span>
          </div>
          <div class="marketBox" :class="category_id?'active':''" @click="showContent = !showContent">
              <input v-model="Flabel01" type="text" disabled/><i :class="showContent ? 'up' : 'down'"></i>
          </div>
          <ul class="slide"  :class="showContent?'animate':''" >
              <li  :class="category_id==0?'active':''" @click="SelectFun(0,'营销类别',0)">营销类别</li>
              <li v-for="item in listObj01" :key="item.id" :class="category_id==item.id?'active':''" @click="SelectFun(0,item.name,item.id)">
                {{item.name}}
              </li>
          </ul>
          <div class="marketBox" :class="content_id?'active':''" @click="showContent02 = !showContent02">
              <input v-model="Flabel02" type="text" disabled/><i :class="showContent02 ? 'up' : 'down'"></i>
          </div>
          <ul class="slide"  :class="showContent02?'animate':''" >
              <li  :class="content_id==0?'active':''"  @click="SelectFun(1,'方案内容',0)">方案内容</li>
              <li v-for="item in listObj02" :key="item.id" :class="content_id==item.id?'active':''" @click="SelectFun(1,item.name,item.id)">
                  {{item.name}}
              </li>
          </ul>
          <div class="searchIcon" @click="showSearch=!showSearch">
              <i class="fa fa-fw fa-search"></i><span>搜索</span>
          </div>
          <div class="searchBox" v-show="showSearch">
              <group class="inputBox"  gutter="0">
                  <x-input  type="text" placeholder="请输入关键词" v-model="pro_name" :min="1"  @on-change="change" @on-enter="onEnter"></x-input>
              </group>
              <span @click="CancelSearch">取消</span>
          </div>
      </div>
    <scroller v-model="status" lock-x height="-46" use-pulldown use-pullup @on-pullup-loading="onPullupLoading" :pulldown-config="pulldownDefault" :pullup-config="pullupDefault"  @on-pulldown-loading="onPulldownLoading" ref="scroller" >
             <div class="CaseListBox listContainer">
                 <ul>
                     <li class="caseItem" v-for="(item,index) in articleObj" :key="index" >
                        <a :href="'#/Detail?id='+item.id">
                             <div class="grade">
                                 <img src="src/img/grade.png" alt="">
                                 <span>{{item.average_number}}</span>
                             </div>
                              <img  :src="item.img_url?item.img_url:'src/img/case.png'" onerror="this.src='src/img/case.png'" class="prImg">
                          </a>
                          <div slot="content" class="card-padding">
                            <p v-show="item.is_long==1" class="leftTitle" >{{item.describe.length>27?item.describe.slice(0,27)+'...':item.describe}}<span v-if="item.describe.length>27" @click="shouFun(index)">展开<i class="fa fa-fw fa-angle-down"></i></span></p>
                            <p class="leftInner"  v-show="item.is_long!=1">
                              {{item.describe}}
                            </p>
                            <em></em>
                            <h2 v-show="item.is_long!=1" @click="shouFun(index)">收起<i class="fa fa-fw fa-angle-up"></i></h2>
                            <div class="case-save" @click="StarFun(item.id,index)">
                                <p v-show="item.is_collect==0">
                                    <i class="fa fa-fw fa-star-o"></i>
                                    <span>收藏</span>
                                </p>
                                <p v-show="item.is_collect!=0" class="active">
                                    <i class="fa fa-fw fa-star"></i>
                                    <span>取消收藏</span>
                                </p>
                            </div>
                          </div>
                     </li>
                 </ul>
                 <p v-show="noMore" style="text-align:center;line-height:3;">没有更多数据</p>
             </div>
       </scroller>
       <toast v-model="toastShow" type="text" :time="1000"  position="default">{{toastText}}</toast>
  </div>
</template>

<script>
import {Scroller ,LoadMore,Toast,XInput,Group} from 'vux'
import {ProListData,Collection,EventProList,getLabel,wxShare} from '../../pubJS/server.js'
    export default {
        data() { //选项 / 数据
            return {
                onFetching: false,//是否正在滚动
                onFetchingDown:false,
                showMore:false,//是否展示更多
                articleObj:[],//案例列表
                status:{//上拉下拉加载的状态储存
                     pullupStatus:'default',
                     pulldownStatus:'default'
                },
                pulldownDefault:{//下拉刷新组件配置
                      content: '下拉刷新',
                      height: 40,
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
                pageId:0,//当前第几页
                money_id:this.$store.state.money_id,//推广金额
                category_id:null,//营销类别
                content_id:null,//方案内容
                pro_name:null,//关键字查询
                noMore:false,//没有更多数据
                toastText:'',//显示提示的内容
                toastShow:false,//是否显示小提示
                showContent: false,//下拉列表展示01
                showContent02:false,//下拉列表展示01
                listObj01: [],//营销类别
                listObj02:[],//方案内容
                Flabel01:'营销类别',//head展示营销类别内容
                category_id:0,//已选择的营销类别内容ID
                Flabel02:'方案内容',//head展示方案内容
                content_id:0,//已选择的方案内容ID
                showSearch:false,//是否展示搜索框
            }
        },
        methods: { //事件处理器
            StarFun(id,index){//列表事件
                var that = this;
                Collection(that.token,id,function(result){
                  if(result.code==1001){
                    // console.log('收藏取消收藏',that.articleObj[index].is_collect,result);
                    that.articleObj[index].is_collect = that.articleObj[index].is_collect == 0?1:0;
                    // console.log(that.articleObj[index].is_collect)
                    if(that.articleObj[index].is_collect==1){
                      that.toastText="收藏成功";
                    }else{
                      that.toastText="已取消收藏";
                    }
                    that.toastShow = true;
                  }else{
                    alert('修改失败')
                  }
                })
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
            onPulldownLoading(){//下拉刷新页面
                var that = this;
                // console.log("下下下下下下下下下下",this.onFetchingDown,this.status.pullupStatus);
                if (!that.onFetchingDown) {
                    that.onFetchingDown = true;
                    var timer = setTimeout(() => {
                      //启用上拉刷新
                      that.$refs.scroller.enablePullup();
                      //页面数据清空，重新加载数据
                      that.getListFun(true);
                    //   that.$nextTick(() => {
                    //     // that.$refs.scroller.reset({top: -46});
                    //   })
                      that.onFetchingDown = false;
                      clearTimeout(timer);
                      timer = null;
                   }, 1000)
                  // do nothing
                } else {
                    // console.log('222222222',that.bottomCount);
                }
            },
            getListFun(initPage){
              var that = this;
              //判断接口参数中是首页，最新案例，推荐
              // console.log(that.$route);
              that.money_id=that.$store.state.money_id;
              that.new_start = that.$route.name =='NewCase'?1:0;
              that.recommend_start = that.$route.name =='Recommend'?1:0;
            //   console.log('查询条件',that.money_id, that.category_id,that.content_id,that.pro_name);
              //初始化时，加载更多
              if(initPage){
                that.pageId = 0;
                 that.articleObj = [];
                //重新设置位置
                 that.$nextTick(() => {
                  that.$refs.scroller.reset({top: -46});
                })
              }
                //二级分类列表
                ProListData(that.token,that.pageId,that.money_id,that.category_id,that.content_id,that.pro_name,that.new_start,that.recommend_start,function(result){
                //   console.log('列表'+that.$route.name+'..............',result);
                  if(result.code==1001){
                    //获取列表追加
                    that.articleObj = that.articleObj.concat(result.data);
                    that.pageId = result.data[result.data.length-1].id;
                    //判断数据库里是否还有更多数据
                      if(result.data.length<10){
                          that.noMore = true;
                          //禁止执行上拉加载事件
                          that.$refs.scroller.disablePullup();
                      }else{
                           that.noMore = false;
                           that.$refs.scroller.enablePullup();
                      }
                  }else if(result.code==1005){//没有数据
                    // console.log('无数据');
                    that.noMore = true;
                    that.$refs.scroller.disablePullup();
                  }else{
                    alert('获取列表失败');
                    that.noMore = false;
                    that.$refs.scroller.enablePullup();
                  }
                })
            },
            GoFiltrate(){//重新筛选推广金额
                // this.$store.state.money_id=0;
               sessionStorage.clear();
               sessionStorage.setItem('token',this.token);
               this.$router.push({path:'/Filtrate'});
            },
             SelectFun(type,label,value){//下拉选择分类
                  console.log(type,label,value);
                  if(type==0){//营销方案
                      this.Flabel01 = label;
                      this.category_id = value;
                      this.showContent = false;
                  }else{//方案内容
                      this.Flabel02 = label;
                      this.content_id = value;
                      this.showContent02 = false;
                  }
                  this.getListFun(true);
              },
              CancelSearch(){//关闭搜索按钮
                  this.showSearch =!this.showSearch;
                  this.pro_name = '';
                  this.getListFun(true);
              },
              change (val) {//关键字输入改变时
                // console.log('on change', val)
                //清除关键字时，重新筛选
                if(val==''){
                    this.getListFun(true);
                }
              },
              onEnter(val,e){//按下ENTER键时，查询数据
                if(val){
                    this.getListFun(true);
                }
              },
              moneyChange(){//金额改变重新加载数据
                  this.category_id = 0;
                  this.content_id = 0;
                   this.Flabel01 = "营销方案";
                   this.Flabel02 = "方案内容";
                   this.showContent = false;
                   this.showContent02 = false;
                   this.getListFun(true);
              },
              shouFun(index){
                  this.articleObj[index].is_long = this.articleObj[index].is_long == 0?1:0;
              }
        },
        components: { //定义组件
            Scroller,
            LoadMore,
            Toast,
            XInput,
            Group
        },
        watch: {
           // 如果路由有变化，会再次执行该方法
        //    '$route':'routeChange',
            '$store.state.money_id':'moneyChange'//监听全局状态判断money_id  是否有变化
         },
        created() { //生命周期函数
             var that = this;
              if(sessionStorage.getItem('token')){
                  this.token = sessionStorage.getItem('token');
                  getLabel(sessionStorage.getItem('token'),2,function(result){
                    if(result.code == 1001){
                        that.listObj01 = result.data[0].data;
                        that.listObj02 = result.data[1].data;
                        that.getListFun(true);
                        // console.log('、二级分类',result);
                    }else{
                      alert('获取分类失败');
                    }
                  })

              }
              wxShare({
                  title: '泉水系统', // 分享标题
                  desc: '泉水系统啦啦啦', // 分享描述
                  link: window.location.href, // 分享链接
                  imgUrl: 'src/img/share.png', // 分享图标
                //   debug:true
              },function(){//分享成功后的回调函数

              });
        },
        mounted () {
           this.$nextTick(() => {
             this.$refs.scroller.reset({top: -46})
           })
         },
    }
</script>

<style>
.CaseListBox .caseItem{
    width:100%;
    height:auto;
    margin-top:3.2vw;
    position: relative;
    background: #fff;
}
.CaseListBox .caseItem .prImg{
    width:100%;
    display: block;
    height:40vw;
    object-fit: cover;
}
.CaseListBox .card-padding::after{
    content: '';
    display: block;
    clear:both;
}
.CaseListBox .leftTitle{
    width:79vw;
    font-size: 14px;
    float:left;
    padding:0 4.8vw;
    margin:2.5vw 0 4vw 0;
    box-sizing: border-box;
    word-break: break-all;
    text-overflow: ellipsis;
    display: -webkit-box; /** 对象作为伸缩盒子模型显示 **/
    -webkit-box-orient: vertical; /** 设置或检索伸缩盒对象的子元素的排列方式 **/
    -webkit-line-clamp: 2; /** 显示的行数 **/
    overflow: hidden;  /** 隐藏超出的内容 **/
    position: relative;
}
.CaseListBox .leftTitle span{
    position: absolute;
    right:4.8vw;
    bottom:0;
    color:#818181;
    font-size: 13px;
}

.CaseListBox  em{
    width:1px;
    height:10vw;
    display: block;
    margin:2.5vw 0 4vw 0;
    background: #ebebeb;
    float:left;
}
.CaseListBox .leftInner{
    width:79vw;
    font-size: 14px;
    float:left;
    padding:0 4.8vw;
    margin:2.5vw 0 4vw 0;
    box-sizing: border-box;
}
.CaseListBox h2{
    position: absolute;
    right:1vw;
    bottom:4vw;
    width:20vw;
    text-align: center;
    color:#818181;
    font-size: 13px;
}
.CaseListBox .case-save{
    width:20vw;
    text-align: center;
    float:right;
    margin:2.5vw 0 4vw 0;
}
.CaseListBox .case-save .active .fa{
    color:#377be2;
}
.CaseListBox .case-save span{
    display: block;
    text-align: center;
}

.CaseListBox .grade{
    width:10.13vw;
    height:11.73vw;
    position: absolute;
    top:-1.067vw;
    right:6.6667vw;
}
.CaseListBox .grade img{
    width:100%;
    height:100%;
}
.CaseListBox .grade span{
    width:100%;
    height:100%;
    font-size: 19px;
    font-style: italic;
    color:#fff;
    position: absolute;
    left:0;
    top:2.5vw;
    text-align: center;
}



.headerBox{
    width:100%;
    position: absolute;
    left:0;
    top:0;
    background: #fff;
    height:46px;
    z-index: 100;
    font-size: 14px;
}

.headerBox .slide {
 width: 100%;
 box-sizing: border-box;
 position: absolute;
 left:0;
 top:45px;
 padding: 0 20px;
 background: #F5F5F5;
 overflow: hidden;
 max-height: 0;
 transition: max-height .5s cubic-bezier(0, 1, 0, 1) -.1s;
}
.headerBox .slide li{
    padding:10px;
    color:#818181;
}
.headerBox .slide li.active,.headerBox .marketBox.active input:disabled,.headerBox .marketBox.active i{
    color:#377be2;
    border-color: #377be2;
    -webkit-text-fill-color:#377be2;
}
.headerBox .animate {
 max-height: 999px;
 transition-timing-function: cubic-bezier(0.5, 0, 1, 0);
 transition-delay: 0s;
}
.headerBox .marketBox{
    background: #fff;
    width: 25vw;
    height: 46px;
    line-height: 46px;
    font-size: 14px;
    float:left;
    position: relative;
    margin-left: 3vw;
}
.headerBox .marketBox input{
    width:20vw!important;
    font-size: 14px;
    box-sizing: border-box;
    padding: 0 2vw 0 0;
    border: 0;
    color:#818181;
    background: transparent;
    -webkit-tap-highlight-color: transparent;
    opacity: 1;
    -webkit-text-fill-color:#818181;
    -webkit-opacity:1;
}
.headerBox .marketBox input:disabled,.headerBox .marketBox input.disabled,.headerBox .marketBox input[disabled]{
    color:#818181;
    background: transparent;
    -webkit-tap-highlight-color: transparent;
    opacity: 1;
    -webkit-text-fill-color:#818181;
    -webkit-opacity:1;
}
.headerBox .marketBox i{
    content: " ";
    display: inline-block;
    height: 6px;
    width: 6px;
    border-width: 2px 2px 0 0;
    border-color: #adadad;
    border-style: solid;
    transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0);
    top: -2px;
    position: relative;
    /*top: 50%;*/
    margin-top: -6px;
    /*right: 2px;*/
    color: inherit;
    transition: transform 300ms;
}
.headerBox .marketBox i.down{
    transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0) rotate(90deg);
}
.headerBox .marketBox i.up{
    transform:matrix(0.71, 0.71, -0.71, 0.71, 0, 0) rotate(-90deg);
}

/****搜索****/
.headerBox .searchIcon{
    height:46px;
    line-height: 46px;
    position: absolute;
    right:0;
    top:0;
    text-align: right;
    width:20vw;
    padding-right: 3.2vw;
    color:#818181;
}
.headerBox .searchBox{
    width:100%;
    height:46px;
    box-sizing: border-box;
    z-index: 120;
    position: absolute;
    left:0;
    top:0;
    background: #fff;
}
.headerBox .searchBox .inputBox{
    width: 85vw;
    height:46px;
    line-height: 46px;
    float:left;
    /*background: #f00;*/
}
.headerBox .searchBox .weui-cell{
    padding:0;
    margin:10px 15px;
    background: #F5F5F5;
    border-radius: 5px;
    padding-left:15px;
}
.headerBox .searchBox .weui-cells:before{
    border-top: none;
    height:0;
}
.headerBox .searchBox .weui-cells:after{
    border-bottom: none;
    height:0;
}
.headerBox .searchBox .inputBox input.weui-input{
    height:24px;
    font-size: 14px;
    padding: 0;
    color:#818181;
}
.headerBox .searchBox span{
    width:14vw;
    height:46px;
    line-height: 46px;
    display: inline-block;
    text-align: center;
    float:right;
    color:#818181;
}

/**********返回************/
.headerBox .filtrateBack {
    width:17vw;
    float:left;
    height: 46px;
    line-height: 46px;
    font-size: 14px;
    float: left;
    position: relative;
    margin-left:5vw;
    color:#818181;
}
.headerBox .filtrateBack span{
    color:#818181;
}
.headerBox .filtrateBack .fa-angle-left{
    font-size: 25px;
}
.headerBox .filtrateBack .left{
    width: 15px;
    height: 30px;
    display: inline-block;
    position: relative;
    top:2px;
}
.headerBox .filtrateBack .left::before{
    content: " ";
    display: inline-block;
    margin-right: 2vw;
    height: 12px;
    width: 12px;
    border: 2px solid #adadad;
    border-width: 2px 0 0 2px;
    transform: rotate(315deg);
}
</style>
