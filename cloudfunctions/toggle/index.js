// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async(event, context) => {
  try {
    return await db.collection('todoList').where({
        _id: event._id
      })
      .update({
        data: {
          completedTime: event.completedTime,
          completed: event.completed,
          completedTimeText: event.completedTimeText
        },
      })
  } catch (e) {
    console.error(e)
  }
}