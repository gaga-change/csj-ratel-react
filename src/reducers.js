import {combineReducers} from 'redux';
import { info } from "./redux/info.redux";
import { menus } from "./redux/menus.redux";
export default combineReducers({info,menus})