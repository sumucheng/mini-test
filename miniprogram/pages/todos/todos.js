import {
  formatTime,
  initTodoList,
  initTags
} from '../../utils/util.js'
const db = wx.cloud.database()
const app = getApp()

Page({
  data: {
    selectedTag: '',
    todoList: [],
    tags: [],
    todoListByTag: [],
    slideShow: '',
    displayDialog: null,
    dialogs: {
      addTodo: {
        headerText: '新增待办',
        placeholder: '待办名称',
        handleConfirm: "confirmAddTodo",
        handleCancel: "hideView",
        extra: true
      },
      addTag: {
        headerText: '新增标签',
        placeholder: '标签名称',
        handleConfirm: "confirmAddTag",
        handleCancel: "hideView"
      },
      editTodo: {
        headerText: '编辑待办',
        placeholder: '待办名称',
        handleConfirm: "confirmUpdateTodo",
        handleCancel: "hideView",
        extra: true
      },
      editTag: {
        headerText: '编辑标签',
        placeholder: '标签名称',
        handleConfirm: "confirmUpdateTag",
        handleCancel: "hideView"
      }
    },
    wacthTodoList: null,
    watchTags: null,
    slideButtons: [{
      text: '编辑',
      src: "../../static/icon/edit.png"
    }, {
      text: '删除',
      src: "../../static/icon/delete-red.png"
    }]
  },
  slideShow(e) {
    this.setData({
      slideShow: e.currentTarget.dataset.id
    })
  },
  slideButtonTap(e) {
    const x = e.currentTarget.id.split('+')
    const _id = x[0]
    const value = x[1]
    const reset = x[2]

    if (e.detail.index === 0) {
      this.displayView('editTodo')
      this.setData({
        "dialogs.editTodo.value": value,
        "dialogs.editTodo._id": _id,
        "dialogs.editTodo.reset": reset
      })
    } else {
      db.collection('todoList').doc(_id).remove()
    }
  },
  confirmAddTodo: function(e) {
    const newTodo = {
      tag: this.data.selectedTag,
      value: e.detail.value,
      reset: e.detail.reset,
      completed: false,
      time: new Date(),
      archive: false
    }
    db.collection('todoList').add({
      data: newTodo
    })
    this.hideView()
  },
  confirmUpdateTodo: function(e) {
    db.collection('todoList').doc(this.data.dialogs.editTodo._id).update({
      data: {
        value: e.detail.value,
        reset: e.detail.reset
      }
    })
    this.hideView()
  },
  confirmUpdateTag: function(e) {
    wx.cloud.callFunction({
      name: 'editTag',
      data: {
        tag: this.data.dialogs.editTag.value,
        newName: e.detail.value
      },
      success: () => this.updateTodoList(),
      fail: console.error
    })
    this.hideView()
  },
  confirmAddTag: function(e) {
    const name = e.detail.value
    if (this.data.tags.find(i => i.name === name)) {
      wx.showModal({
        content: '标签名重复',
        showCancel: false
      })
      return
    }
    db.collection('tags').add({
      data: {
        name: name
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
            }
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
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        if (res.result.data.length === 0) {
          wx.cloud.callFunction({
            name: "addUser",
            data: {}
          })
          const initList = initTodoList()
          for (let i of initList) {
            db.collection('todoList').add({
              data: i
            })
          }
          const tags = initTags()
          for (let i of tags) {
            db.collection('tags').add({
              data: {
                name: i
              }
            })
          }
        } else {
          Promise.all([
              db.collection('tags').get(),
              db.collection('todoList').where({
                archive: false
              }).get()
            ])
            .then(res => {
              this.setData({
                tags: res[0].data,
                todoList: res[1].data,
              })
            })
        }
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
      }
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
            if (!(snapshot.docChanges[0].dataType === 'update' && 'tag' in snapshot.docChanges[0].updatedFields))
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
            if (!(snapshot.docChanges[0].dataType === 'update'))
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
  onHide(){
    this.setData({
      slideShow: null
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
      itemList: ['归档已完成的待办', '编辑标签', '删除标签'],
      success: res => {
        if (res.tapIndex === 0) this.archiveTodo()
        else if (res.tapIndex === 1) {
          this.displayView('editTag')
          this.setData({
            "dialogs.editTag.value": e.currentTarget.id
          })
        } else this.deleteTag()
      },
      fail: res => console.log(res.errMsg)
    })
    this.setData({
      selectedTag: e.currentTarget.id
    })
  },
  addTodo: function(e) {
    this.displayView('addTodo')
    this.setData({
      selectedTag: e.currentTarget.id
    })
  },
  addTag: function(e) {
    this.displayView('addTag')
  },

  displayView: function(string) {
    wx.hideTabBar()
    this.setData({
      displayDialog: string
    })
  },
  hideView: function() {
    wx.showTabBar()
    this.setData({
      displayDialog: null
    })
  }
})