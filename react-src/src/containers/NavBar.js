import React, {Component, PropTypes} from 'react';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import {deepOrange500} from 'material-ui/styles/colors';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {BrowserRouter as Link } from 'react-router-dom'; 
import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import logo from '../logo.svg';


const styles = {
  container: {
    textAlign: 'center',
  },
};


const muiTheme = getMuiTheme({
  palette: {
    accent1Color: deepOrange500,
  },
});

class NavBar extends Component {

    constructor(props){
        super(props);
        this.state = {
            open: false
        };
    }


    handleToggle = (event) => this.setState({open: !this.state.open});

    render(){
        return (
<MuiThemeProvider muiTheme={muiTheme}>
     <div style={styles.container}>
     <AppBar title="Dealbreaker Dating" onLeftIconButtonTouchTap={this.handleToggle}>
              
     </AppBar>
     <Drawer containerStyle={{height: 'calc(100% - 64px)', top: 64}} docked={true} width={200} open={this.state.open} zDepth={2}>
            <MenuItem primaryText="Home" href="/" />
            <MenuItem primaryText="Login" href="/login" />
            <MenuItem primaryText="Register" href="/register" />   
            </Drawer>
    </div>
     </MuiThemeProvider>

        );

    }

}

export default NavBar;