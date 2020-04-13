import React, { Component } from 'react'
// import jwt_decode from 'jwt-decode'

class Profile extends Component {
  constructor() {
    super()
    //------------------------------------------- define states --------------------------------------------------------
    this.state = {
      account_number:'',
      phone_number:'',
      mac:'',
      first_name:'',
      last_name:'',
      email:'',
      zip:'',
      errors: {}
    }
    //------------------------------------------ binding functions -----------------------------------------------------
    this.onChange = this.onChange.bind(this)
    this.onSubmit = this.onSubmit.bind(this)

  }
  onSubmit(e) {
    e.preventDefault()
    //------------------------------------------ define costumer object ------------------------------------------------
    const customer = {
      account_number:this.state.account_number,
      phone_number:this.state.phone_number,
      mac:this.state.mac,
      first_name:this.state.first_name,
      last_name:this.state.last_name,
      email:this.state.email,
      zip:this.state.zip
    }
      this.props.history.push(`/customers/search?account_number='${customer.account_number}'&phone_number='${customer.phone_number}'&mac='${customer.mac}'&first_name='${customer.first_name}'&last_name='${customer.last_name}'&email='${customer.email}'&zip='${customer.zip}'`)


  }
  //----------------------------------------to bind state var with input value -----------------------------------------
  onChange(e) {
    this.setState({ [e.target.name]: e.target.value })
  }
  //------------------------------------------ render search costumer component ----------------------------------------
  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="shadow component rounded p-5 col-sm-10 col-md-6 mt-4">
            {/*---------------------------------- search costumer form ----------------------------------------------*/}
            <form noValidate onSubmit={this.onSubmit}>
              <h1 className="h3 text-center mb-3 font-weight-normal h1">Search Customer</h1>
              <div className="form-group">
                <input
                  type="text"
                  className="form-control form-styling text-center"
                  name="account_number"
                  placeholder="Enter your account number"
                  value={this.state.name}
                  onChange={this.onChange}
                />
              </div>
              <div className="form-group">
                <input
                  type="text"
                  className="form-control form-styling text-center"
                  name="phone_number"
                  placeholder="Enter Phone number"
                  value={this.state.name}
                  onChange={this.onChange}
                />
              </div>
              <div className="form-group">
                <input
                  type="text"
                  className="form-control form-styling text-center"
                  name="mac_adress"
                  placeholder="Enter mac adress : "
                  value={this.state.name}
                  onChange={this.onChange}
                />
              </div>
              <div className="form-group">
                <input
                  type="text"
                  className="form-control form-styling text-center"
                  name="first_name"
                  placeholder="Enter your first name"
                  value={this.state.name}
                  onChange={this.onChange}
                />
              </div>
              <div className="form-group">
                <input
                  type="text"
                  className="form-control form-styling text-center"
                  name="last_name"
                  placeholder="Enter your last name"
                  value={this.state.name}
                  onChange={this.onChange}
                />
              </div>
              <div className="form-group">
                <input
                  type="email"
                  className="form-control form-styling text-center"
                  name="email"
                  placeholder="Enter email"
                  value={this.state.email}
                  onChange={this.onChange}
                />
              </div>
              <div className="form-group">
                <input
                  type="text"
                  className="form-control form-styling text-center"
                  name="zip"
                  placeholder="zip code"
                  value={this.state.phone}
                  onChange={this.onChange}
                />
              </div>
              <button
                type="submit"
                className="btn btn-lg btn-block btn-animate btn-signin col-sm-8 offset-sm-2 col-md-6 offset-md-3"
              >
                search
              </button>
            </form>
          </div>
        </div>
      </div>
    )
  }
}

export default Profile
