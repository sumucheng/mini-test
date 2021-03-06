const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute].map(formatNumber).join(':') + ' 完成'
}

const formatTime2 = date => {
  const oneWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  const oneYear = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  const month = date.getMonth() + 1
  const day = (date.getMonth() + 1) + '月' + date.getDate() + '日'
  const year = date.getFullYear() + '年'
  return {
    day,
    year
  }
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const initTags = () => {
  return ['点击右侧的 + 号可添加待办', '标签2号']
}

const initTodoList = () => {
  return [{
      tag: '点击右侧的 + 号可添加待办',
      value: '点击完成待办',
      completed: false,
      time: new Date(),
      archive: false
    },
     {
      tag: '点击右侧的 + 号可添加待办',
      value: '左滑可编辑 / 删除待办',
      completed: false,
      time: new Date(),
      archive: false
    },
    {
      tag: '点击右侧的 + 号可添加待办',
      value: '完成的待办会在第二天自动归档',
      completed: false,
      time: new Date(),
      archive: false
    },
    {
      tag: '点击右侧的 + 号可添加待办',
      value: '也可以点击 ··· 手动归档',
      completed: false,
      time: new Date(),
      archive: false
    },
    {
      tag: '标签2号',
      value: '点击下方的 + 号可新增标签',
      completed: false,
      time: new Date(),
      archive: false
    }
  ]
}
export {
  formatTime,
  formatTime2,
  initTodoList,
  initTags
}