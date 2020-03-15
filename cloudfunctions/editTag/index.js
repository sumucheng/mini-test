const cloud = require('wx-server-sdk')
cloud.init({
  traceUser: true,
  env: 'mini-todo-biumr'
})
const db = cloud.database()
const $ = db.command.aggregate
// 云函数入口函数
exports.main = async(event, context) => {
  try {
    return await db.collection('tag').where({
        name: event.value
      })
      .update({
        data: {
          name: event.newName
        }
      })
  } catch (e) {
    console.error(e)
  }
}