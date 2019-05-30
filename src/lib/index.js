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