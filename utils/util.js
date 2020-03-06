const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
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
  return ['日常', '购物清单']
}
const initTodoList = () => {
  return [{
      tag: '日常',
      id: -1,
      value: '取快递',
      completed: false,
      time: new Date(),
      completedTime: null
    },
    {
      tag: '日常',
      id: -2,
      value: '买早饭',
      completed: false,
      time: new Date(),
      completedTime: null
    },
    {
      tag: '购物清单',
      id: -3,
      value: '鸡蛋',
      completed: false,
      time: new Date(),
      completedTime: null
    }
    ,
    {
      tag: '购物清单',
      id: -4,
      value: '已完成',
      completed: true,
      time: new Date(2020,0,0),
      completedTime: new Date(2020, 0, 0)
    }
  ]
}

export {
  formatTime,
  createId,
  initTodoList,
  initTags
}