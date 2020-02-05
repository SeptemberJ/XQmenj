<template>
  <div id="app">
    <p class="tit">{{aresName}}人员出入登记记录</p>
    <p class="slogan">众志成城&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;抗击疫情</p>
    <router-view/>
    <p class="footer">准格尔旗新型冠状病毒感染的肺炎疫情防控指挥部办公室</p>
  </div>
</template>
<script src="https://res.wx.qq.com/open/js/jweixin-1.2.0.js"></script>
<script>
import { mapState, mapActions } from 'vuex'
import {MySha1} from './util/utils'
import {send} from './util/send'
import { Toast } from 'vant'
export default {
  name: 'App',
  data () {
    return {
      code: '',
      areaId: ''
    }
  },
  computed: {
    aresName: {
      get: function () {
        return this.$store.state.AreaName
      },
      set: function (newValue) {
        this.$store.state.AreaName = newValue
      }
    },
    openid: {
      get: function () {
        return this.$store.state.openid
      },
      set: function (newValue) {
        this.$store.state.openid = newValue
      }
    },
    role: {
      get: function () {
        return this.$store.state.role
      },
      set: function (newValue) {
        this.$store.state.role = newValue
      }
    }
    // ...mapState({
    //   openid: state => state.openid,
    //   aresName: state => state.AreaName
    // })
  },
  watch: {
  },
  created () {
    // 配置
    this.getOpenid()
    this.getAreaInfo()
  },
  methods: {
    ...mapActions([
      'updateOpenId',
      'updateAreaName',
      'updateRole'
    ]),
    // 获取url参数
    QueryString () {
      let urlData = {}
      let aPairs
      let aTmp
      let queryString = new String(location.search)
      queryString = queryString.substr(1, queryString.length)
      aPairs = queryString.split("&")
      for (let i = 0; i < aPairs.length; i++) {
        aTmp = aPairs[i].split("=")
        urlData[aTmp[0]] = aTmp[1]
      }
      console.log(urlData)
      return urlData
    },
    getUrl() {
      let appID = "wx1197fd93f588c883"
      let redirectUri = encodeURIComponent("https://zgeqscjdglj.org/menjin/#/Scan")
      let strUrl =
        "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" +
        appID +
        "&redirect_uri=" +
        redirectUri +
        "&response_type=code&scope=snsapi_base#wechat_redirect"
        this.$nextTick(() => {
          window.location.href = strUrl
        })
    },
    ConfigFn (JsapiTicket) {
      var mytimestamp = (Date.parse(new Date())) / 1000
      var mynonceStr = MySha1(String(mytimestamp)).substring(0, 16)
      var mysignature = 'jsapi_ticket=' + JsapiTicket + '&noncestr=' + mynonceStr + '&timestamp=' + mytimestamp + '&url=' + window.location.href.split("#")[0]
      wx.config({
        beta: true,
        debug: true,
        appId: 'wx1197fd93f588c883',
        timestamp: mytimestamp,
        nonceStr: mynonceStr,
        signature: MySha1(mysignature),
        jsApiList: [
          'scanQRCode',
          'chooseImage'
        ]
      })
      wx.error(function (res) {
        console.log('config失败---')
      })
      wx.ready(function () {
        console.log('config成功---')
      })
    },
    // 获取openid
    getOpenid () {
      send({
        name: '/getOpenId?code=' + this.QueryString()['code'] + '&areaid=' + this.QueryString()['state'],
        method: 'GET',
        data: {
        }
      }).then(_res => {
        if (_res.data.code === 0) {
          // 跳转到业主注册界面
          this.updateOpenId(_res.data.openid)
          this.$router.push({name: 'Register'})
        }
        if (_res.data.code === 1) {
          // 跳转到访客签到界面
            this.updateOpenId(_res.data.openid)
            this.updateRole(1)
            this.$router.push({name: 'Info'})
        }
        if (_res.data.code === 2) {
          // 跳转到业主签到界面
            this.updateOpenId(_res.data.openid)
            this.updateRole(2)
            this.$router.push({name: 'Info'})
        }
        // switch (_res.data.code) {
        //   case 0:
        //     // 跳转到业主注册界面
        //     this.updateOpenId(_res.data.openid)
        //     this.$router.push({name: 'Register'})
        //     break
        //   case 1:
        //     // 跳转到访客签到界面
        //     this.updateOpenId(_res.data.openid)
        //     this.updateRole(1)
        //     this.$router.push({name: 'Info'})
        //     break
        //   case 2:
        //     // 跳转到业主签到界面
        //     this.updateOpenId(_res.data.openid)
        //     this.updateRole(2)
        //     alert('in 2')
        //     this.$router.push({name: 'Info'})
        //     break
        //   case '2':
        //     // 跳转到业主签到界面
        //     alert('in 22')
        //     this.updateOpenId(_res.data.openid)
        //     this.updateRole(2)
        //     this.$router.push({name: 'Info'})
        //     break
        //   default:
        //     Toast.success({
        //       duration: 1000,
        //       forbidClick: true,
        //       message: '微信登录异常！'
        //     })
        //     // this.$router.push({name: 'Info'})
        // }
      }).catch((_res) => {
        console.log(_res)
      })
    },
    getAreaInfo () {
      send({
        name: '/areaById?id=' + this.QueryString()['state'],
        method: 'GET',
        data: {
        }
      }).then(_res => {
        this.updateAreaName(_res.data.area.fname)
      }).catch((res) => {
        Toast.fail('Interface error！')
      })
    },
    // getAccessToken () {
    //   send({
    //     name: '/getAccessToken',
    //     method: 'GET',
    //     data: {
    //     }
    //   }).then(_res => {
    //     switch (_res.data.expiresIn) {
    //       case 1:
    //         Toast.fail({
    //           duration: 1500,
    //           forbidClick: true,
    //           message: _res.data.message
    //         })
    //         break
    //       case 0:
    //         this.getTicket(_res.data.accessToken)
    //         break
    //       default:
    //         Toast.fail('Interface error！')
    //     }
    //   }).catch((res) => {
    //     Toast.fail('Interface error accseeToken！')
    //   })
    // },
    getTicket (acessToken) {
      send({
        name: '/getJSApiTicket',
        method: 'GET',
        data: {
        }
      }).then(_res => {
        this.ConfigFn(_res.data.ticket)
      }).catch((res) => {
        Toast.fail('Interface error！')
      })
    }
  }
}
</script>

<style scoped>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 0px;
}
.tit{
  width: 100%;
  height: 45px;
  line-height: 45px;
  text-align: center;
  color: blue;
  font-size: 18px;
  font-weight: bold;
}
.slogan{
  width: 100%;
  height: 45px;
  background: red;
  line-height: 45px;
  text-align: center;
  color: white;
  font-size: 24px;
  font-weight: bold;
}
.footer{
  width: 100%;
  height: 25px;
  background: #fff;
  line-height: 25px;
  text-align: center;
  position: fixed;
  bottom: 0;
  left: 0;
  font-size: 10px;
  color: #666;
}
.van-nav-bar{
  background: cadetblue !important;
  color: #fff;
}
</style>
