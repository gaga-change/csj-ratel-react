import { routerConfig } from '../router/config'
const SETMENUS='SETMENUS';
export function menus(state={menus:(sessionStorage.getItem('menus')&&JSON.parse(sessionStorage.getItem('menus')))||routerConfig.filter(v=>v.must)},action) {
    switch (action.type){
        case SETMENUS:
            return {menus:action.menus};
        default:
            return state;
    }
}

export function setMenus(menus) {
  sessionStorage.setItem('menus',JSON.stringify(menus))
  return {type:SETMENUS,menus:menus};
}
