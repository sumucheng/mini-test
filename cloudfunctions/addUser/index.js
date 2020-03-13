const cloud = require('wx-server-sdk')

cloud.init({
  traceUser: true,
  env: 'mini-todo-biumr'
})
const db = cloud.database()
// 云函数入口函数
exports.main = (event, context) => {
  const wxContext = cloud.getWXContext()
  return db.collection('user').add({
    data: {
      _id: wxContext.OPENID
    },
    success: res => console.log(res),
    fail: console.error
  })
}