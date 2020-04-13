import React, { Component } from 'react'
import Notifications, { notify } from "react-notify-toast";
import $ from "jquery";
import Particles from 'react-particles-js';
import logo from '../assets/logo.png';
let base64 = require('base-64');
const fetch = require('node-fetch');
global.Headers = fetch.Headers;

class Login extends Component {
  constructor() {
    super();
      this.state = {
        username: '',
        password: '',
        errors: {}
        };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this)
  }

 componentDidMount() {
    let myColor = {background: "#e73e46", text: "#FFFFFF"};
    //check if the user is logged in
    if (sessionStorage.getItem("username") !== null) {
      notify.show("empty fields detected", "custom", 500000, {background: "#e73e46", text: "#FFFFFF"})
      //if the user is logged in redirect to home page with the username value
      this.props.history.push({
        pathname: '/home',
        state: sessionStorage.getItem("username")
      })
    }
  }

  onChange(credentials){
      this.setState({[credentials.target.name]: credentials.target.value})
  }

  onSubmit(credentials) {

    console.log("Submit clicked")

   credentials.preventDefault()
     $.LoadingOverlay("show", {
       imageColor: "#007bff",
       size: "30"
     });

  const user = {
      username: this.state.username,
      password: this.state.password
    }
  let myColor = {background: "#e73e46", text: "#FFFFFF"};

  async function authenticateUser() {
      console.log("authenticateUser")
      const proxyurl = "https://cors-anywhere.herokuapp.com/";
      const url = ""
      const resp = await fetch(proxyurl + url, {
        method: 'GET',
        headers: new Headers({
          'Authorization': `Basic ${base64.encode(user.username + ":" + user.password)}`,
          'Content-Type': 'application/json'
        }),
      });

      return resp.status;
    }

  if (user.username.length === 0 || user.password.length === 0) {
      notify.show("Access failure with insufficient or empty credentials", "custom", 500, myColor)
      console.log("Access failure with insufficient or empty credentials")
    } else {
    authenticateUser()
         .then(response =>{
        if (response==200) {
          //set the sessionStorage login
          sessionStorage.setItem("username",user.username);
          sessionStorage.setItem("password",user.password);

          this.props.history.push({
            //redirect to home page
            pathname : '/home',
            state :user.username
          })
        }else{
          //if the login is failed, hide loading animation
          $.LoadingOverlay("hide", {
            imageColor: "#007bff",
            size: "30"
          });
          //show failed notification
          notify.show("login failed ! ", "custom", 500000, myColor)
        }
      })
          //handle errors
          .catch(err => {
            notify.show('Error Authenticating ', "custom", 500000, myColor)
          })
    }
  }

  //rendering the login component
  render() {
    return (
      <div>
        <Particles className="particles-area"
          params={{
            "particles": {
                "number": {
                    "value": 50
                },
                "size": {
                    "value": 3
                }
            },
            "interactivity": {
                "events": {
                    "onhover": {
                        "enable": true,
                        "mode": "repulse"
                    }
                }
            }
          }}
        />
        <div className="main-area">
          <div className="container shadow component rounded col-sm-10 col-md-6 p-5 my-5">
            <Notifications />
            <div className="row">
              <div className="col-md-8 mx-auto">
                <div className="bg-dark logo-sec my-4">
                  <img src={logo} className="logo" alt=""/>
                </div>
                <form noValidate onSubmit={this.onSubmit}>
                  <h1 className="h3 mb-3 font-weight-normal h1 text-center">Please sign in</h1>
                  <div className="form-group">
                    <label htmlFor="username"></label>
                    <input
                        autoComplete="on"
                        type="username"
                        className="form-control  form-styling"
                        name="username"
                        placeholder="Enter username"
                        value={this.state.username}
                        onChange={this.onChange}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="password"></label>
                    <input
                        autoComplete="on"
                        type="password"
                        className="form-control form-styling"
                        name="password"
                        placeholder="Password"
                        value={this.state.password}
                        onChange={this.onChange}
                    />
                  </div>
                  <button
                      type="submit"
                      className="btn btn-lg btn-block btn-signin btn-animate col-md-6 col-sm-8 col-sm-2 offset-md-3 "
                  >
                    Sign in
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
        </div>
    )
  }
}

export default Login
