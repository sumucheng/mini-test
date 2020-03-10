// pages/completed/completed.js
import {
  formatTime
} from '../../utils/util.js'
const db = wx.cloud.database()
Page({
  data: {
    list: []
  },
  deleteTodoItem: function(e) {
    this.setData({
      list: this.data.list.filter(i => i._id !== e.target.id)
    })
    db.collection('todoList').doc(e.target.id).remove()
  },
  onLoad: function() {
    db.collection('todoList').where({
      archive: true
    }).get({
      success: res => {
        this.setData({
          list: res.data.map(i => {
            i.completedTimeText = formatTime(new Date(i.completedTime))
            return i
          })
        })
      }
    })
  }
})