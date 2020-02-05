<template>
  <div class="Info">
    <p>role: {{role}}<p>
    <p class="tips MarginT_10">提示：{{role == 2 ? '本小区常住人员，请点击“卡点签到”' :'该人员为非本小区常住人员，请核实'}}</p>
    <div>
      <p>姓名： {{info.username}}</p>
      <p>性别： {{info.sex}}</p>
      <p>身份证号： {{info.ID}}</p>
      <p>手机号： {{info.phone}}</p>
      <p>车辆号： {{info.carNo}}</p>
      <p>住址： {{info.addr}}</p>
      <p>是否有旅居武汉或武汉人员接触史： {{info.ifContact}}</p>
      <p>若有请说明详情： {{info.detail}}</p>
      <p>登记时测量温度： {{info.temperature}}</p>
    </div>
    <van-cell-group class="MarginT_5" v-if="role == 1">
      <van-field
        v-model="addr"
        required
        label="探访对象及住址："
        label-width="115px"
        placeholder="请输入"
      />
      <van-field
        v-model="temperature"
        required
        label="实测体温："
        label-width="115px"
        placeholder="请输入"
      />
    </van-cell-group>
    <van-button type="info" v-if="role == 2" @click="clock" style="margin-top:20px;width: 40%;">卡点签到</van-button>
    <van-button type="info" v-if="role == 1" @click="submitInfo" style="margin-top:20px;width: 40%;">提 交</van-button>
  </div>
</template>

<script src="https://res.wx.qq.com/open/js/jweixin-1.2.0.js"></script>
<script>
import { mapState, mapActions } from 'vuex'
import { Toast, Notify } from 'vant'
// Dialog
import {send} from '../util/send'
import {formatTime} from '../util/utils.js'
export default {
  name: 'Info',
  data () {
    return {
      message: '该人员为非本小区常住人员，请核实',
      info: {
        username: '',
        sex: '',
        ID: '',
        phone: '',
        carNo: '',
        addr: '',
        ifContact: '',
        detail: '',
        temperature: ''
      },
      addr: '',
      temperature: ''
    }
  },
  created () {
    this.getInfo()
  },
  computed: {
    ...mapState({
      role: state => state.role,
      AreaId: state => state.AreaId,
      openid: state => state.openid
    })
  },
  components: {
  },
  methods: {
    submitInfo () {
      if (!this.addr || !this.temperature) {
        // Notify({ duration: 1500, type: 'warning', message: '请将信息填写完整!' });
        Toast({
          duration: 1500,
          forbidClick: true,
          message: '请将信息填写完整!'
        })
        return false
      }
      this.submit()
    },
    clock () {
      this.submit()
    },
    submit () {
      send({
        name: '/signInInsert?ischangzhu=' + (this.role === 1 ? 1 : 0) + '&areaid=' + this.AreaId + '&userid=' + this.openid + '&findpeople=' + this.addr + '&thisftemp=' + this.temperature,
        method: 'POST',
        data: {
        }
      }).then(_res => {
        switch (_res.data.code) {
          case 0:
            // 身份证正确
            Toast({
              duration: 1500,
              forbidClick: true,
              message: '签到成功!'
            })
            // this.$router.push({name: 'Info'})
            break
          default:
            // 身份证错误
            Toast({
              duration: 1500,
              forbidClick: true,
              message: _res.data.message + '!'
            })
        }
        // this.updateOpenId()
      }).catch((_res) => {
        console.log(_res)
      })
    },
    getInfo () {
      send({
        name: '/userInfoByOpenId?open_id=' + this.openid,
        method: 'GET',
        data: {
        }
      }).then(_res => {
        switch (_res.data.code) {
          case 0:
            // 跳转到业主注册界面
            this.info = {
              username: _res.data.user.username,
              sex: _res.data.user.fsex,
              ID: _res.data.user.idnumber,
              phone: _res.data.user.fmobile,
              carNo: _res.data.user.carno,
              addr: _res.data.user.faddress,
              ifContact: _res.data.user.iswuhan === '0' ? '无' : '有' ,
              detail: _res.data.user.fdetail,
              temperature: _res.data.user.ftemp
            }
            break
          default:
            Toast.success({
              duration: 1000,
              forbidClick: true,
              message: '信息获取失败！'
            })
        }
        this.updateOpenId()
      }).catch((_res) => {
        console.log(_res)
      })
    },
  }
}
</script>

<style>
.Info{
  padding: 0px 10px;
  margin-bottom: 20px;
}
.Info p{
  text-align: left;
  padding-top: 5px;
}
.Info .van-field__control{
  text-align: right !important;
}
</style>
