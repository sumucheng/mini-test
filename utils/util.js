const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute].map(formatNumber).join(':') + ' 完成'
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const createId = () => {
  let id = wx.getStorageSync('maxId') || 0
  id += 1
  wx.setStorageSync("maxId", id)
  return id
}
const initTags = () => {
  return ['点击右侧的 + 号可添加待办', '标签2号']
}

const initTodoList = () => {
  return [{
      tag: '点击右侧的 + 号可添加待办',
      id: -1,
      value: '点击完成待办',
      completed: false,
      time: new Date(),
      completedTime: null
    },
    {
      tag: '点击右侧的 + 号可添加待办',
      id: -2,
      value: '完成的待办会在第二天自动归档',
      completed: false,
      time: new Date(),
      completedTime: null
    },
    {
      tag: '点击右侧的 + 号可添加待办',
      id: -3,
      value: '也可以点击 ··· 手动归档',
      completed: false,
      time: new Date(),
      completedTime: null
    },
    {
      tag: '标签2号',
      id: -4,
      value: '点击下方的 + 号可新增标签',
      completed: false,
      time: new Date(),
      completedTime: null
    }
  ]
}
export {
  formatTime,
  createId,
  initTodoList,
  initTags
}