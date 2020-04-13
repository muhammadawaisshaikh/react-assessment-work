import React, { Component } from 'react'

class Register extends Component {
  constructor() {
    super()
    this.state = {
      username: '',
      password: '',
      errors: {},
    }
    //binding functions
    this.onChange = this.onChange.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
  }
  onSubmit(e) {
    e.preventDefault()
    //define user object
    const user = {
      username: this.state.username,
      password: this.state.password
    }

    async function authenticateUser() {
      const proxyurl = "https://cors-anywhere.herokuapp.com/";
      const url = ``
      const resp = await fetch(proxyurl + url, {
        method: 'GET',
        headers: new Headers({
          // eslint-disable-next-line
          'Authorization': `Basic ${base64.encode(sessionStorage.getItem("username") + ":" + sessionStorage.getItem("password"))}`,
          'Content-Type': 'application/json'
        }),
      });
      let data = await resp.json();
      console.log(data)
      return data;
    }

    authenticateUser()
        .then(response => {
          this.props.history.push({
            //redirect to login page
            pathname : '/',
          })
        })
        .catch(err => {
        })
  }

  //to bind state var with input value
  onChange(e) {
    this.setState({ [e.target.name]: e.target.value })
  }

  //rendering the register component
  render() {
    return (
        <div className="container shadow component rounded col-sm-10 col-md-6 p-5 my-5">
          <div className="row">
            <div className="col-md-8 mx-auto">
              {/*---------------------------------------- Register Form ---------------------------------------------*/}
              <form noValidate onSubmit={this.onSubmit}>
                <h1 className="h3 mb-3 font-weight-normal h1 text-center">Please sign in</h1>
                <div className="form-group">
                  <label htmlFor="username">username </label>
                  <input
                      type="username"
                      className="form-control form-styling"
                      name="username"
                      placeholder="Enter username"
                      value={this.state.username}
                      onChange={this.onChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <input
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
    )
  }}

export default Register
