<template>
  <div class="Login">
    <!-- <van-cell-group> -->
    <van-field
      v-model="phoneNumber"
      required
      clearable
      label="手机号"
      placeholder="请输入手机号"
    />

    <van-field
      v-model="password"
      type="password"
      label="密码"
      placeholder="请输入密码"
      required
    />
    <van-button class="MarginT_40 loginBt" size="large" :loading='loading' round @click="Login">登陆</van-button>

    <van-row type="flex" justify="space-between" class="MarginT_20">
      <van-col span="12" class="SmallSize"><span @click="ForgetPsd">忘记密码</span></van-col>
      <van-col span="12" class="SmallSize"><span @click="GoSign">还没有账户？去注册</span></van-col>
    </van-row>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import {send} from '../util/send'
import { Toast } from 'vant'
export default {
  name: 'Login',
  data () {
    return {
      loading: false,
      phoneNumber: '',
      password: ''
    }
  },
  created () {
    // if (window.location.hash.indexOf('#/Login') !== -1) {
    //   localStorage.clear()
    //   // debugger
    //   // window.localStorage.removeItem('vuex-along')
    //   this.changeCurTab(-1)
    //   this.changeCurPageName('Login')
    // }
  },
  computed: {
    // ...mapState({
    //   spinner: state => state.spinner
    // })
  },
  methods: {
    ...mapActions([
      'changeCurPageName',
      'changeCurTab',
      'changeUserId',
      'changeUserName',
      'changeUserPhone',
      'changeCompany',
      'changeRole',
      'toggleSpinner'
    ]),
    DifferentTab (TYPE) {
      // this.changeCurTab(2)
      // this.$router.push({name: 'GongXuList'})
      // this.changeCurPageName('GongXuList')
      if (TYPE === '2') {
        this.changeCurTab(2)
        this.$router.push({name: 'GongXuList'})
        this.changeCurPageName('GongXuList')
      } else {
        this.changeCurTab(0)
        this.$router.push({name: 'Order'})
        this.changeCurPageName('Order')
      }
    },
    GoSign () {
      this.$router.push({name: 'Sign'})
    },
    ForgetPsd () {
      this.$router.push({name: 'ForgetPsd'})
    },
    Login () {
      if (this.phoneNumber.trim() === '' || this.password.trim() === '') {
        Toast({
          duration: 1500,
          forbidClick: true,
          position: 'bottom',
          message: '手机号或密码不能为空!'
        })
        return false
      }
      this.loading = true
      // this.toggleSpinner(true)
      send({
        name: '/userLogin?mobile=' + this.phoneNumber + '&fpassword=' + this.password,
        method: 'POST',
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
            this.loading = false
            this.toggleSpinner(false)
            break
          case 1:
            this.changeUserId(_res.data.memberInfo.id)
            this.changeUserName(_res.data.memberInfo.user_name)
            this.changeUserPhone(_res.data.memberInfo.fmobile)
            this.changeCompany(_res.data.memberInfo.company_name)
            // this.changeRole(2)
            this.changeRole(_res.data.memberInfo.fstatus)
            Toast.success({
              duration: 1000,
              forbidClick: true,
              message: '登陆成功！'
            })
            this.loading = false
            this.toggleSpinner(false)
            // this.DifferentTab('2')
            this.DifferentTab(_res.data.memberInfo.fstatus)
            break
          default:
            Toast.fail('Interface error！')
            this.loading = false
            this.toggleSpinner(false)
        }
      }).catch((res) => {
        Toast.fail('Interface error！')
        this.loading = false
        this.toggleSpinner(false)
      })
    }
  }
}
</script>

<style scoped>
.Login{
  padding: 40px 20px;
}
.loginBt{
  background: cadetblue !important;
  color: #fff;
  height: 40px !important;
  line-height: 39px !important;
}
</style>
