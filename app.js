//app.js
import {
  initTodoList,
  // initArchiveList,
  initTags,
} from './utils/util.js'
App({
  globalData: {
    userInfo: null,
    todoList: Array.from(wx.getStorageSync('todoList') || initTodoList()).map(i => {
      if (i.completed && new Date(i.completedTime).getDate() !== new Date().getDate()) i.archive = true
      else i.archive = false
      return i
    }),
    // archiveList: Array.from(wx.getStorageSync('archiveList') || initArchiveList()),
    tags: Array.from(wx.getStorageSync('tags') || initTags())
  },
  onLaunch: function() {
    // this.globalData.todoList = app.globalData.todoList.filter(
    //   i => (!i.completed) || (i.completed && new Date(i.completedTime).getDate() === new Date().getDate())
    // )
    // this.globalData.archiveList = this.globalData.archiveList.concat(app.globalData.todoList.filter(
    //   i => (i.completed && new Date(i.completedTime).getDate() !== new Date().getDate())
    // ))
    wx.setStorageSync('todoList', this.globalData.todoList)
    // wx.setStorageSync('archiveList', this.globalData.archiveList)
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },

})