// components/header/header.js
import {
  formatTime2
} from '../../utils/util.js'
Component({
  data: {
    today: formatTime2(new Date()),
  }
})