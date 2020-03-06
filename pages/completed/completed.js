// pages/completed/completed.js
import {formatTime} from '../../utils/util.js'
const app = getApp()
Page({
  data: {
    list:[]
  },

  onLoad: function (options) {
    this.setData({
      list: app.globalData.todoList.filter(
        i =>  i.completed && new Date(i.completedTime).getDate() !== new Date().getDate()
      )
    })
  }
})