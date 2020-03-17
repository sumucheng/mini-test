// components/addTodoItem/addTodoItem.js
const app = getApp()
const db = wx.cloud.database()
Component({
  behaviors: [],
  properties: {
    dialog: {
      type: Object,
      value: {}
    }
  },
  data: {
    array: ['从不', '每天'],
    index: 0
  },

  ready: function(e) {
    let index = this.data.array.findIndex(i => i === this.data.dialog.reset)
    if (index === -1) index = 0
    this.setData({
      index: index
    })
  },
  methods: {
    bindPickerChange: function(e) {
      this.setData({
        index: e.detail.value
      })
    },
    confirm: function() {
      const dialog = this.data.dialog
      if (!dialog.value || dialog.value && dialog.value.trim() === '') {
        wx.showModal({
          content: '名称不能为空',
          showCancel: false
        })
      } else if (dialog.value.trim().length > 15) {
        wx.showModal({
          content: '名称长度不能超过15',
          showCancel: false
        })
      } else this.triggerEvent('confirm', {
        value: dialog.value.trim(),
        reset: this.data.array[this.data.index]
      })
    },
    cancel: function() {
      wx.hideKeyboard()
      this.triggerEvent('cancel')
    },
    watchValue(e) {
      this.setData({
        "dialog.value": e.detail.value
      })
    },
    catchTouchmove(e) {
      return
    }
  }
})