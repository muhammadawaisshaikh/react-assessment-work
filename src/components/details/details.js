import React, { Component } from "react";
import axios from "axios";
import $ from "jquery";
import "./details.css"
import Moment from "react-moment";
import Notifications, { notify } from "react-notify-toast";
import Graph from "react-graph-vis";

//Configuration of the net
const options = {
  layout: {
    hierarchical: false
  },
  edges: {
    arrows: {
      to:     {enabled: false, scaleFactor:1, type:'arrow'},
      middle: {enabled: false, scaleFactor:1, type:'arrow'},
      from:   {enabled: false, scaleFactor:1, type:'arrow'}
    },
    color: "#ffffff",
  },
};


class Details extends Component {

  constructor() {
    super();
    // define states
    this.state = {
      network: {},
      customer_id:0,
      customer: {},
      notes: [],
      content: "",
      HomeID: 0,
      MobileNumber: "",
      MacAddress: "",
      FirstName: "",
      LastName: "",
      Address: "",
      EmailAddress: "",
      ZipCode: "",
      SensorData: [],
      Hub: [],
      RebootTimes: [],
      graph:{nodes: [], edges: []},
    };

    // binding functions
    this.onChange = this.onChange.bind(this);
    this.onSubmitCustomer = this.onSubmitCustomer.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleNote = this.handleNote.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }

  handleClick = e => {
    $("." + e.target.id).toggle();
  };



  componentDidMount() {
    // define the graph components
    const nodes = []
    const edges = []
    const colors = ["#e04141", "#e09c41", "#e0df41", "#7be041", "#41e0c9"]

    //check if the user is logged in
    if (sessionStorage.getItem("username") === null) {
      this.props.history.push({
        pathname: '/',
      })
    } else {
      console.log(sessionStorage.getItem("username"))

    }
    //displaying a loading overlay
    $.LoadingOverlay("show", {
      imageColor: "#007bff",
      size: "30"
    });

    // Set Ocshner URL

    const fetch = require('node-fetch');
    global.Headers = fetch.Headers
    let base64 = require('base-64');

    async function getUserAsync(email) {
      const proxyurl = "https://cors-anywhere.herokuapp.com/";
      let thisemail = sessionStorage.getItem("customerEmail")
      const url = `?email=${thisemail}`
      const resp = await fetch(proxyurl + url, {
        method: 'GET',
        headers: new Headers({
          // eslint-disable-next-line
          'Authorization': `Basic ${base64.encode(sessionStorage.getItem("username") + ":" + sessionStorage.getItem("password"))}`,
          'Content-Type': 'application/json'
        }),
      })
      let data = await resp.json();
      console.log(data)
      return data;
    }

    function DeviceNamer(date) {
      var test = "hello"
      return test
    }


    getUserAsync(this.state.EmailAddress)
        .then((resp => {
          this.setState({
            //Hub data
            Hub: resp.Hub,
            MacAddress: JSON.parse(JSON.stringify(resp.Hub.MacAddress).toUpperCase()),
            LastRebootTime: resp.Hub.LastRebootTime,
            CSQReadings: resp.Hub.CSQ,
            ScriptVersion: resp.Hub.ScriptVersion,
            RulesVersion: resp.Hub.RulesVersion,
            LastIPAddress: resp.Hub.LastIPAddress,
            PowerSource: resp.Hub.PowerSource,

            //user data
            account_number: resp.Users[0].HomeID,
            phone_number: resp.Users[0].MobileNumber,
            first_name: resp.Users[0].FirstName,
            last_name: resp.Users[0].LastName,
            email: resp.Users[0].EmailAddress,
            CodeRedeemedDate: resp.Users[0].CodeRedeemedDate,
            zip_code: resp.Users[0].ZipCode,

            //sensors data
            SensorData: resp.SensorData.sort(function (a, b) {
              return parseFloat(a.SensorID) - parseFloat(b.SensorID)
            }),
          });
        }))


    // hide the overlay animation after loading data
    $.LoadingOverlay("hide", {
      imageColor: "#007bff",
      size: "30"
    });
    this.state.SensorData.map(function (item, key) {
      console.log('connected to : ' + item.SensorID)
      // initialise the net nodes and assign a random color  to each node
      nodes.push({id: key + 1, label: 'sensor' + item.SensorID, color: colors[key]})
      item.to.map(function (i, k) {
        // define the connections between nodes
        edges.push({from: item.SensorID, to: i.to})
        console.log(i.to)
      })
    })
    // initialise the graph
    this.setState({graph: {nodes, edges}})
    console.log(nodes)
    console.log(edges)

  }


  onSubmitCustomer(e) {
    e.preventDefault();
    //show loading animation on submission
    $.LoadingOverlay("show", {
      imageColor: "#007bff",
      size: "30"
    });
    let myColor = { background: "#5de67d", text: "#FFFFFF" };
  }


  // adding new note
  handleNote(e) {
    e.preventDefault();
    // show the loading animation
    $.LoadingOverlay("show", {
      imageColor: "#007bff",
      size: "30"
    });

    let myColor = { background: "#5de67d", text: "#FFFFFF" };

    // check if the note is not empty
    if (this.state.content.length !== 0) {
      // Set the "insert" note URL
      const url = `http://localhost:8080/insert/note`;
      // Send insert note request
      return axios
          .post(url, {
            id_customer: e.target.value,
            content: this.state.content
          })
          // update the state with the new note
          .then(response =>
              this.setState({ notes: response.data.data.recordsets[0].reverse()})
          )
          // note inserted successfully
          .then(response => notify.show("note saved ! ", "custom", 5000, myColor))
          // reset the note
          .then(response => $("#textNote").text(""))
          .then(response=>{
            // hide the overlay animation
            $.LoadingOverlay("hide", {
              imageColor: "#007bff",
              size: "30"
            });
          })
          // note insert failed
          .catch(err => console.error(err));
    }
  }

  // bind stat variable with stat value
  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  // delete note
  SystemVersion;
  handleDelete(e) {
    e.preventDefault();
    let myColor = { background: "#5de67d", text: "#FFFFFF" };
    // set the delete note URL
    const url = "http://localhost:8080/delete/note?id_note="+e.target.value+"&id_customer="+e.target.id;
    // Sending delete note request
    return axios
        .get(url)
        // update the notes table
        .then(response =>
            this.setState({ notes: response.data.data.recordsets[0].reverse() })
        )
        // note successfully deleted
        .then(response => notify.show("note deleted ! ", "custom", 5000, myColor))
        // note deletion failed
        .catch(err => console.error(err));
  }

  render() {
    // initialise handlers
    const handleDelete = this.handleDelete;
    const handleNote = this.handleNote;
    const handleClick = this.handleClick;
    // render details component
    return (
      <div style={{backgroundColor: '#066bd1', height: '100vh'}}>
        <div class="container-fluid emp-profile">
          <Notifications />
          <form method="post">
            <div class="row pt-5">
              {/* information*/}
              <div class="col-md-3 py-5 mx-auto shadow component rounded">
                <table class="list-group px-3 col border-0">

                  <tr className="list-group-item list-item row">
                    <td className="col"><i class="fas fa-home mr-2 te"></i> Home ID :</td>
                    <td className="col">{this.state.account_number}{""}</td>
                  </tr>

                  <tr className="list-group-item list-item row">
                    <td className="col"><i class="fas fa-user mr-2"></i> First name :</td>
                    <td className="col">{this.state.first_name}{" "}</td>
                  </tr>

                  <tr className="list-group-item list-item row">
                    <td className="col"><i class="fas fa-user mr-2"></i> Last name :</td>
                    <td className="col">{this.state.last_name}{" "}</td>
                  </tr>

                  <tr className="list-group-item list-item row">
                    <td className="col"><i class="fas fa-envelope mr-2"></i> Email :</td>
                    <td className="col">{this.state.email}{" "}</td>
                  </tr>

                  <tr className="list-group-item list-item row">
                    <td td className="col"><i class="fas fa-phone mr-2"></i> Phone number :</td>
                    <td td className="col">{this.state.phone_number}{""}</td>
                  </tr>
                  <tr className="list-group-item list-item row" >
                    <td className="col"><i class="fas fa-user mr-2"></i> MAC :</td>
                    <td className="col">{this.state.server}{""}</td>
                  </tr>

                  <tr className="list-group-item list-item row">
                    <td className="col"><i class="fas fa-map-pin mr-2"></i> ZIP :</td>
                    <td className="col">{this.state.zip_code}{" "}</td>
                  </tr>
                </table>
              </div>
              {/*customer information end*/}
              <div class="col-md-8 mx-auto pb-5 px-0 shadow component rounded test">
                {/*tabs*/}
                <div class="profile-head">
                  <ul class="nav nav-tabs" id="myTab" role="tablist">
                    <li className="nav-item">
                      <a
                          className="nav-link active navItem_styling"
                          id="hubs-tab"
                          data-toggle="tab"
                          href="#hubs"
                          role="tab"
                          aria-controls="hubs"
                          aria-selected="true"
                      >
                        <i class="fab fa-hubspot mr-2"></i> Hub
                      </a>
                    </li>

                    <li className="nav-item">
                      <a
                          className="nav-link navItem_styling"
                          id="home-tab"
                          data-toggle="tab"
                          href="#home"
                          role="tab"
                          aria-controls="home"
                          aria-selected="false"
                      >
                        <i class="fab fa-audible mr-2"></i> Sensors
                      </a>
                    </li>


                    <li className="nav-item">
                      <a
                          className="nav-link navItem_styling"
                          id="customer-tab"
                          data-toggle="tab"
                          href="#customer"
                          role="tab"
                          aria-controls="customer"
                          aria-selected="false"
                      >
                        <i class="fas fa-user-circle mr-2"></i> Customer
                      </a>
                    </li>
                    <li className="nav-item">
                      <a
                          className="nav-link navItem_styling"
                          id="profile-tab"
                          data-toggle="tab"
                          href="#notes"
                          role="tab"
                          aria-controls="notes"
                          aria-selected="false"
                      >
                        <i class="fas fa-clipboard mr-2"></i> Notes
                      </a>
                    </li>

                    <li className="nav-item" onClick={()=>{this.state.network.fit()}}>
                      <a

                          className="nav-link navItem_styling"
                          id="hubs-tab"
                          data-toggle="tab"
                          href="#net"
                          role="tab"
                          aria-controls="net"
                          aria-selected="false"
                      >
                        <i class="fas fa-wifi mr-2"></i> Net
                      </a>
                    </li>
                  </ul>
                </div>
                {/*--------------------------------------------tabs end----------------------------------------------*/}
                <div class="tab-content profile-tab" id="myTabContent">
                  {/*--------------------------------------Sensor data tab-------------------------------------------*/}
                  <div
                      class="tab-pane fade "
                      id="home"
                      role="tabpanel"
                      aria-labelledby="home-tab"
                  >
                    <table class="table value">
                      <thead>
                      <tr>
                        <th scope="col"></th>
                        <th scope="col"></th>
                        <th scope="col">State</th>
                        <th scope="col">last reported</th>
                        <th scope="col">battery</th>
                        {/*<th scope="col">last reported</th>*/}
                        <th scope="col">state</th>
                        <th scope="col">last reported</th>
                      </tr>
                      </thead>
                      <tbody>
                      {this.state.SensorData.map(function(item, key) {
                        return (
                            <React.Fragment>
                              <tr>
                                <th
                                    scope="row"
                                    id={"table-row" + key}
                                    onClick={handleClick}
                                >
                                  +
                                </th>
                                <td>{item.SensorID == 1 ? item.SensorID : item.SensorID }</td>
                                <td className={`${item.LastStatus}`}>
                                  {item.LastStatus === "ONLINE" ? (
                                      <i className="fas fa-check-circle text-success mx-3"></i>
                                  ) : (
                                      <i className="fas fa-times-circle text-danger mx-3"></i>
                                  )}
                                </td>
                                <td>
                                  <Moment format="lll" date={item.lastActivateTime} />
                                </td>
                                <td className="text-left">
                                  {item.BatteryPct == null ? (
                                      <span>Unknown</span>
                                  ) : (
                                      <p>{item.BatteryPct}%</p>
                                  )}
                                </td>
                                {/*<td><Moment fromNow date={item.lastActivateTime}/></td>*/}

                                <td className={`${item.LastStatus}`}>
                                  {item.LastStatus === "ONLINE" ? (
                                      <p>Online</p>
                                  ) : (
                                      <p>offline</p>
                                  )}
                                </td>
                                <td><Moment startOf="D" format="LLL" date={item.lastActivateTime} /></td>
                              </tr>
                              {item.Events.map(event => (
                                  <tr
                                      className={"table-row" + key}
                                      style={{ display: "none" }}
                                  >
                                    <td colspan="2"></td>
                                    <td>
                                      {event.State == 0 ? (
                                          <p>0</p>
                                      ) : (
                                          <p>1</p>
                                      )}
                                    </td>
                                    <td>
                                      <Moment date={event.Date} />
                                    </td>
                                  </tr>
                              ))}
                            </React.Fragment>
                        );
                      })}
                      </tbody>
                    </table>
                  </div>
                  {/*--------------------------------------Sensor data tab end---------------------------------------*/}
                  {/*--------------------------------------Hub tab---------------------------------------------------*/}
                  <div
                      class="tab-pane fade show active"
                      id="hubs"
                      role="tabpanel"
                      aria-labelledby="hubs-tab"
                  >
                    <table class="table value">
                      <thead>
                      <tr>
                        <th scope="col"></th>
                        <th scope="col">Status</th>
                        <th scope="col">Last Reported</th>
                      </tr>
                      </thead>
                      <tbody>
                      <tr>
                        <th scope="row">{"Mac Address"}</th>
                        <td>{this.state.MacAddress}</td>
                        <td><Moment format="YYYY-MM-DD HH:mm" date={this.state.Hub.LastPayLoad} /></td>
                      </tr>

                      <tr>
                        <th scope="row">IP Addresses</th>
                        <td>{this.state.LastIPAddress}</td>
                        <td><Moment format="YYYY-MM-DD HH:mm" date={this.state.Hub.LastPayLoad} /></td>
                      </tr>
                      <tr>
                        <th>Scripts Version</th>
                        <td>{this.state.ScriptVersion}</td>
                        <td><Moment format="YYYY-MM-DD HH:mm" date={this.state.Hub.LastPayLoad} /></td>
                      </tr>
                      <tr>
                        <th>Rules Version</th>
                        <td>{this.state.RulesVersion}</td>
                        <td><Moment format="YYYY-MM-DD HH:mm" date={this.state.Hub.LastPayLoad} /></td>
                      </tr>
                      <tr>
                        <th>System Version</th>
                        <td>{this.state.SystemVersion ? this.state.SystemVersion : "Unknown" }</td>
                        <td><Moment format="YYYY-MM-DD HH:mm" date={this.state.Hub.LastPayLoad} /></td>
                      </tr>
                      <tr>
                        <th scope="row">Signal Quality</th>
                        <td>{this.state.Hub.CSQ}</td>
                        <td><Moment format="YYYY-MM-DD HH:mm" date={this.state.Hub.LastPayLoad} /></td>
                      </tr>
                      <tr>
                        <th scope="row">Last Active Time</th>
                        <td><Moment format="YYYY-MM-DD HH:mm" date={this.state.Hub.LastActiveTime} /></td>
                        <td><Moment format="YYYY-MM-DD HH:mm" date={this.state.Hub.LastPayLoad} /></td>
                      </tr>
                      <tr>
                        <th scope="row">Power Source</th>
                        <td>{this.state.PowerSource}</td>
                        <td><Moment format="YYYY-MM-DD HH:mm" date={this.state.Hub.LastPayLoad} /></td>
                      </tr>
                      <tr>
                        <th scope="row">Last Reboot Time</th>
                        <td><Moment format="YYYY-MM-DD HH:mm" date={this.state.Hub.LastRebootTime} /></td>
                        <td><Moment format="YYYY-MM-DD HH:mm" date={this.state.Hub.LastPayLoad} /></td>
                      </tr>
                      </tbody>
                    </table>
                  </div>
                  {/*--------------------------------------Hub tab end-----------------------------------------------*/}
                  {/*--------------------------------------Net tab---------------------------------------------------*/}
                  <div
                      onMouseEnter={()=>{this.state.network.fit()}}
                      className="tab-pane fade center "
                      id="net"
                      role="tabpanel"
                      aria-labelledby="net-tab"
                  >
                    <button className="btn btn-lg btn-block btn-signin btn-animate col-md-6 col-sm-8  offset-md-3" onClick={(e)=>{this.state.network.fit();e.preventDefault()}}>Adjust</button>
                    <Graph graph={this.state.graph} options={options} style={{ height: "500px" }} className="text-white" getNetwork={network =>
                        this.setState({network }) }/>

                  </div>
                  {/*--------------------------------------Net tab end-----------------------------------------------*/}
                  {/*--------------------------------------Customer update form tab----------------------------------*/}
                  <div
                      class="tab-pane fade"
                      id="customer"
                      role="tabpanel"
                      aria-labelledby="customer-tab"
                      style={{ padding: "14px" }}
                  >
                    <div class="row mt-3">
                      <div class="offset-md-3 col-md-6">
                        <form noValidate onSubmit={this.onSubmitCustomer}>
                          <h1 className="h3 mb-3 font-weight-normal text-center ">
                            Update Customer Information
                          </h1>
                          <div className="form-group">
                            <input
                                type="text"
                                className="form-control input-styling text-center  form-styling"
                                name="account_number"
                                readOnly="true"
                                placeholder="Enter your account number"
                                value={this.state.account_number}
                                onChange={this.onChange}
                            />
                          </div>
                          <div className="form-group">
                            <input
                                type="text"
                                className="form-control input-styling text-center  form-styling"
                                name="phone_number"
                                placeholder="Enter Phone number"
                                value={this.state.phone_number}
                                onChange={this.onChange}
                            />
                          </div>
                          <div className="form-group">
                            <input
                                type="text"
                                className="form-control input-styling text-center form-styling"
                                name="mac_address"
                                placeholder="Enter mac adress : "
                                value={this.state.MacAddress}
                                onChange={this.onChange}
                            />
                          </div>
                          <div className="form-group">
                            <input
                                type="text"
                                className="form-control input-styling text-center form-styling"
                                name="first_name"
                                placeholder="Enter your first name"
                                value={this.state.first_name}
                                onChange={this.onChange}
                            />
                          </div>
                          <div className="form-group">
                            <input
                                type="text"
                                className="form-control input-styling text-center form-styling"
                                name="last_name"
                                placeholder="Enter your last name"
                                value={this.state.last_name}
                                onChange={this.onChange}
                            />
                          </div>
                          <div className="form-group">
                            <input
                                type="email"
                                className="form-control input-styling text-center form-styling"
                                name="email"
                                placeholder="Enter email"
                                value={this.state.email}
                                onChange={this.onChange}
                            />
                          </div>
                          <div className="form-group">
                            <input
                                type="text"
                                className="form-control input-styling text-center form-styling"
                                name="zip_code"
                                placeholder="zip code"
                                value={this.state.zip_code}
                                onChange={this.onChange}
                            />
                          </div>

                          <button
                              type="submit"
                              className="btn btn-lg btn-block btn-signin btn-animate col-md-6 col-sm-8  offset-md-3"
                          >
                            update
                          </button>
                        </form>
                      </div>
                    </div>
                  </div>
                  {/*--------------------------------------Customer update form tab end------------------------------*/}
                  {/*--------------------------------------Note tab--------------------------------------------------*/}
                  <div
                      class="tab-pane fade"
                      id="notes"
                      role="tabpanel"
                      aria-labelledby="notes-tab"
                      style={{ padding: "14px" }}
                  >
                    <div class="row mt-3">
                      <div class="col-md-10 mx-auto">
                        <div class="form-group purple-border">
                          <form noValidate>
                            <label for="exampleFormControlTextarea4">
                              New Note :
                            </label>
                            <textarea
                                class="form-control  textarea-styl"
                                id="textNote"
                                rows="2"
                                onChange={this.onChange}
                                name="content"
                            ></textarea>
                            <br></br>
                            <button
                                type="submit"
                                className="btn btn-lg btn-block btn-signin btn-animate col-md-3 col-sm-8 col-sm-2 offset-md-9"
                                onClick={handleNote}
                                value={this.props.match.params.id}
                            >
                              save
                            </button>
                          </form>
                        </div>
                      </div>
                    </div>
                    <div className="row mt-3">
                      <div class="col-md-12">
                        <div class="form-group purple-border">
                          <label for="">Your Notes :</label>
                          <table class="table value">
                            <thead>
                            <tr>
                              <th scope="col" >#</th>
                              <th scope="col" >Content</th>
                              <th scope="col" >created at</th>
                              <th scope="col" ></th>

                            </tr>
                            </thead>
                            <tbody>
                            {this.state.notes.map(function(item, key) {
                              return (
                                  <tr key={key}>
                                    <td>{key}</td>
                                    <td>{item.content}</td>
                                    <td><Moment format="YYYY-MM-DD HH:mm" date={item.created_at} /></td>
                                    <td>
                                      <button onClick={handleDelete} type="button" className="btn btn-danger" value={item.id} id={item.id_customer}>delete</button>
                                    </td>

                                  </tr>
                              );
                            })}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/*--------------------------------------Note tab end----------------------------------------------*/}
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default Details;
