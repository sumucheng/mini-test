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
        completed: true,
        archive: false,
        reset: _.neq('每天')
      })
      .update({
        data: {
          archive: true
        }
      })
  } catch (e) {
    console.error(e)
  }
}