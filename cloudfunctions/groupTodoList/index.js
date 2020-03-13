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
    return await db.collection('todoList').aggregate()
      .lookup({
        from: 'tags',
        localField: 'tag',
        foreignField: 'name',
        as: 'todoByTag',
      })
  } catch (e) {
    console.error(e)
  }
}