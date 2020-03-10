// pages/test/test.js
import {
  createId
} from '../../utils/util.js'

const db = wx.cloud.database()
Page({
  data: {
    selectedTag: '',
    todoList: [],
    tags: [],
    todoListByTag: [],
    percentText: '',
    percent: 0,
    display: {
      addTodoItem: false,
      addTag: false
    },
    tooltipShow: false
  },

  comfirmAddTodo: function(e) {
    db.collection('todoList').add({
      data: {
        tag: this.data.selectedTag,
        id: createId(),
        value: e.detail,
        completed: false,
        time: new Date(),
        completedTime: null,
        archive: false
      },
      success: res => {
        this.onQuery()
      }
    })
    this.updateTodoList()
    this.hideView()
  },
  comfirmAddTag: function(e) {
    if (this.data.tags.find(i => i.name === e.detail)) {
      wx.showModal({
        content: '标签名重复',
        showCancel: false
      })
      return
    }
    db.collection('tags').add({
      data: {
        name: e.detail
      }
    })
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
    let self = this
    wx.showActionSheet({
      itemList: ['归档已完成的待办', '删除标签'],
      success(res) {
        if (res.tapIndex === 0) self.archiveTodo()
        else if (res.tapIndex === 1) self.deleteTag()
      },
    })

    this.setData({
      selectedTag: e.currentTarget.id
    })
  },

  deleteTag: function(e) {
    // let self = this
    // wx.showModal({
    //   title: '提示',
    //   content: '该标签下所有的待办也会随之删除，是否确认删除？',
    //   success(res) {
    //     if (res.confirm) {
    //       const selectedTag = self.data.selectedTag
    //       let index = app.globalData.tags.findIndex(i => i === selectedTag)
    //       app.globalData.tags.splice(index, 1)
    //       wx.setStorageSync('tags', app.globalData.tags)
    //       app.globalData.todoList = app.globalData.todoList.filter(
    //         i => (i.tag !== selectedTag) || (i.tag === selectedTag && i.archive)
    //       )
    //       wx.setStorageSync('todoList', app.globalData.todoList)
    //       self.updateTodoList()
    //       self.hideView()
    //     } else self.hideView()
    //   }
    // })
  },

  archiveTodo: function(e) {
    const newList = this.data.todoList.map(i => {
      if (i.archive) return i
      if (i.completed && i.tag === this.data.selectedTag){
        i.archive = true
        db.collection('todoList').doc(i._id).update({
          data: {
            archive: true
          }
        })
        return i
      }
      return i
    })
    this.setData({
      todoList: newList
    })
    this.updateTodoList()
    this.hideView()
  },

  toggle: function(e) {
    const str = e.currentTarget.id.split('+')
    const id = str[0]
    const completed = str[1]
    let todo = this.data.todoList.find(i => i._id === id)
    todo.completedTime = todo.completed ? null : new Date()
    todo.completed = !todo.completed
    this.updateTodoList()

    db.collection('todoList').doc(id).update({
      data: {
        completedTime: todo.completedTime,
        completed: todo.completed
      }
    })
  },
  onLoad: function(options) {
    this.onQuery()
  },
  onHide: function() {
   
  },

  // helper
  updateTodoList: function() {
    let todoList = this.data.todoList.filter(i=>!i.archive)
    let tags = this.data.tags
    let completedTodos = todoList.filter(i => i.completed)
    let result = []
    for (let tag of tags) {
      result.push({
        tag: tag.name,
        data: todoList.filter(i => i.tag === tag.name)
      })
    }
    this.setData({
      todoListByTag: result,
      percentText: completedTodos.length + ' / ' + todoList.length,
      percent: completedTodos.length / todoList.length * 100
    })
  },
  displayView: function(string) {
    wx.hideTabBar({})
    this.data.display[string] = true
    this.setData({
      display: this.data.display
    })
  },
  hideView: function() {
    wx.showTabBar({})
    this.setData({
      display: {
        addTodoItem: false,
        addTag: false,
      },
    })
  },
  onQuery: function() {
    Promise.all([
      db.collection('tags').get(),
      db.collection('todoList').where({
        archive: false
      }).get()
    ]).then(res => {
      this.setData({
        tags: res[0].data,
        todoList: res[1].data,
      })
      this.updateTodoList()
    })
  }
})