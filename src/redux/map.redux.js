import * as apiMap from '@publickApi/map';
const SETMAP = 'SETMAP';
export function map(state = { mapSouce: {} }, action) {
  switch (action.type) {
    case SETMAP:
      return { mapSouce: action.mapSouce };
    default:
      return state;
  }
}

export function setMap() {
  return dispatch => {
    config().then(res => {
      dispatch({ type: SETMAP, mapSouce: res })
    }).catch(err => {
    })
  }
}

async function config() {
  let config = {};
  for (let i in apiMap) {
    await apiMap[i]().then(res => {
      if (Array.isArray(res)) {
        config[i] = res
      } else {
        let arr = [];
        for (let prop in res) {
          arr.push({
            key: prop,
            value: res[prop]
          })
        }
        config[i] = arr
      }
    }).catch(err => {
    })
  }
  return config
}

