const cloud = require('wx-server-sdk')
cloud.init({
  traceUser: true,
  env: 'mini-todo-biumr'
})
const db = cloud.database()
const $ = db.command.aggregate
// 云函数入口函数
exports.main = async(event, context) => {
  const wxContext = cloud.getWXContext()
  try {
    return await Promise.all([
      db.collection('tags').where({
        name: event.tag,
        _openid: wxContext.OPENID
      })
      .update({
        data: {
          name: event.newName
        }
      }),
      db.collection('todoList').where({
        tag: event.tag,
        archive: false
      }).update({
        data: {
          tag: event.newName
        }
      })
    ])
  } catch (e) {
    console.error(e)
  }
}