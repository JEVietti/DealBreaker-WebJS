//Login Component for Form Data binding to be 
//handled in middleware redux through calls to actions in which
//requests will be made the REST API
//
//After the Login a credential will be stored in local storage 
//as well as some basic user data to help with state management


import React, { Component } from 'react';
//import { reduxForm } from 'redux-form';
//import * as actions from '../actions';

class Login extends Component {

    constructor(){
        super();
        this.state = {

        }
    }

    handleSubmit(){


    }

    render(){
        
        return(

            <form>

                <button>Sign In!</button>
            </form>

        );


    }



}

export default Login;