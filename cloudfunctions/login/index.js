const cloud = require('wx-server-sdk')

cloud.init({
  traceUser: true,
  env: 'mini-todo-biumr'
})
const db = cloud.database()
/**
 * 这个示例将经自动鉴权过的小程序用户 openid 返回给小程序端
 * 
 * event 参数包含小程序端调用传入的 data
 * 
 */

exports.main = (event, context) => {
  // 获取 WX Context (微信调用上下文)，包括 OPENID、APPID、及 UNIONID（需满足 UNIONID 获取条件）等信息
  const wxContext = cloud.getWXContext()
  return db.collection('user').where({
    _id: wxContext.OPENID
  }).get()
}