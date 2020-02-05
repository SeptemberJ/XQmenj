<template>
  <div class="Register">
    <!-- <van-nav-bar
      title="x人员信息填写"
      left-text="返回"
      left-arrow
      @click-left="backScanPage"
    /> -->
    <p class="tips MarginT_10">疫情面前，人人有责，为了您和大家的健康，请填写真实信息</p>
    <van-cell-group>
      <van-field
        v-model="username"
        required
        label="姓名："
        placeholder="请输入"
      />
     <!--  <van-field
        v-model="sex"
        required
        label="性别："
        placeholder="请输入"
      /> -->
      <van-field
        v-model="ID"
        required
        label="身份证号："
        placeholder="请输入"
      />
      <van-field
        v-model="phone"
        required
        label="手机号："
        placeholder="请输入"
      />
      <van-field
        v-model="carNo"
        required
        label="车辆号："
        placeholder="请输入"
      />
      <!-- <van-field
        v-model="addr"
        required
        label="住址："
        placeholder="请输入"
      /> -->
      <van-field
        v-model="ifContact"
        required
        readonly
        label="是否有旅居武汉或武汉人员接触史："
        label-width="225px"
      />
      <van-radio-group v-model="ifContact">
        <van-radio name="无">无</van-radio>
        <van-radio name="有">有</van-radio>
      </van-radio-group>
      <van-field
        v-model="detail"
        rows="1"
        autosize
        label="若有请说明详情："
        label-width="115px"
        type="textarea"
        placeholder="请输入"
      />
      <van-field
        v-model="temperature"
        required
        label="实测温度："
        placeholder="请输入"
      />
    </van-cell-group>
    <van-button type="info" @click="submitInfo" style="margin-top:20px;width: 40%;">提 交</van-button>
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
  name: 'Register',
  data () {
    return {
      username: '',
      sex: '',
      ID: '',
      phone: '',
      carNo: '',
      addr: '',
      ifContact: '',
      detail: '',
      temperature: ''
    }
  },
  created () {
    // this.getGongxuList()
    // this.scanDate = formatTime(new Date())
  },
  computed: {
    ...mapState({
      openid: state => state.openid,
      AreaId: state => state.AreaId,
      AreaName: state => state.AreaName
    })
  },
  components: {
  },
  methods: {
    backScanPage () {
      this.$router.push({name: 'Scan'})
    },
    submitInfo () {
      if (!this.username ||  !this.ID || !this.phone || !this.carNo || !this.ifContact|| !this.temperature) {
        Toast({
          duration: 1500,
          forbidClick: true,
          message: '请将信息填写完整!'
        })
        return false
      }
      if (this.ifContact == '有' && !this.detail) {
        Toast({
          duration: 1500,
          forbidClick: true,
          message: '请将接触信息填写完整!'
        })
        return false
      }
      console.log('submit')
      this.checkId()
    },
    checkId () {
      send({
        name: '/checkIdNumber?id_number=' + this.ID + '&realname=' + this.username,
        method: 'POST',
        data: {
        }
      }).then(_res => {
        switch (_res.data.code) {
          case 0:
            // 身份证正确
            this.sex = _res.data.sex
            this.addr = _res.data.address
            this.sureSubmit()
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
    sureSubmit () {
      send({
        name: '/userinsert?open_id=' + this.openid + '&username=' + this.username + '&fsex=' + this.sex + '&idnumber=' + this.ID + '&fmobile=' + this.phone + '&carno=' + this.carNo + '&faddress=' + this.addr + '&iswuhan=' + (this.ifContact === '有' ? 1 : 0) + '&fdetail=' + this.detail + '&ftemp=' + this.temperature + '&areaid=' + this.AreaId,
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
              message: '登记成功!'
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
    }
  }
}
</script>

<style>
.Register{
  padding: 0px 10px;
  margin-bottom: 20px;
}
.van-cell__title{
  text-align: left !important;
}
.Register .van-field__control{
  text-align: right !important;
}
.van-radio{
  display: inline-block;
  float: right;
  margin-left: 10px;
}
</style>
