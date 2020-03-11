// components/progress.js
const db = wx.cloud.database()
Component({
  data: {
    percentText: '',
    percent: 0,
    wather: null
  },
  created: function() {
    this.setData({
      watcher: db.collection('todoList').where({
        archive: false
      }).watch({
        onChange: snapshot => {
          const all = snapshot.docs.length
          const completed = snapshot.docs.filter(i => i.completed).length
          this.setData({
            percentText: completed + ' / ' + all,
            percent: completed / all * 100
          })
        },
        onError: err => console.error(err)
      })
    })
  },
  detached: function() {
    this.data.watcher.close()
    this.setData({
      watcher: null
    })
  }
})