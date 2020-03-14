// components/header/header.js
import {
  formatTime2
} from '../../utils/util.js'
Component({

  properties: {

  },

  data: {
    today: formatTime2(new Date()),
  },

  attached: function() {
    console.log(this.data.today)
  },
  methods: {
  }
})