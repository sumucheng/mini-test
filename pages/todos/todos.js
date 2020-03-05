// pages/test/test.js
import {
  createId
} from '../../utils/util.js'
const app = getApp()

Page({
  data: {
    newTodo: '',
    processingTodoList: [],
  },
  handleConfirm: function(e) {
    if(e.detail.value.trim()==='') return 
    app.globalData.todoList.unshift({
      id: createId(),
      value: e.detail.value.trim(),
      completed: false
    })
    this.setData({
      newTodo: '',
    })
    this.saveList()
  },
  handleComplete: function(e) {
    app.globalData.todoList.find(i => i.id === Number(e.target.id)).completed = true
    this.saveList()
  },
  saveList: function() {
    this.setData({
      processingTodoList: app.globalData.todoList.filter(i => i.completed === false)
    })
    wx.setStorageSync('todoList', app.globalData.todoList)
  },
  onLoad: function(options) {
    this.setData({
      processingTodoList: app.globalData.todoList.filter(i => i.completed === false)
    })
  }
})