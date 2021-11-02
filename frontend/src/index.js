import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import reportWebVitals from './reportWebVitals'

import {applyMiddleware, combineReducers, compose, createStore} from 'redux'
import {Provider} from 'react-redux'
import thunk from 'redux-thunk'

import itemsReducer from "./store/reducers/items"
import navReducer from "./store/reducers/nav"
import buildReducer from "./store/reducers/build"

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

function configureStore() {
    const rootReducer = combineReducers({
        items: itemsReducer,
        nav: navReducer,
        build: buildReducer
    })

    return createStore(
        rootReducer,
        composeEnhancers(applyMiddleware(thunk))
    )
}

const store = configureStore();

const app = (
    <Provider store={store}>
        <App/>
    </Provider>
);


ReactDOM.render(app, document.getElementById('root'))


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
