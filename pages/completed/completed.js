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
  onLoad: function(options) {
   this.updateList()
  },
  updateList(){
    let completedList = app.globalData.todoList.filter(
      i => i.completed && new Date(i.completedTime).getDate() !== new Date().getDate()
    )
    this.setData({
      list: completedList.map(i => {
        i.completedTime = formatTime(new Date(i.completedTime))
        return i
      })
    })
  }
})