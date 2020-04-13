import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import {ThemeProvider} from "./components/ThemeContext";
import styled from "@emotion/styled";

const Wrapper = styled("div")`
  background: ${props => props.theme.background};
  display: table-cell;
  width: 100vw;
  height : 100vh;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen";
  
  /*--------------------- a class to modify the text color based on the theme ----------------------------------------*/
  h1 {
    color: ${props => props.theme.body};
  }

  /*--------------------- a class to modify the text color based on the theme ----------------------------------------*/  
  .navItem_styling {
     color: ${props => props.theme.navItem_styling}
  }
  
  .component {
    background-color : ${props => props.theme.componentsBG}
  }
  
  .btn-animate {
    float: left;
    font-weight: 700;
    text-transform: uppercase;
    font-size: 13px;
    text-align: center;
    color: rgba(255,255,255, 1);
    width: 100%;
    height: 35px;
    border: none;
    border-radius: 20px;
    margin-top: 23px;
    background-color: ${props => props.theme.navItem_styling} ;
    left: 0px;
    top: 0px;
  }

  .btn-signin {
      float: left;
      width: 50%;
      height: 35px;
      border: none;
      border-radius: 20px;
  
  }
  
  .form-styling, .form-styling:focus {
    width: 100%;
    height: 35px;
    padding-left: 15px;
    border: none;
    border-radius: 20px;
    margin-bottom: 20px;
    background: ${props => props.theme.inputFocus};
    color: ${props => props.theme.body};
  }

  label {
      font-weight: 400;
      text-transform: uppercase;
      font-size: 13px;
      padding-left: 15px;
      padding-bottom: 10px;
      color: ${props => props.theme.label};
      display: block;
      text-align: left;
  }
    
  .textarea-styl,.textarea-styl:focus{
      width: 100%;
      height: 60px;
      padding-left: 15px;
      border: none;
      border-radius: 20px;
      margin-bottom: 20px;
      background: ${props => props.theme.inputFocus};
      color: ${props => props.theme.body};
  }

  .navbar_styling{
      background-color: #282c34;
  }
 
  .value {
    color: ${props => props.theme.label};
  }
       
  .fa-bars {
      color: #44cc88;
      background-color: transparent;
  }
  
  .list-item{
    color : ${props => props.theme.label}!important ;
    background-color: transparent;
    border-top: 0 ;
    border-left: 0 ;
    border-right: 0 ;
    border-color :${props => props.theme.border}!important ;
    
}
.logo {
  width: 140px;
  height: 50px; 
}

.darkMode {
  color : ${props => props.theme.label};
}

td i {
  color: ${props => props.theme.label};
}

`;


ReactDOM.render(<ThemeProvider>
                    <Wrapper>
                        <App />
                    </Wrapper>
                </ThemeProvider>, document.getElementById('root'));

// If you want the app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more   service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
