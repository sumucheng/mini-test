// pages/completed/completed.js
import {
  formatTime
} from '../../utils/util.js'
const app = getApp()
Page({
  data: {
    list: []
  },
  deleteTodoItem: function(e) {
    let index = app.globalData.todoList.findIndex(i => i.id === Number(e.target.id))
    app.globalData.todoList.splice(index, 1)
    wx.setStorageSync('todoList', app.globalData.todoList)
    this.updateList()
  },
  onShow: function() {
    this.updateList()
  },
  updateList() {
    let completedList = app.globalData.todoList.filter(i => i.archive)
    this.setData({
      list: completedList.map(i => {
        i.completedTimeText = formatTime(new Date(i.completedTime))
        return i
      })
    })
  }
})