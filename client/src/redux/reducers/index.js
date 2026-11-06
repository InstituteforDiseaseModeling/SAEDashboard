import {combineReducers} from 'redux';
import dashboard from './dashboard';
import api from './api';
import filters from './filters';
import config from './config';
import {showMsg} from './messaging';


export default combineReducers({filters, dashboard, api, config, showMsg});
