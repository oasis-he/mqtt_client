/**
 * Created by Administrator on 2017/6/27/027.
 */
// 加密库
const cryptoJS = require('crypto-js')

// GroupID, 在阿里云控制台申请
const groupId = 'GID_DEV_DEVICE'
// 阿里云账号的 AccessKey, 在阿里云控制台查看
const accessKey = 'oY81Hxomf768CCEO'
// 阿里云账号的 SecretKey, 在阿里云控制台查看
const secretKey = '42Ru8MO5Mt8qopVeeJ3bDiIwlKemUC'

module.exports = {
  // 设置接入域名, 在阿里云控制台申请
  host: 'ws://mqtt-cn-v0h04z5wr03.mqtt.aliyuncs.com',
  // 端口
  port: 80,
  // 协议 ID
  protocolId: 'MQTT',
  // 协议版本, 4 = 3.1.1
  protocolVersion: 4,
  // 清理会话标志
  clean: true,
  // 连接超时时间, 60 秒
  connectTimeout: 60 * 1000,
  // 重连间隔时间, 3 秒
  reconnectPeriod: 10 * 1000,
  // GroupID, 在阿里云控制台申请
  groupId: groupId,
  // GroupId@@@DeviceId，在阿里云控制台申请的 GroupID 和自定义 DeviceID 组合构成
  clientId: `${groupId}@@@Virtual_Device`,
  // 用户名
  username: accessKey,
  // 密码
  password: cryptoJS.HmacSHA1(groupId, secretKey).toString(cryptoJS.enc.Base64),
}
