import io from 'socket.io-client'
import { notification } from 'antd'

export function connectSocket(user) {
  /** 发布环境 - 监听版本更新 */
  const userId = user.id + '#' + user.ownerName
  const username = user.nick
  if (process.env.NODE_ENV !== "development") {
    let nowVersion = process.env.IMAGE_TAG
    const roomName = window.location.hostname
    // const roomName = 'tiger.csjmro.com'
    const socket = io('http://csj-center-egg-v2.shop.csj361.com/user', {
      // 实际使用中可以在这里传递参数
      query: {
        room: roomName,
        userId,
        username,
        version: process.env.IMAGE_TAG
      }
    })
    /** 监听版本通知 */
    socket.on('exchange', msg => {
      const { data } = msg
      const { action, payload } = data
      if (action === 'version update' && payload.version) {
        if (nowVersion !== payload.version) {
          nowVersion = payload.version
          update(nowVersion)
        }
      }
    });
    {
      // 发送活跃度
      let tick = null
      let temp = function () {
        tick = setTimeout(() => {
          socket.emit('living')
          tick = null
        }, 1000)
      }
      document.addEventListener('click', (e) => {
        if (tick) {
          return
        } else {
          temp()
        }
      })
    }
    function update(v) {
      notification.info({
        message: '提示',
        description: `当前系统版本更新，刷新页面获取最新内容！当前版本：${process.env.IMAGE_TAG}，最新版本：${v}`,
      });
    }
  }
}
