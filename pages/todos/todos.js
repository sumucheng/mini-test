// pages/test/test.js
import {
  createId
} from '../../utils/util.js'
const app = getApp()

Page({
  data: {
    tag: '',
    todoListByTag: [],
    percentText:'',
    percent: 0,
    displayAddTodoItem: false,
    displayAddTag: false
  },
  comfirmAddTodo: function(e) {
    app.globalData.todoList.unshift({
      tag: this.data.tag,
      id: createId(),
      value: e.detail,
      completed: false,
      time: new Date(),
      completedTime: null
    })
    this.updateTodoList()
    wx.setStorageSync('todoList', app.globalData.todoList)
    this.setData({
      displayAddTodoItem: false
    })
  },
  cancelAddTodo: function(e) {
    this.setData({
      displayAddTodoItem: false
    })
  },
  comfirmAddTag: function(e) {
    app.globalData.tags.push(e.detail)
    wx.setStorageSync('tags', app.globalData.tags)
    this.setData({
      displayAddTag: false,
      todoListByTag: [...this.data.todoListByTag, {
        tag: e.detail,
        data: []
      }]
    })
  },
  cancelAddTag: function(e) {
    this.setData({
      displayAddTag: false
    })
  },
  addTodoItem: function(e) {
    this.setData({
      displayAddTodoItem: true,
      tag: e.target.id
    })
  },
  addTag: function(e) {
    this.setData({
      displayAddTag: true,
    })
  },

  toggle: function(e) {
    let item = app.globalData.todoList.find(i => i.id === Number(e.currentTarget.id))
    if (item.completed) {
      item.completed = false
      item.completedTime = null
    } else {
      item.completed = true
      item.completedTime = new Date()
    }
    this.updateTodoList()
    wx.setStorageSync('todoList', app.globalData.todoList)
  },
  onLoad: function(options) {
    this.updateTodoList()
  },

  updateTodoList: function() {
    let todoList = app.globalData.todoList.filter(
      i => (!i.completed) || (i.completed && new Date(i.completedTime).getDate() === new Date().getDate())
    )
    let completedTodos=todoList.filter(i=>i.completed)
    let result = []
    for (let tag of app.globalData.tags) {
      result.push({
        tag: tag,
        data: todoList.filter(i => i.tag === tag)
      })
    }
    this.setData({
      todoListByTag: result,
      percentText: completedTodos.length + ' / ' + todoList.length,
      percent:completedTodos.length/todoList.length*100
    })
  }
})