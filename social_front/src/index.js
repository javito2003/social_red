import React from 'react';
import ReactDOM from 'react-dom';
import App from './App.jsx';
import './styles/index.css'
import axios from 'axios'
import { Provider, useDispatch, useSelector } from "react-redux";
import { getUserLocal } from "./redux/userDucks";
import generateStore from './redux/store.js';
const store = generateStore()
axios.defaults.baseURL = "http://127.0.0.1:3001/api"

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);


