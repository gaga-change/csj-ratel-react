/**
 * 
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