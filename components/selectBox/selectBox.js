// components/selectBox/selectBox.js
Component({

  properties: {
    range: {
      type: Array,
      value: []
    },
    visible: {
      type: Boolean,
      value: false
    },
    boxY:{
      type:Number,
      value:0
    }
  },
  methods: {
    cancel: function () {
      this.triggerEvent('cancel')
    },
    editTag:function(e){
      this.triggerEvent('edittag', e.currentTarget.id)
    },
    deleteTag:function(e){
      this.triggerEvent('deletetag', e.currentTarget.id)
    }
  }
})