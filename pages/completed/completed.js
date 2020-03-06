// pages/completed/completed.js
import {
  formatTime
} from '../../utils/util.js'
const app = getApp()
Page({
  data: {
    list: []
  },

  onLoad: function(options) {
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