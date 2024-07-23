/**
  by ppg
  1282797911@qq.com
  2023.8.26
**/
const eventBus = {
 
  post: function ({ // 发送事件
    params: params, // 事件参数
    event: event // 事件名称
  }) {
    for (var eventMap of _map) {
      for (var obj of eventMap[1]) {
        if (obj[0] == event) {
          obj[1](params)
        }
      }
    }
  },
 
  off: function ({ // 移除使用该key添加的所有监听事件
    key: key, // key，通过newKey()获取
  }) {
    _map.delete(key)
  },
 
  /**
   * {
   *  'key': {
   *    'event': listener
   *  }
   * }
   * **/
  on: function ({ // 开始监听event事件
    key: key, // key，通过newKey()获取
    event: event, // 事件名称
    listener: listener // 回调
  }) {
    var eventMap = _map.get(key)
    if (eventMap == null) {
      eventMap = new Map()
      _map.set(key, eventMap)
    }
    eventMap.set(event, listener)
  },
 
  newKey: function (params) { // 获取key
    _key ++
    return _key
  }
 
}
 
var _key = -1 // 根key
const _map = new Map() // 储存key和监听的关联数组
 
module.exports = {
  eventBus
}