<!-- 详情页 -->
<template>
    <div class="Detailcontainer">
        <view-box ref="viewBox">
            <x-header class="backBox" @on-click-back="onClickBack"  :left-options="{preventGoBack: true}" >{{detailObj.pro_name}}<a slot="right" v-if="detailObj.closed_url" @click="onClickMore">{{closeText}}</a></x-header>
            <div class="DeatilBox" ref="DetailBox">
                 <loading :show="loadshow" :text="loadtext"></loading>
                 <!-- pdf容器 -->
                <div class="pfdBox" ref="container"></div>
            </div>
            <div class="starheart">
                <span class="star" @click="StarhandelFun"><i class="fa fa-fw " :class="detailObj.is_collect==1?'fa-star':'fa-star-o'"></i></span>
                <span class="heart" v-show="detailObj.is_score==1"><i class="fa fa-fw fa-heart"></i></span>
                <div class="heartList" v-show="detailObj.is_score!=1">
                    <rater v-model="heartData" :font-size="23" star="<i class='fa fa-fw fa-heart-o'></i>" active-color="#377be2" :margin="10"></rater>
                    <span class="spanbtn" @click="HeartFun">确认</span>
                    <em></em>
                    <span class="spanbtn" @click="HeartCancle">取消</span>
                </div>
                 <toast v-model="toastShow" type="text" :time="1000" position="bottom">{{toastText}}</toast>
            </div>
        </view-box>
    </div>
</template>

<script>

import { ViewBox ,Loading ,Rater ,Toast,XHeader} from 'vux'
import {ProDetails,  Collection,GetFraction,wxShare} from '../../pubJS/server.js'
    export default {
        name:'Detail',
        data() { //选项 / 数据
            return {
                loadshow:true,//显示加载loading
                loadtext:"Loading",
                isStar:true,
                isHeart:false,
                heartData:0,
                toastShow:false,
                toastText:'',
                detailObj:{},
                closeText:'结案',
                pdfUrl:'',//分享的pdf
            }
        },
        methods: { //事件处理器
            showall(url, page, id, pdf) {//渲染pdf
                    pdf.getPage(page).then(function getPageHelloWorld(page) {
                        var scale = 1.0;
                        var viewport = page.getViewport(scale);
                        var canvas = document.getElementById(id);
                        var context = canvas.getContext('2d');
                        canvas.height = viewport.height;
                        canvas.width = viewport.width;
                        var renderContext = {
                            canvasContext: context,
                            viewport: viewport
                        };
                        page.render(renderContext);
                    });
            },
            showPdf(url) {//显示pdf
               var that = this;
               that.loadshow = true;
                // var url = "src/assets/demo.pdf";
                var urlLink = this.$store.state.host+"/Aes/ShowPdFile?pdf_url="+url;
                that.pdfUrl = "http://flow.xingyuanauto.com/FlowProject/MarketingTest/public"+url;
                //重新调用微信分享
                that.wechat();
                // console.log('pdfurl.....................',urlLink);
                PDFJS.getDocument(urlLink).then(function getPdfHelloWorld(pdf) {
                    var pages = pdf.numPages;//正常不除6
                    console.log('pdf0000000000000',pages);
                    //页面太多影响性能
                    for(var i = 1; i < pages; i++) {
                        var id = 'page-id-' + i;
                        if(!document.getElementById(id)){
                            var canvas = document.createElement('canvas');
                            canvas.id = id;
                            that.$refs.container.appendChild(canvas);
                        }

                        // console.log(i);
                        that.showall(url, i, id,pdf);
                        if(i==(pages-1)){
                            that.loadshow = false;//隐藏加载loading                            
                        }

                    }
                });
            },
            StarhandelFun(){//收藏取消收藏
                var that = this;
                Collection(that.token,that.pro_id,function(result){
                  if(result.code==1001){
                    // console.log('收藏取消收藏',that.detialObj.is_collect,result);
                    that.detailObj.is_collect = that.detailObj.is_collect == 0?1:0;
                    // console.log(that.detailObj.is_collect);
                    if(that.detailObj.is_collect==1){
                        that.toastText = '收藏成功';
                    }else{
                        that.toastText = '取消收藏';
                    }
                    that.toastShow = true;
                  }else{
                    alert('修改失败')
                  }
                })
            },
            HeartFun(){//确定打分
              var that = this;
                // console.log('分数',that.heartData);
                GetFraction(that.token,that.pro_id,that.heartData,function(result){
                //   console.log('打分数',result);
                  if(result.code==1001){
                    that.detailObj.is_score = 1;
                    that.toastShow = true;
                    that.toastText = '已评分';
                  }
                })
            },
            HeartCancle(){//重新打分
                this.heartData = 0;
            },
            onClickBack(){//返回
                // console.log('返回');
                this.$router.back(-1);
            },
            onClickMore(){//结案

                 if(this.closeText=='结案'){
                     this.closeText = "招商";
                     this.showPdf(this.detailObj.closed_url);
                 }else{
                     this.closeText = "结案";
                     this.showPdf(this.detailObj.pro_url);
                 }

            },
            wechat(){
                var that = this;
                wxShare({
                    title: that.detailObj.pro_name, // 分享标题
                    desc: that.detailObj.describe, // 分享描述
                    link: that.pdfUrl, // 分享链接
                    imgUrl: that.detailObj.img_url, // 分享图标
                    // debug:true
                },function(){//分享成功后的回调函数

                });
            }

        },
        components: { //定义组件
            ViewBox,//页面滚动
            Loading,//加载loading
            Rater,//爱心评分
            Toast,//提示
            XHeader//头部
        },
        created() { //生命周期函数
          var that = this;
          if(sessionStorage.getItem('token')){
            that.token = sessionStorage.getItem('token');
            that.pro_id = that.$route.query.id==undefined?1:parseInt(that.$route.query.id);//获取传参的classId
            ProDetails(that.token,that.pro_id,function(result){
            //   console.log('详情',result);
              if(result.code==1001){
                that.detailObj = result.data;
                that.pdfUrl= "http://flow.xingyuanauto.com/FlowProject/MarketingTest/public"+result.data.pro_url;
                that.showPdf(result.data.pro_url);
              }
            })
          }
        },
        mounted () {
            console.log(this.$refs.container);
        }
    }
</script>

<style>
.Detailcontainer {
    height:100%;
    overflow: hidden;
}
.Detailcontainer .weui-tab__panel{
    padding-bottom: 0;
}
.DeatilBox{
    height:100%;
    box-sizing: border-box;
    padding-top:46px;
    position: absolute;
    left:0;
    top:0;
    overflow: auto;
}
.DeatilBox .pfdBox{
    width:100%;
}
.DeatilBox .pfdBox  canvas{
    width:100%;
    margin-bottom: 10px;
}
 .starheart{
    width:100%;
    height:10.8vw;
    position: absolute;
    left:0;
    bottom:5.6vw;
    /*background: #333;*/
}
 .starheart .star,.starheart .heart{
    width:10.8vw;
    height:10.8vw;
    line-height: 10.8vw;
    font-size: 23px;
    text-align: center;
    position: absolute;
    top:0;
    background: #fff;
    border-radius: 50%;
    color:#377be2;
}
.starheart .star .fa-star,.starheart .heart .fa-heart{
    color:#377be2;
}
.starheart .star .fa-star-o{
    color:#999999;
}
 .starheart .star{
    right:6vw;
}
.starheart .heart{
    right:20vw;
}
.starheart .heartList{
    width:76.8vw;
    height: 10.8vw;
    line-height: 10.8vw;
    border-radius: 10.8vw;
    background: #fff;
    position: absolute;
    top:0;
    left:4vw;
    padding:0 2vw;
    box-sizing: border-box;
    text-align: right;
}
.starheart .heartList .vux-rater{
    position: relative;
    top:50%;
    transform: translate(0,-50%);
    float:left;
    margin-left: 10px;
}
.starheart .heartList .vux-rater .is-active .fa-heart-o:before {
    content: "\f004";
}
.starheart .heartList .spanbtn{
    float:right;
    padding:0 2vw;
}
.starheart .heartList em{
    display: block;
    width:1px;
    height:8vw;
    position: relative;
    top:50%;
    transform: translate(0,-50%);
    float:right;
    background: #ebebeb;
}



.backBox.vux-header{
    position: absolute;
    left:0;
    top:0;
    z-index: 100;
    width:100%;
    background: #fff;
    color:#818181;
}
.backBox.vux-header a.vux-header-back,.backBox.vux-header .vux-header-right a{
    color:#818181;
    font-size: 14px;
}
.backBox.vux-header .vux-header-title{
    color:#818181;
}
.backBox.vux-header .vux-header-left .left-arrow:before{
    border:2px solid #adadad;
    border-width: 2px 0 0 2px;
}
</style>
