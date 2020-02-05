<template>
  <div class="Loading">
  </div>
</template>

<script src="https://res.wx.qq.com/open/js/jweixin-1.2.0.js"></script>
<script>
import { mapState, mapActions } from 'vuex'
import { Toast } from 'vant'
// Dialog
import {send} from '../util/send'
import {formatTime} from '../util/utils.js'
export default {
  name: 'Scan',
  data () {
    return {
    }
  },
  created () {
    this.updateAreaId(this.QueryString()['state'])
    // this.getAreaInfo()
    // this.getOpenid()
  },
  computed: {
    ...mapState({
      userName: state => state.userName
    })
  },
  components: {
  },
  methods: {
    ...mapActions([
      'updateOpenId',
      'updateRole',
      'updateAreaName',
      'updateAreaId'
    ]),
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
      // console.log(urlData)
      return urlData
    }
  }
}
</script>

<style>
.Loading{
  padding: 0px 10px;
  margin-bottom: 80px;
}
.van-cell__title{
  text-align: left !important;
}
.Loading .van-field__control{
  text-align: right !important;
}
</style>
