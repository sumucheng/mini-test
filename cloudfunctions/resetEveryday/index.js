const cloud = require('wx-server-sdk')
cloud.init({
  traceUser: true,
  env: 'mini-todo-biumr'
})
const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = (event, context) => {
  try {
    db.collection('todoList').where({
        reset: '每天',
        archive: false
      })
      .update({
        data: {
          completed: false,
          completedTime: null,
          completedTimeText: null
        }
      })
  } catch (e) {
    console.error(e)
  }
}