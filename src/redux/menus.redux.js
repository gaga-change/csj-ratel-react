import { routerConfig } from '../router/config'
const SETMENUS='SETMENUS';

export function menus(state={menus:routerConfig.filter(v=>v.must)},action) {
    switch (action.type){
        case SETMENUS:
            return {menus:action.menus};
        default:
            return state;
    }
}

export function setMenus(menus) {
  return {type:SETMENUS,menus:menus};
}
