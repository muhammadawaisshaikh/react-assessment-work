import React, { Component } from 'react'
// import { withRouter } from "react-router-dom";

class Search extends Component {
  constructor(props) {
    super(props)
    //this.handleShow = this.handleShow.bind(this);

    this.state = {
      customers:[]
    }
    //------------------------------------------ binding functions -----------------------------------------------------
    this.handleClick = this.handleClick.bind(this);
  }

  //------------------------------------------ redirect to the selected costumer profile -------------------------------
  handleClick(e) {
    e.preventDefault();
    sessionStorage.setItem("customerEmail",e.target.value);

    this.props.history.push({
      pathname : '/customer/'+e.target.value,
      state :e.target.email
    })
  }

  componentDidMount() {
    //------------------------------------------ if not logged in redirect to login page -------------------------------
    if (sessionStorage.getItem("username")===null) {
      this.props.history.push({
        pathname : '/',
      })
    }else{
      //------------------------------------------ redirect to landing component ---------------------------------------
      if (this.props.location.state===undefined) {
        this.props.history.push({
          pathname : '/home',
        })
      }else{
        this.setState({customers:this.props.location.state})
      }
    }

  }

  //------------------------------------------ rendering search component ----------------------------------------------
  render() {
    const handleClick = this.handleClick;
    return (
        <div class="container-fluid">
          <div class="row">
            <div class="col-md-12">
              <div class="card">
                <div class="card-body">
                  <div class="row">
                    <div class="col-md-2 border-right">
                      <h4>Customers:</h4>
                    </div>

                  </div>
                  <div class="row">
                    <div class="col-md-12" >
                      <table class="table table-hover">
                        <thead class="bg-light ">
                        <th>Home Id</th>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Email Address</th>
                        <th>Mobile Number</th>
                        <th>Mac Address</th>
                        <th>Zip Code</th>
                        <th></th>
                        </thead>
                        {/*------------------------- display costumer search result ---------------------------------*/}
                        <tbody>{this.state.customers.map(function(item, key) {
                          return (
                              <tr key = {key}>
                                <td>{item.HomeID}</td>
                                <td>{item.FirstName}</td>
                                <td>{item.LastName}</td>
                                <td>{item.EmailAddress}</td>
                                <td>{item.MobileNumber}</td>
                                <td>{item.MacAddress}</td>
                                <td>{item.ZipCode}</td>
                                <td>
                                  <button onClick={handleClick} type="button" value={item.EmailAddress} email={item.EmailAddress}>show</button>
                                  {/*<a href="#"><i className="fa fa-trash"></i></a>*/}
                                </td>
                              </tr>
                          )
                        })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
    )
  }
}

export default Search
