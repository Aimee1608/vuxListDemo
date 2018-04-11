import Vue from 'vue'
import { WechatPlugin } from 'vux'
Vue.use(WechatPlugin)//使用微信插件
//公共路径
// let portUrl = "http://www.markets.com/index.php/port/";
let portUrl = "http://flow.xingyuanauto.com/FlowProject/MarketingTest/public/index.php/port/";

//用户登录
const UserLogin =  (phone,PasdCode,callback) =>{
    let data = {
      'phone':phone,
      'PasdCode':PasdCode
    };
    let url = portUrl + 'Login/UserLogin';
    Vue.http.post(url,data,{withCredentials: true}).then(response => response.json()).then(num => {
            callback && callback(num);
    })
}

//一级 二级 分类 一级分类 固定 1 二级 固定 2
const getLabel = (token,level,callback) => {
    let url = portUrl +  'Label/getLabel?token='+token+'&level='+level;
    Vue.http.get(url,{withCredentials: true}).then(response => response.json()).then(num => {
            callback && callback(num);
    })
}

//二级分类方案 + 筛选列表
const ProListData = (token,pageId,money_id,category_id,content_id,pro_name,new_start,recommend_start,callback) =>{
    let url = portUrl + 'Programme/ProListData';
    let data = {
        'token':token,
        'pageId':pageId,//分页id
        'money_id':money_id,//推广金额id
        'category_id':category_id,//营销类别id
        'content_id':content_id,//营销内容id
        'pro_name':pro_name,//	分案名称 搜索
        'new_start':new_start,
        'recommend_start':recommend_start

    }
    Vue.http.post(url,data,{withCredentials: true}).then(response => response.json()).then(num => {
            callback && callback(num);
    })
}
//用户方案收藏
const Collection = (token,pro_id,callback) =>{
    let url = portUrl + 'User/Collection?token='+token+'&pro_id='+pro_id;
    Vue.http.get(url,{withCredentials: true}).then(response => response.json()).then(num => {
            callback && callback(num);
    })
}
//用户收藏列表
const UserCollectList = (token,pageId,callback) =>{
  let url = portUrl + 'User/UserCollectList?token='+token+'&pageId='+pageId;
  Vue.http.get(url,{withCredentials: true}).then(response => response.json()).then(num => {
          callback && callback(num);
  })
}
//用户打分
const GetFraction = (token,pro_id,number,callback) =>{
  let url = portUrl + 'User/GetFraction?token='+token+'&pro_id='+pro_id+'&number='+number;
  Vue.http.get(url,{withCredentials: true}).then(response => response.json()).then(num => {
          callback && callback(num);
  })
}
//获取用户信息
const  UserInformation = (token,callback) =>{
  let url = portUrl + 'User/UserInformation?token='+token;
  Vue.http.get(url,{withCredentials: true}).then(response => response.json()).then(num => {
          callback && callback(num);
  })
}
//退出登录
const LoginOut = (token,callback) =>{
  let url = portUrl + 'Login/LoginOut?token='+token;
  Vue.http.get(url,{withCredentials: true}).then(response => response.json()).then(num => {
          callback && callback(num);
  })
}
//用户找回口令
const getRegister = (token,phone,callback) =>{
  let url = portUrl + 'Login/getRegister?token='+token+'&phone='+phone;
  Vue.http.get(url,{withCredentials: true}).then(response => response.json()).then(num => {
          callback && callback(num);
  })
}
//方案详情页面
const ProDetails = (token,pro_id,callback) =>{
    let url = portUrl + 'Programme/ProDetails?token='+token+'&pro_id='+pro_id;
    Vue.http.get(url,{withCredentials: true}).then(response => response.json()).then(num => {
            callback && callback(num);
    })
}
//微信分享
const wxShare = (obj,callback)=>{
    // console.log(obj,callback);
    function getUrl(){
       var url = window.location.href;
       var locationurl = url.split('#')[0];
       //console.log(locationurl);

       return locationurl;
   }
    if(obj){
        var title = obj.title==undefined||obj.title==null?'泉水系统':obj.title;
        var link = obj.link==undefined||obj.link==null?window.location.href:obj.link;
        var desc = obj.desc==undefined||obj.desc==null?'泉水系统':obj.desc;
        var imgUrl = obj.imgUrl==undefined||obj.imgUrl==null?getUrl()+'src/img/share.png':getUrl()+obj.imgUrl;
        var debug = obj.debug==true?true:false;
    }else{
        alert('请传分享参数');
    }
    //微信分享
    Vue.http.get("https://h5php.xingyuanauto.com/Flow/public/index.php/port/Aes/wx_token").then(response => response.json()).then(data => {
        console.log('微信微信',data)
        var wxdata = data;
        wxdata.debug = debug;
        wxdata.jsApiList= [
            // 所有要调用的 API 都要加到这个列表中
            'onMenuShareTimeline',//分享到朋友圈
            'onMenuShareAppMessage',//分享给朋友
            'onMenuShareQQ',//分享到QQ
            'onMenuShareQZone',//分享到QQ空间
            'onMenuShareWeibo'//分享到腾讯微博
        ];
        Vue.wechat.config(wxdata);


        Vue.wechat.ready(function () {
            //分享到朋友圈
            Vue.wechat.onMenuShareTimeline({
                title:title, // 分享标题
                link: link, // 分享链接
                desc: desc, // 分享描述
                imgUrl:imgUrl, // 分享图标
                success: function () {
                    callback && callback();
                    // 用户确认分享后执行的回调函数
                },
                cancel: function () {
                    // 用户取消分享后执行的回调函数
                }
            });
            //分享到朋友
            Vue.wechat.onMenuShareAppMessage({
                title: title, // 分享标题
                desc: desc, // 分享描述
                link: link, // 分享链接
                imgUrl: imgUrl, // 分享图标
                type: '', // 分享类型,music、video或link，不填默认为link
                dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                success: function () {
                    // 用户确认分享后执行的回调函数
                    callback && callback();
                },
                cancel: function () {
                    // 用户取消分享后执行的回调函数
                }
            });
            //分享到QQ
            Vue.wechat.onMenuShareQQ({
                title: title, // 分享标题
                desc: desc, // 分享描述
                link: link, // 分享链接
                imgUrl: imgUrl, // 分享图标
                success: function () {
                    // 用户确认分享后执行的回调函数
                    callback && callback();
                },
                cancel: function () {
                    // 用户取消分享后执行的回调函数
                }
            });

            //分享到QQ空间
            Vue.wechat.onMenuShareQZone({
                title: title, // 分享标题
                desc: desc, // 分享描述
                link: link, // 分享链接
                imgUrl: imgUrl, // 分享图标
                success: function () {
                   // 用户确认分享后执行的回调函数
                   callback && callback();
                },
                cancel: function () {
                    // 用户取消分享后执行的回调函数
                }
            });

            //分享到腾讯微博
            Vue.wechat.onMenuShareWeibo({
                title: title, // 分享标题
                desc: desc, // 分享描述
                link: link, // 分享链接
                imgUrl: imgUrl, // 分享图标
                success: function () {
                    // 用户确认分享后执行的回调函数
                    callback && callback();
                },
                cancel: function () {
                    // 用户取消分享后执行的回调函数
                }
            });
        })
    })
}


export {
    UserLogin,//登录
    getLabel,//获取一二级分类
    ProListData,//二级方案筛选列表
    LoginOut,//退出登录
    getRegister,//用户找回口令
    Collection,//用户方案收藏
    UserInformation,//获取用户信息
    UserCollectList,//用户收藏列表
    GetFraction,//用户打分
    ProDetails,//方案详情页面
    wxShare//微信分享
}
