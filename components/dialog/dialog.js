// components/addTodoItem/addTodoItem.js
const app = getApp()
Component({
  behaviors: [],
  properties: {
    headerText: {
      type: String,
      value: ''
    },
    placeholder: {
      type: String,
      value: ''
    },
    visible: {
      type: Boolean,
      value: false
    }
  },

  data: {
    value: '',
  },

  methods: {
    confirm: function() {
      if (this.data.value.trim() === '') {
        wx.showModal({
          content: '名称不能为空',
          showCancel: false
        })
        return
      }
      if (this.data.value.trim().length > 15) {
        wx.showModal({
          content: '名称长度不能超过15',
          showCancel: false
        })
        return
      }
      this.triggerEvent('confirm', this.data.value.trim())
      this.setData({
        value: ''
      })
    },
    cancel: function() {
      this.setData({
        value: ''
      })
      this.triggerEvent('cancel')
    },
    watchValue(e) {
      this.setData({
        value: e.detail.value
      })
    },
    catchTouchmove(e) {
      return
    }
  }
})