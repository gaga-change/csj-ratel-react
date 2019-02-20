const LOGIN='LOGIN';
const LOGOUT='LOGOUT';

export function info(state={info:{}},action) {
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
  return {type:LOGIN,info:info};
}

export function removeInfo() {
    return {type:LOGOUT}
}