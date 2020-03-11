import {
  createId,
  formatTime
} from '../../utils/util.js'
const db = wx.cloud.database()
Page({
  data: {
    selectedTag: '',
    todoList: [],
    tags: [],
    todoListByTag: [],
    display: {
      addTodoItem: false,
      addTag: false
    },
    wacthTodoList: null,
    watchTags: null
  },

  comfirmAddTodo: function(e) {
    const newTodo = {
      tag: this.data.selectedTag,
      value: e.detail,
      completed: false,
      time: new Date(),
      archive: false,
      // id: Math.random()
    }
    db.collection('todoList').add({
      data: newTodo
    })
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
      // ,
      // success: res => {
      //   this.data.tags.find(i => i.name === e.detail)._id = res._id
      //   this.setData({
      //     tags: this.data.tags
      //   })
      // }
    })
    this.setData({
      todoListByTag: [...this.data.todoListByTag, {
        tag: e.detail,
        data: []
      }],
      // tags: [...this.data.tags, {
      //   _id: null,
      //   name: e.detail
      // }]
    })
    this.hideView()
  },

  deleteTag: function(e) {
    wx.showModal({
      title: '提示',
      content: '该标签下所有的待办也会随之删除，是否确认删除？',
      success: res => {
        if (res.confirm) {
          const selectedTag = this.data.selectedTag
          let index = this.data.tags.findIndex(i => i.name === selectedTag)
          db.collection('tags').doc(this.data.tags[index]._id).remove()
          wx.cloud.callFunction({
            name: 'deleteTodos',
            data: {
              tag: selectedTag
            },
            fail: console.error
          })
          this.data.tags.splice(index, 1)
          this.setData({
            todoList: this.data.todoList.filter(i => i.tag !== selectedTag),
            tags: this.data.tags
          })
          this.updateTodoList()
        }
        this.hideView()
      }
    })
  },

  archiveTodo: function(e) {
    let list = this.data.todoList.map(i => {
      if (i.completed && !i.archive && i.tag === this.data.selectedTag) {
        i.archive = true
      }
      return i
    })
    wx.cloud.callFunction({
      name: 'archiveTodo',
      data: {
        tag: selectedTag
      },
      fail: console.error
    })
    this.setData({
      todoList: list
    })
    this.updateTodoList()
    this.hideView()
  },

  toggle: function(e) {
    const str = e.currentTarget.id.split('+')
    const id = Number(str[0])
    const completed = str[1]
    let todo = this.data.todoList.find(i => i.id === id)
    todo.completedTime = todo.completed ? null : new Date()
    todo.completedTimeText = todo.completed ? null : formatTime(new Date())
    todo.completed = !todo.completed

    this.setData({
      todoList: this.data.todoList
    })
    this.updateTodoList()
    wx.cloud.callFunction({
      name: 'toggle',
      data: {
        id: id,
        completedTime: todo.completedTime,
        completed: todo.completed,
        completedTimeText: todo.completedTimeText
      },
      fail: console.error
    })
    // db.collection('todoList').doc(id).update({
    //   data: {
    //     completedTime: todo.completedTime,
    //     completed: todo.completed
    //   }
    // })
  },
  onLoad: function(options) {
    this.onQuery()
    const watcher = db.collection('todoList')
      .where({
        archive: false
      })
      .watch({
        onChange: snapshot => {
          console.log(1)
          this.setData({
            todoList: snapshot.docs
          })
          this.updateTodoList()
        },
        onError: err => console.error(err)
      })
    const watcher2 = db.collection('tags')
      .watch({
        onChange: snapshot => {
          this.setData({
            tags: snapshot.docs
          })
          this.updateTodoList()
        },
        onError: err => console.error(err)

      })
    this.setData({
      wacthTodoList: watcher,
      watchTags: watcher2
    })
  },

  onUnload() {
    this.data.wacthTodoList.close()
    this.data.watchTags.close()
    this.setData({
      wacthTodoList: null,
      watchTags: null
    })
  },


  // helper
  updateTodoList: function() {
    let todoList = this.data.todoList.filter(i => !i.archive)
    let tags = this.data.tags
    let result = []
    for (let tag of tags) {
      result.push({
        tag: tag.name,
        data: todoList.filter(i => i.tag === tag.name)
      })
    }
    this.setData({
      todoListByTag: result,
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
  },
  // open & close dialog

  more: function(e) {
    wx.showActionSheet({
      itemList: ['归档已完成的待办', '删除标签'],
      success: res => {
        if (res.tapIndex === 0) this.archiveTodo()
        else this.deleteTag()
      },
      fail: res => console.log(res.errMsg)
    })
    this.setData({
      selectedTag: e.currentTarget.id
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
  displayView: function(string) {
    wx.hideTabBar()
    this.data.display[string] = true
    this.setData({
      display: this.data.display
    })
  },
  hideView: function() {
    wx.showTabBar()
    this.setData({
      display: {
        addTodoItem: false,
        addTag: false,
      },
    })
  },

})