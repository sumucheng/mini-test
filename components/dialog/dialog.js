// components/addTodoItem/addTodoItem.js
Component({

  behaviors: [],

  properties: {
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
    value: ''
  },

  methods: {
    confirm: function() {
      if (this.data.value.trim() === '') return
      this.triggerEvent('confirm', this.data.value.trim())
      this.setData({
        value: ''
      })
    },
    cancel: function() {
      this.triggerEvent('cancel')
    },
    watchValue(e) {
      this.setData({
        value: e.detail.value
      })
    }
  }
})