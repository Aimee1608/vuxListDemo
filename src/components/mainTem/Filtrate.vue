<!-- 筛选页 -->
<template>
    <div class="FiltrateBox" style="height:100%;">
        <img src="src/img/bg.png" alt="">
        <div class="Filt-text">
              <p class="Filt-textleft Fi-text">Filtrate</p>
              <p class="Filt-textright Fi-text">筛选</p>
        </div>
        <div class="Filtkuang">
            <!-- <div class="marketBox" :class="Fvalue01?'active':''" @click="showContent = !showContent">
                <input v-model="Ftitle01" type="text" disabled/><i :class="showContent ? 'up' : 'down'"></i>
            </div>
            <ul class="slide"  :class="showContent?'animate':''" >
                <li v-for="item in list" :class="Fvalue01==item.value?'active':''" @click="SelectFun(item.label,item.value)">{{item.label}}</li>
            </ul> -->
            <!-- //循环的时候加个KEY区分顺序 -->
            <ul class="slide slide02"  :class="showContent02?'animate':''" >
                <li  :class="Fvalue02==0?'active':''" @click="SelectFun02('推广金额',0)">推广金额</li>
                <li v-for="(item,index) in list" :key="item.id" :class="Fvalue02==item.id?'active':''" @click="SelectFun02(item.name,item.id)">{{item.name}}</li>
            </ul>
            <div class="marketBox" :class="Fvalue02?'active':''" @click="showContent02 = !showContent02">
                <input v-model="Ftitle02" type="text" disabled/><i :class="showContent02 ? 'up' : 'down'"></i>
            </div>


        </div>

        <div class="File-gogo" @click="GetitemFun">
            确定
        </div>
        <p class="File-zhu">
           由于方案库庞大,进行初步筛选后才可查看内容哦^_^
        </p>
    </div>
</template>

<script>
import { Cell,CellFormPreview,Group} from 'vux'
import {getLabel,wxShare} from '../../pubJS/server.js'
    export default {
        data() { //选项 / 数据
            return {
                // showContent: false,
                showContent02:false,
                list: [],//推广金额数组
              //  Ftitle01:'推广金额',
              //  Fvalue01:null,
               Ftitle02:'推广金额',
               Fvalue02:0,

            }
        },
        methods: { //事件处理器
                GetitemFun(){//提交跳转到查询信息首页
                    //  console.log("提交");
                     localStorage.setItem('money_id',this.Fvalue02);
                     this.$store.state.money_id = this.Fvalue02;
                     this.$router.replace({path:"/Home"});
                },
                SelectFun02(label,value){//下拉选择分类
                    // console.log(label,value);
                    this.Ftitle02 = label;
                    this.Fvalue02 = value;
                    this.showContent02 = false;
                },
        },
        components: { //定义组件
              Cell,
              CellFormPreview,
              Group
        },
        created() { //生命周期函数
          var that = this;
        //   alert('token'+localStorage.getItem('token'));
          if(localStorage.getItem('token')){
            console.log(localStorage.getItem('token'),99999);
            getLabel(localStorage.getItem('token'),1,function(result){
              if(result.code == 1001){
                that.list = result.data[0].data;
                // console.log(result,that.list);
              }else{
                alert('获取分类失败'+result.code);
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

        }
    }
</script>

<style>
.FiltrateBox{
    background: #ffffff;
    position: relative;
}
.Filtkuang{
  width:81.3vw;
  height:42.4vw;
  position: absolute;
  top: 50.4vw;
  left: 9.3vw;
  background: #ffffff;
  border-radius: 5px;
  box-shadow: 0 5px 3px #d2e1f8;
  padding:7.7vw;
  box-sizing: border-box;
  font-size: 14px;
}

 .FiltrateBox .marketBox{
     width:62vw;
     height:6.4vw;
     line-height: 6.4vw;
     position: absolute;
     left:10vw;
     top:16vw;
     border-bottom: 1px solid #d2d2d2;
     text-align: center;
 }
 /*.FiltrateBox .marketBox:nth-child(1){
     top:10vw;
 }
 .FiltrateBox .marketBox:nth-child(1){
     top:22vw;
 }*/
 .FiltrateBox .marketBox input{
     text-align: center;
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

.FiltrateBox .marketBox input:disabled,.FiltrateBox.marketBox input.disabled,.FiltrateBox .marketBox input[disabled]{
     color:#818181;
     background: transparent;
     -webkit-tap-highlight-color: transparent;
     opacity: 1;
     -webkit-text-fill-color:#818181;
     -webkit-opacity:1;
 }
 .FiltrateBox .marketBox i{
     content: " ";
     display: inline-block;
     height: 6px;
     width: 6px;
     border-width: 2px 2px 0 0;
     border-color: #adadad;
     border-style: solid;
     transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0) ;
     top: -2px;
     position: absolute;
     right:10px;
     top: 50%;
     margin-top: -6px;
     /*right: 2px;*/
     color: inherit;
     transition: transform 300ms;
 }
  .FiltrateBox  .marketBox i.down{
     transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0) rotate(90deg);
 }
  .FiltrateBox  .marketBox i.up{
     transform:matrix(0.71, 0.71, -0.71, 0.71, 0, 0) rotate(-90deg);
 }


.FiltrateBox .slide {
 z-index: 55;
 width:62vw;
 box-sizing: border-box;
text-align: center;
 position: absolute;
 left:10vw;
 top:28.8vw;
 padding: 0 20px;
 background: #fff;
 overflow: hidden;
 max-height: 0;
 border-radius: 0 0 5px 5px;
 box-shadow: 0 10px 20px rgba(50,108,198,.5);
 transition: max-height .5s cubic-bezier(0, 1, 0, 1) -.1s;
}

.FiltrateBox .slide02{
    top:22.7vw;
}
.FiltrateBox .slide li{
    padding:10px;
    color:#818181;
}
.FiltrateBox .slide li.active,.FiltrateBox .marketBox.active input:disabled,.FiltrateBox .marketBox.active i{
    color:#377be2;
    border-color: #377be2;
    -webkit-text-fill-color:#377be2;
}
.FiltrateBox .animate {
 max-height: 999px;
 transition-timing-function: cubic-bezier(0.5, 0, 1, 0);
 transition-delay: 0s;
}


.FiltrateBox img{
  width: 100%;
  height: 67.4vw;
  position: absolute;
  top: 0;
}

.FiltrateBox .Filt-text{
     width:33vw;
     height: 30vw;
     position: absolute;
     top: 40.8vw;
     left: 9.3vw;
}
.FiltrateBox .Filt-textleft{
     font-size: 6.5vw;
     float: left;
     color: #ffffff;
}
.FiltrateBox .Filt-textright{
    font-size: 5.2vw;
    margin-top:0.8vw;
    float: right;
     color: #ffffff;
}
.FiltrateBox .File-gogo{
  width: 64vw;
  height: 10.9vw;
  text-align: center;
  background: #377be2;
  box-shadow: 0 0 10 5;
  line-height: 10.9vw;
  color: #ffffff;
  font-size: 4vw;
  border-radius: 0.8vw;
  position: absolute;
  bottom:18vw;
  left:18.1vw;
  box-shadow: 0 8px 15px rgba(50,108,198,.3);
}
.FiltrateBox .File-zhu{
    width:100%;
    text-align: center;
  font-size: 13px;
  color: #969696;
  position: absolute;
  left:0;
  bottom: 5vw;
}
</style>
