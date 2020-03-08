// pages/test/test.js
import {
  createId
} from '../../utils/util.js'
const app = getApp()

Page({
  data: {
    selectedTag: '',
    todoListByTag: [],
    percentText: '',
    percent: 0,
    boxY: 0,
    display: {
      addTodoItem: false,
      addTag: false,
      more: false
    },
  },
  comfirmAddTodo: function(e) {
    app.globalData.todoList.unshift({
      tag: this.data.selectedTag,
      id: createId(),
      value: e.detail,
      completed: false,
      time: new Date(),
      completedTime: null
    })
    this.updateTodoList()
    wx.setStorageSync('todoList', app.globalData.todoList)
    this.hideView()
  },
  comfirmAddTag: function(e) {
    app.globalData.tags.push(e.detail)
    wx.setStorageSync('tags', app.globalData.tags)
    this.hideView()
    this.setData({
      todoListByTag: [...this.data.todoListByTag, {
        tag: e.detail,
        data: []
      }]
    })
  },
  addTodoItem: function(e) {
    this.displayView('addTodoItem')
    this.setData({
      selectedTag: e.target.id
    })
  },
  addTag: function(e) {
    this.displayView('addTag')
  },
  more: function(e) {
    this.displayView('more')
    this.setData({
      boxY: e.detail.y,
      selectedTag: e.currentTarget.id
    })
  },
  deleteTag: function(e) {
    const selectedTag = this.data.selectedTag
    let index = app.globalData.tags.findIndex(i => i === selectedTag)
    app.globalData.tags.splice(index, 1)
    wx.setStorageSync('tags', app.globalData.tags)
    app.globalData.todoList = app.globalData.todoList.filter(
      i => (i.tag !== selectedTag) || (i.tag === selectedTag && i.archive)
    )
    wx.setStorageSync('todoList', app.globalData.todoList)
    this.updateTodoList()
    this.hideView()
  },

  archiveTodo: function(e) {
    app.globalData.todoList = app.globalData.todoList.map(i => {
      if (i.archive) return i
      i.archive = (i.completed && i.tag === this.data.selectedTag)
      return i
    })
    wx.setStorageSync('todoList', app.globalData.todoList)
    this.updateTodoList()
    this.hideView()
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

  // helper
  updateTodoList: function() {
    let todoList = app.globalData.todoList.filter(i => !i.archive)
    let completedTodos = todoList.filter(i => i.completed)
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
      percent: completedTodos.length / todoList.length * 100
    })
  },
  displayView: function(string) {
    this.data.display[string] = true
    this.setData({
      display: this.data.display
    })
  },
  hideView: function() {
    this.setData({
      display: {
        addTodoItem: false,
        addTag: false,
        more: false
      },
      tag: '',
    })
  }
})