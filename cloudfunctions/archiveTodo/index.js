// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  traceUser: true,
  env: 'mini-todo-biumr'
})
const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async(event, context) => {
  const wxContext = cloud.getWXContext()
  try {
    return await db.collection('todoList').where({
        tag: event.tag,
        completed: true,
        archive: false,
        _openid: wxContext.OPENID
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