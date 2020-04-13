import React, { Component } from 'react'
import { Link, withRouter } from 'react-router-dom'
import {useTheme} from "./ThemeContext";
import logo from '../assets/logo.png';

//---------------------------------------- make a HOOK call in class component -----------------------------------------
function withMyHook(Component) {
  return function WrappedComponent(props) {
    const myHookValue = useTheme();
    return <Component {...props} myHookValue={myHookValue} />;
  }
}

class Landing extends Component {
  // logOut(e) {
  //   e.preventDefault()
  //   localStorage.removeItem('usertoken')
  //   this.props.history.push(`/`)
  // }
  //---------------------------------------- render the navBar component -----------------------------------------------
  render() {
    //-------------------------------------- assign theme hook call to local const -------------------------------------
    const themeState = this.props.myHookValue;
    const loginRegLink = (
        <ul className="navbar-nav  ml-auto">
          {/* <li className="nav-item">
          <Link to="/home" className="nav-link">
            Home
          </Link>
        </li> */}

          {/* <li className="nav-item">
          <Link to="/home" className="nav-link">
            create customer
          </Link>
        </li> */}
          <li className="nav-item">
            <Link to="/register" className="nav-link">
            </Link>
          </li>
        </ul>
    )

    const userLink = (
        <ul className="navbar-nav">
          <li className="nav-item">
            <Link to="/profile" className="nav-link">
              Home
            </Link>
          </li>
        </ul>
    )

    return (
        <nav className="navbar navbar-expand-lg component shadow py-0">
          {/*---------------------------------------- navBar button for small screens -------------------------------*/}
          <button
              className="navbar-toggler"
              type="button"
              data-toggle="collapse"
              data-target="#navbarsExample10"
              aria-controls="navbarsExample10"
              aria-expanded="false"
              aria-label="Toggle navigation"
          >
            <i className="fa fa-bars"></i>
          </button>

          <div
              className="collapse navbar-collapse justify-content-md-center"
              id="navbarsExample10"
          >
            {/*--------------------------------- LOGO placeHolder ---------------------------------------------------*/}
            <ul className="navbar-nav">
              <li className="nav-item">
                {/*------------------------------------redirect to home page ----------------------------------------*/}
                <Link to="/home" className="nav-link navItem_styling p-0 bg-dark">
                  <img src={logo} className="logo" alt=""/>
                </Link>
              </li>
            </ul>
            {localStorage.usertoken ? userLink : loginRegLink}
          </div>
          {/*------------------------------------dark mode / light mode button --------------------------------------*/}
          <div>
            <a onClick={() => themeState.toggle()}>
              <i className="fas fa-adjust darkMode "></i>
            </a>
          </div>
        </nav>
    )
  }
}
Landing = withMyHook(Landing);
export default withRouter(Landing)
