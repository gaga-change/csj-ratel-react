/**
 * 遍历树叶
 * @param {*} obj 目标对象
 * @param {*} key 子数组键，比如 'children'
 * @param {*} cb 回调，无子项
 */
export const deep = (obj, key, cb) => {
  const _ = obj => {
    let arr = obj[key]
    if (arr && arr.length) {
      for (let i = 0; i < arr.length; i++) {
        let temp = arr[i]
        _(temp)
      }
    } else {
      cb(obj)
    }
  }
  _(obj)
}

/**
 * 查询指定树叶，返回路线
 * @param {*} obj 目标对象
 * @param {*} key 子数组键，比如 'children'
 * @param {*} cb 回调，传递树叶，如果返回true, 则代表寻找到
 */
export const findLeaf = (obj, key, cb) => {
  const _ = (obj, path) => {
    path.push(obj)
    let arr = obj[key]
    if (arr && arr.length) {
      for (let i = 0; i < arr.length; i++) {
        let temp = arr[i]
        return _(temp, path)
      }
    } else {
      if (cb(obj)) return path
    }
  }
  return _(obj, [])
}