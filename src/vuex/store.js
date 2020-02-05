import Vue from 'vue'
import Vuex from 'vuex'
import vuexAlong from 'vuex-along'

Vue.use(Vuex)

// const debug = process.env.NODE_ENV !== 'production'

const state = {
  openid: '', // oQtPE0g5HzL8esgFJf-Jni1TNhIk
  AreaId: null,
  AreaName: '',
  role: null // 1-访客 2-住户
}
// actions
const actions = {
  updateOpenId ({commit, state}, OpenId) {
    commit('setOpenId', OpenId)
  },
  updateRole ({commit, state}, Role) {
    commit('setRole', Role)
  },
  updateAreaId ({commit, state}, AreaId) {
    commit('setAreaId', AreaId)
  },
  updateAreaName ({commit, state}, AreaName) {
    commit('setAreaName', AreaName)
  }
}

// mutations
const mutations = {
  setOpenId (state, OpenId) {
    state.openid = OpenId
    // alert('action1:' + OpenId)
  },
  setRole (state, Role) {
    state.role = Role
  },
  setAreaId (state, AreaId) {
    state.AreaId = AreaId
  },
  setAreaName (state, AreaName) {
    // alert('action2:' + AreaName)
    state.AreaName = AreaName
  }
}

export default new Vuex.Store({
  state,
  modules: {
  },
  // getters,
  actions,
  mutations,
  // strict: debug,
  plugins: [vuexAlong]
  // plugins: debug ? [createLogger()] : []
})
