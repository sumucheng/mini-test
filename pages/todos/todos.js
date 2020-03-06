// pages/test/test.js
import {
  createId
} from '../../utils/util.js'
const app = getApp()

Page({
  data: {
    tag: '',
    todoListByTag: [],
    displayAddTodoItem: false,
    displayAddTag: false
  },
  comfirm: function(e) {
    app.globalData.todoList.unshift({
      tag: this.data.tag,
      id: createId(),
      value: e.detail,
      completed: false
    })
    this.updateTodoList()
    wx.setStorageSync('todoList', app.globalData.todoList)
    this.setData({
      displayAddTodoItem: false
    })
  },
  cancel: function(e) {
    this.setData({
      displayAddTodoItem: false
    })
  },

  addTodoItem: function(e) {
    this.setData({
      displayAddTodoItem: true,
      tag: e.target.id
    })
  },

  handleComplete: function(e) {
    app.globalData.todoList.find(i => i.id === Number(e.target.id)).completed = true
    wx.setStorageSync('todoList', app.globalData.todoList)
  },
  onLoad: function(options) {
    this.updateTodoList()
  },
  updateTodoList: function() {
    const todoList = app.globalData.todoList
    let hash = {}
    for (let i of todoList) {
      if (i.tag in hash) hash[i.tag].unshift(i)
      else hash[i.tag] = [i]
    }
    let result = []
    for (let tag in hash) {
      result.push({
        tag: tag,
        data: hash[tag]
      })
    }
    this.setData({
      todoListByTag: result
    })
  }
})