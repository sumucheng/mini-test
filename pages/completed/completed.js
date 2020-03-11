// pages/completed/completed.js

const db = wx.cloud.database()
Page({
  data: {
    list: [],
    watchList: null
  },
  deleteTodoItem: function(e) {
    // this.setData({
    //   list: this.data.list.filter(i => i._id !== e.target.id)
    // })
    db.collection('todoList').doc(e.target.id).remove()
  },
  onUnload: function() {
    this.data.watchList.close()
    this.setData({
      watchList: null
    })
  },
  onLoad: function() {
    this.setData({
      watchList: db.collection('todoList')
        .where({
          archive: true
        })
        .watch({
          onChange: snapshot => {
            this.setData({
              list: snapshot.docs
            })
          },
          onError: err => console.error(err)
        })
    })
  }
})