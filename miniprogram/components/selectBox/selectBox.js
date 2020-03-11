// components/selectBox/selectBox.js
Component({

  properties: {
    // range: {
    //   type: Array,
    //   value: []
    // },
    visible: {
      type: Boolean,
      value: false
    },
    boxY: {
      type: Number,
      value: 0
    }
  },
  data: {
    range: [{
        text: '归档已完成的待办',
        method: 'archiveTodo'
      },
      {
        text: '删除标签',
        method: 'deleteTag'
      }
    ],
  },
  methods: {
    cancel: function() {
      this.triggerEvent('cancel')
    },
    archiveTodo: function(e) {
      this.triggerEvent('archivetodo', e.currentTarget.id)
    },
    deleteTag: function(e) {
      this.triggerEvent('deletetag', e.currentTarget.id)
    }
  }
})