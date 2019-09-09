export function depthForEach(arr, resultArr = []) {
  arr.forEach(item => {
    if (item.children) {
      if (item.component) {
        resultArr.push({
          path: item.path,
          component: item.component,
          name: item.name
        })
      }
      depthForEach(item.children, resultArr)
    } else if (item.component) {
      resultArr.push({
        path: item.path,
        component: item.component,
        name: item.name
      })
    }
  })

  return resultArr;
}

export function deepExistMenu(menu, deepExist) {
  let arr = [], index = 0;
  if (!Array.isArray(menu)) {
    return arr
  }
  for (let i = 0; i < deepExist.length; i++) {
    for (let j = 0; j < menu.length; j++) {
      if (deepExist[i].must) {
        arr[index] = deepExist[i];
        index++;
        break;
      } else if (deepExist[i].path === menu[j].path) {
        arr[index] = deepExist[i]
        if (deepExist[i].children && deepExist[i].children.length > 0) {
          arr[index].children = deepExistMenu(menu[j].children, deepExist[i].children)
        } else {
          arr[index].children = []
        }
        index++
      }

    }
  }
  return arr
}


export function depthForEachIndex(arr, resultArr = []) {
  arr.forEach(item => {
    if (item.indexName) {
      resultArr.push({
        name: item.indexName,
        path: item.path,
        icon: item.indexIcon
      })
    }
    if (item.children && item.children.some(v => v.indexName)) {
      depthForEachIndex(item.children, resultArr)
    }
  })

  return resultArr
}



export function depthForEachCascader(deepExist) {
  let arr = []
  if (!Array.isArray(deepExist)) {
    return arr
  }
  for (let i = 0; i < deepExist.length; i++) {
    arr[i] = {};
    arr[i].value = deepExist[i].currentCode;
    arr[i].label = deepExist[i].text;
    if (deepExist[i].children && deepExist[i].children.length > 0) {
      arr[i].children = depthForEachCascader(deepExist[i].children)
    }
  }
  return arr;
}

export function transFnc(data) {
  let ret = ''
  for (const it in data) {
    ret += it + '=' + data[it] + '&'
  }
  ret = ret.substring(0, ret.lastIndexOf('&'))
  return ret
}
