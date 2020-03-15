// pages/completed/completed.js

const db = wx.cloud.database()
Page({
  data: {
    list: [],
    watchList: null
  },
  deleteTodoItem: function(e) {
    db.collection('todoList').doc(e.currentTarget.id).remove()
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
            if(snapshot.docs.length===0) this.setData({
              list:null
            })
          },
          onError: err => console.error(err)
        })
    })
  }
})