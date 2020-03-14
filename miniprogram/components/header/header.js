// components/header/header.js
Component({

  properties: {

  },

  data: {
    today: new Date(),
    month:"",
    week:"",
    day:""
  },

  attached:function(){
    const today=new Date()
    this.setData({
      month: today.getMonth()
      })
  },
  methods: {

  }
})