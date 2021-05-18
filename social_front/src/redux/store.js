import {createStore, combineReducers, compose, applyMiddleware} from 'redux'
import thunk from 'redux-thunk'
import { useSelector } from "react-redux";
import socket from '../utils/ws'
import userReducer,{getUserLocal} from './userDucks'
import notifReducer, {getNotifications} from './notifDucks'

const rootReducer = combineReducers({
    user: userReducer,
    notifications: notifReducer
})

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export default function generateStore(){
    const store = createStore(rootReducer, composeEnhancers(applyMiddleware(thunk)))
    getUserLocal()(store.dispatch)
    getNotifications()(store.dispatch)
    
    
    return store
}