<!-- 登录 -->
<template>
    <div class="login">
        <img src="src/img/bg.png" alt="" class="loginbg">
        <div class="login-text">
              <p class="login-textleft lo-text">Login</p>
              <p class="login-textright lo-text">登录</p>
        </div>
        <div class="login-kuang">
            <group class="lo-phone info" >
              <x-input type="number"  placeholder="输入手机号码"   v-model="phone" :min="11" :max="11"></x-input>
            </group>
            <group class="lo-kouling info" >
                  <x-input type="number" class="weui-vcode" v-model="PasdCode" :min="6" :max="6" placeholder="输入口令">  </x-input>
           </group>
           <p class="login-forget"  slot="right" type="primary" mini @click="GetvcodeFun">{{cvodeTip}}</p>
           <!-- 提示弹框 -->
           <div v-show="isAlert" class="alertTip" @click="isAlert=!isAlert">
                  <img src="src/img/close.png" alt="" class="close">
                  <img src="src/img/gantan.png" alt="" class="gantan">
                  <p>{{alertTip}}</p>
           </div>
        </div>
       <div class="lo-gogo" @click="LoginFun">
           立即登录
       </div>
       <p class="lo-zhu zhu01">
           手机号变更或新同事登录，需要发送姓名+手机号+负责
       </p>
       <p class="lo-zhu zhu02">
          区域／品牌发送至<a>xxx@xingyuanauto.com</a>开通登录权限
       </p>
       <!-- loading部分 -->
       <div class="LoadingPage" v-show="isLoading">
           <img src="src/img/logo.png" alt="">
           <p>copyright©xingyuanauto.com</p>
       </div>
    </div>
</template>

<script>
import { XInput, Group, XButton, Cell } from 'vux'
import {UserLogin,getRegister,wxShare} from '../../pubJS/server.js'
    export default {
        data() { //选项 / 数据
            return {
                phone:15035574759,//手机号
                PasdCode: '070668',//验证码
                cvodeTip:'忘记口令',//获取口令 和 重新获取
                isAlert:false,//是否提示弹框
                alertTip:'口令已发送到您的手机上，请注意查收',
                isLoading:true,//初始加载动画
            }
        },
        methods: { //事件处理器
            LoginFun(){//登录提交
                var that = this;
                // console.log(this.phone,this.PasdCode);
                var reg = /^1[34578]\d{9}$/;
                // console.log(reg.test(this.phone),!isNaN(this.PasdCode),this.phone.toString().length==11,this.PasdCode.toString().length==6)
                //正则匹配登录的手机号和口令
                if(reg.test(this.phone)&&!isNaN(this.PasdCode)&&this.phone.toString().length==11&&this.PasdCode.toString().length==6){
                  UserLogin(this.phone,this.PasdCode,function(msg){
                      // console.log(msg);
                    // alert(msg.code);
                      if(msg.code==1001){//登录成功
                        localStorage.clear();
                        localStorage.setItem('token',msg.token);
                        that.$router.push({path:"/Filtrate"});
                      }else{//登录失败
                            that.isAlert = true;
                            that.alertTip = msg.msg;
                            var timer = setTimeout(function(){
                                that.isAlert = false;
                                clearTimeout(timer);
                                timer = null;
                            },1000)
                      }
                  })
                }else{
                  this.isAlert = true;
                  this.alertTip = '请正确输入手机号和口令';
                }
            },
            GetvcodeFun(){//获取验证码
                var that = this;
                if(that.cvodeTip=="忘记口令"){
                  that.PasdCode = '';
                  getRegister(that.token,that.phone,function(result){
                    // console.log('获取口令',result);
                    if(result.code==1001){
                      that.alertTip = "口令已发送到您的手机上，请注意查收";
                      that.isAlert = true;
                      that.cvodeTip = "已发送口令";
                      var timer = setTimeout(function(){
                          that.isAlert = false;
                          clearTimeout(timer);
                          timer = null;
                      },1500)
                    }else{
                      that.alertTip = "网络异常，请重新请求";
                      that.isAlert = true;
                      that.cvodeTip = "忘记口令";
                      var timer = setTimeout(function(){
                          that.isAlert = false;
                          clearTimeout(timer);
                          timer = null;
                      },1500)
                    }
                  })
                }else{
                  that.alertTip = "口令已发送到您的手机上，请注意查收";
                  that.isAlert = true;
                  that.cvodeTip = "已发送口令";
                  var timer = setTimeout(function(){
                      that.isAlert = false;
                      clearTimeout(timer);
                      timer = null;
                  },1500)
                }
            },

        },
        components: { //定义组件
            XInput,
            XButton,
            Group,
            Cell
        },
        created() { //生命周期函数
            var that = this;
            //一定时间后清除load页面
            var timer = setTimeout(function(){
                that.isLoading = false;
                clearTimeout(timer);
                timer = null;
            },2000);

            wxShare({
                title: '泉水系统', // 分享标题
                desc: '泉水系统啦啦啦', // 分享描述
                link: window.location.href, // 分享链接
                imgUrl: 'src/img/share.png', // 分享图标
                // debug:true
            },function(){//分享成功后的回调函数

            });
        }
    }
</script>

<style>
    .login{
      width: 100%;
      height: 100%;
      margin: auto;
      background: #fff;
      position: relative;
    }
    .login .LoadingPage{
        width:100%;
        height:100%;
        position: absolute;
        left:0;
        top:0;
        background: #fff;
    }
    @keyframes load {
        0%{
            opacity: 0
        }
        60%{
            opacity: 1
        }
        90%{
            opacity: 1
        }
        100%{
            opacity: 0
        }
    }
    @-webkit-keyframes load {
        0%{
            opacity: 0
        }
        60%{
            opacity: 1
        }
        90%{
            opacity: 1
        }
        100%{
            opacity: 0
        }
    }
    .login .LoadingPage img{
        width:53.86vw;
        height:69.73vw;
        position: absolute;
        left:22.93vw;
        top:26.93vw;
        opacity: 0;
        animation: load 2s ease-in forwards;
        -webkit-animation: load 2s ease-in forwards;
    }
    .login .LoadingPage p{
        width:100%;
        font-size: 13px;
        position: absolute;
        left:0;
        bottom:5vw;
        text-align: center;
        color:#969696;
        opacity: 0;
        animation: load 2s ease-in forwards;
        -webkit-animation: load 2s ease-in forwards;
    }
    .login .lo-gogo{
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
    .login .lo-zhu{
        width:100%;
        text-align: center;
         font-size: 13px;
         color: #969696;
         position: absolute;
         left:0;
    }
    .login .zhu01{
         bottom: 5vw;
    }
    .login .zhu02{
         bottom: 9vw;
    }
    .login .loginbg{
      width: 100%;
      height: 67.4vw;
      position: absolute;
      top: 0;
    }
    .login .lo-text{
        color: #ffffff;
    }
    .login .login-text{
         width:30vw;
         height: 30vw;
         position: absolute;
         top: 40.8vw;
         left: 9.3vw;
    }
    .login .login-textleft{
        float: left;
    }
    .login .login-textright{
        float: right;
    }
    .login .login-kuang{
      width:81.3vw;
      height:42.9vw;
      box-sizing: border-box;
      padding:0 3vw;
      position: absolute;
      top: 50.4vw;
      left: 9.3vw;
      border-radius: 5px;
      background: #ffffff;
      box-shadow: 0 5px 3px #d2e1f8;
    }
    .login .login-kuang .weui-cells{
      border-bottom: 1px solid #d2d2d2;
      margin-top: 6vw;
    }
    .login .login-kuang .weui-cell{
      padding:5px 5px;
      font-size: 14px;
      color:#8a8a8a;
    }
    .login .info div.weui-cells:before,  .login .info div.weui-cells:after{
      height:0;
      border:0;
      border-bottom: 0;
    }
    .login .login-textleft{
         font-size: 6.5vw;
    }
    .login .login-textright{
         font-size: 5vw;
         margin-top:0.8vw;
    }
    .login .login-forget{
         color: #377be2;
         font-size: 3.4vw;
         position: absolute;
         bottom: 10px;
         right: 10px;
         background: transprant;
    }
    .login .info{
      /*height: 6.4vw;*/
      /*border-bottom: 1px solid gray;*/
      border-top: 0;
    }
    .login .alertTip{
      width:100%;
      height:100%;
      position: absolute;
      left:0;
      top:0;
      text-align: center;
      background: #fff;
      color:#377be2;
      border-radius: 5px;
    }
    .login .alertTip .gantan{
      width:16.26vw;
      height:13.06vw;
      margin-bottom: 30px;
      margin-top: 30px;
       color:#377be2;
    }
    .login .alertTip .close{
        width:6.67vw;
        height:7.06vw;
        position: absolute;
        right:2.1vw;
        top:2.1vw;
    }
</style>
