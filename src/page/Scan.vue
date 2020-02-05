<template>
  <div class="Scan">
    <van-button type="info" @click="scanCode" style="margin-top: 80px;width:40%;">扫 码</van-button>
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
      orderNumber: '点击图标扫描', // '点击图标扫描',
      gongxu: '请选择',
      scanDate: '',
      area: '',
      note: '',
      showGongxuList: false,
      gongxuList: []
    }
  },
  created () {
    // this.getGongxuList()
    // this.scanDate = formatTime(new Date())
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
      'toggleSpinner'
    ]),
    scanCode () {
      console.log('准备扫描')
      // this.$router.push({name: 'Register'})
      wx.scanQRCode({
        needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
        scanType: ["qrCode","barCode"], // 可以指定扫二维码还是一维码，默认二者都有
        success: (res) => {
          console.log(res)
        },
        fali: (res) => {
          console.log(res)
        }
      })
    },
    showSelectListAction () {
      this.showGongxuList = true
    },
    onCancel () {
      this.showGongxuList = false
    },
    changeSelect (item) {
      this.showGongxuList = false
      this.gongxu = item
    },
    submitScan () {
      // 校验
      if (this.orderNumber === '点击图标扫描' || this.area.trim() === '' || this.note.trim() === '' || this.gongxu === '请选择') {
        Toast.fail({
          duration: 1500,
          forbidClick: true,
          message: '请将信息填写完整！'
        })
        return false
      }
      this.sureAdd()
      // Dialog.confirm({
      //   title: '标题',
      //   message: '确认提交该工序订单？'
      // }).then(() => {
      //   // this.sureAdd()
      // }).catch(() => {
      //   // on cancel
      // })
    },
    sureAdd () {
      this.toggleSpinner(true)
      send({
        name: '/insertGongxuOrder',
        method: 'POST',
        data: {
          'gongxu': {
            'gongdanhao': this.orderNumber,
            'fgongxu': this.gongxu,
            'fczy': this.userName,
            'fmj': this.area,
            'fnote': this.note
          }
        }
      }).then(_res => {
        switch (_res.data.code) {
          case 1:
            this.toggleSpinner(false)
            Toast.fail({
              duration: 1500,
              forbidClick: true,
              message: _res.data.message
            })
            break
          case 2:
            this.toggleSpinner(false)
            Toast.fail({
              duration: 1500,
              forbidClick: true,
              message: _res.data.message
            })
            break
          case 0:
            Toast.success('提交成功!')
            this.toggleSpinner(false)
            // 清空
            this.orderNumber = '点击图标扫描'
            this.gongxu = '请选择'
            this.scanDate = ''
            this.area = ''
            this.note = ''
            break
          default:
            Toast.fail('Interface error！')
            this.toggleSpinner(false)
        }
      }).catch((res) => {
        Toast.fail('Interface error！')
        this.toggleSpinner(false)
      })
    },
    getGongxuList () {
      send({
        name: '/defalutGxList',
        method: 'GET',
        data: {
        }
      }).then(_res => {
        switch (_res.data.code) {
          case 0:
            Toast.fail({
              duration: 1500,
              forbidClick: true,
              message: _res.data.message
            })
            break
          case 1:
            let temp = []
            _res.data.defalutGxList.map((item) => {
              temp.push(item.fname)
            })
            this.gongxuList = temp
            break
          default:
            Toast.fail('Interface error！')
        }
      }).catch((res) => {
        Toast.fail('Interface error！')
      })
    }
  }
}
</script>

<style>
.Scan{
  padding: 0px 10px;
  margin-bottom: 80px;
}
.van-cell__title{
  text-align: left !important;
}
.Scan .van-field__control{
  text-align: right !important;
}
</style>
