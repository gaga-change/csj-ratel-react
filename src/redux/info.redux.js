const LOGIN='LOGIN';
const LOGOUT='LOGOUT';

export function info(state={info:(sessionStorage.getItem('info')&&JSON.parse(sessionStorage.getItem('info')))||{}},action) {
    switch (action.type){
        case LOGIN:
            return {info:action.info};
        case LOGOUT:
            return {info:{}};
        default:
            return state;
    }
}

export function setInfo(info) {
  sessionStorage.setItem('info',JSON.stringify(info))
  return {type:LOGIN,info:info};
}

export function removeInfo() {
    sessionStorage.removeItem('info')
    sessionStorage.removeItem('menus')
    return {type:LOGOUT}
}