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
      archive: false
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
          db.collection('tags').doc(this.data.tags.find(i => i.name === selectedTag)._id).remove()
          wx.cloud.callFunction({
            name: 'deleteTodos',
            data: {
              tag: selectedTag
            },
            fail: console.error
          })
        }
        this.hideView()
      }
    })
  },

  archiveTodo: function(e) {
    wx.cloud.callFunction({
      name: 'archiveTodo',
      data: {
        tag: this.data.selectedTag
      },
      fail: console.error
    })
    this.hideView()
  },

  toggle: function(e) {
    const str = e.currentTarget.id.split('+')
    const _id = str[0]
    const completed = str[1]
    db.collection('todoList').doc(_id).update({
      data: {
        completedTimeText: completed === 'true' ? null : formatTime(new Date()),
        completedTime: completed === 'true' ? null : new Date(),
        completed: completed !== 'true'
      }
    })
  },

  onLoad: function(options) {
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
    })
    this.setData({
      wacthTodoList: db.collection('todoList')
        .where({
          archive: false
        })
        .watch({
          onChange: snapshot => {
            this.setData({
              todoList: snapshot.docs
            })
            this.updateTodoList()
          },
          onError: err => console.error(err)
        }),
      watchTags: db.collection('tags')
        .watch({
          onChange: snapshot => {
            this.setData({
              tags: snapshot.docs
            })
            this.updateTodoList()
          },
          onError: err => console.error(err)
        })
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

  updateTodoList: function() {
    let result = []
    for (let tag of this.data.tags) {
      result.push({
        tag: tag.name,
        data: this.data.todoList.filter(i => i.tag === tag.name)
      })
    }
    this.setData({
      todoListByTag: result,
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
      }
    })
  }
})