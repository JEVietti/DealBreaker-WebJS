//Main App Component Houses the Routing through react-router@3
//And persists the navbar across all components loading the other components
//dynamically based on the url path, soon to include calls to REST API - same as angualr counterpart

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import logo from './logo.svg';
import './App.css';

import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import reduxThunk from 'redux-thunk';

import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';
import NavBar from './containers/NavBar';
import configureStore from './configStore';

var injectTapEventPlugin = require("react-tap-event-plugin"); //plugin for material-ui to work

//const store = configureStore(); //store for the middleware


class App extends Component {

  constructor(){
    super();
    injectTapEventPlugin();
  }

  render() {
    return (
      <div>
        <NavBar />

          
            <Router history={browserHistory}>
              <Route path="/" component={Home} />
              <Route path="register" component={Register} />
              <Route path="login" component={Login} />       
            </Router>
        
          
       
      </div>
      
      
    
    );
  }
}

export default App;
