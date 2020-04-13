import React, { Component } from "react";
// import jwt_decode from 'jwt-decode'
import axios from "axios";
import $ from "jquery";
// import DataResponse from "../api.js";
import "./details.css"
import Moment from "react-moment";
import Notifications, { notify } from "react-notify-toast";
import LoadingOverlay from "gasparesganga-jquery-loading-overlay";
import Graph from "react-graph-vis";

const options = {
  layout: {
    hierarchical: false
  },
  edges: {
    color: "#ffffff"
  }
};


class Details extends Component {

  constructor() {
    super();
    this.state = {
      Hub: [],
      network: {},
      customer_id:0,
      customer: {},
      notes: [],
      content: "",
      account_number: 0,
      hub_number: 0,
      mac_address: "",
      first_name: "",
      last_name: "",
      email: "",
      zip_code: "",
      SensorData: [],
      CSQReadings: [],
      RebootTimes: [],
      graph:{nodes: [], edges: []}
    };
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
    if (sessionStorage.getItem("email_logged_in")===null) {
      this.props.history.push({
        pathname : '/',
        })
    }else{
      console.log(sessionStorage.getItem("email_logged_in"))
  }

    $.LoadingOverlay("show", {
      imageColor: "#007bff",
      size: "30"
    });

      const nodes=[]
      const edges=[]
      const colors=["#e04141","#e09c41","#e0df41","#7be041","#41e0c9"]

    this.setState({customer_id:this.props.match.params.id})
    const url_customer =
      "http://localhost:8080/customer?id=" + this.props.match.params.id;
    const url_notes =
      "http://localhost:8080/note?id_customer=" + this.props.match.params.id;
    //the link should change ,
    const db_url ="http://localhost:3001/data"
    const SensorData_url = "http://localhost:3001/SensorData";
    const Hub_url = "http://localhost:3001/Hub";
    const CSQReadings_url = "http://localhost:3001/CSQReadings";

    axios
      .all([
        axios.get(url_customer),
        axios.get(url_notes),
        axios.get(db_url),
      ])
      .then(
        axios.spread((customer, notes, db_data) => {
          this.setState({
            customer: customer.data.data.recordsets[0][0],
            notes: notes.data.data.recordsets[0].reverse(),
            account_number: customer.data.data.recordsets[0][0].account_number,
            hub_number: customer.data.data.recordsets[0][0].hub_number,
            mac_address: customer.data.data.recordsets[0][0].mac_address,
            first_name: customer.data.data.recordsets[0][0].first_name,
            last_name: customer.data.data.recordsets[0][0].last_name,
            email: customer.data.data.recordsets[0][0].email,
            zip_code: customer.data.data.recordsets[0][0].zip_code,
            SensorData: db_data.data.SensorData.sort(function(a, b) {
              return parseFloat(a.SensorID) - parseFloat(b.SensorID)
          }),
            Hub: db_data.data.Hub,
            CSQReadings: db_data.data.CSQReadings
          });
        console.log(this.state.SensorData)
          $.LoadingOverlay("hide", {
            imageColor: "#007bff",
            size: "30"
          });
          this.state.SensorData.map(function(item, key) {
            console.log('connected to : '+item.SensorID)
            //generate random colors
            nodes.push({id:key+1,label:'sensor'+item.SensorID,color:colors[key]})
            item.to.map(function (i,k){
              edges.push({from:item.SensorID,to:i.to})
              console.log(i.to)
            })
          })
          this.setState({graph:{nodes, edges}})
          console.log(nodes)
          console.log(edges)
        })
      );
  }

  onSubmitCustomer(e) {

    e.preventDefault();
    $.LoadingOverlay("show", {
      imageColor: "#007bff",
      size: "30"
    });

    let myColor = { background: "#5de67d", text: "#FFFFFF" };
    const url = `http://localhost:8080/customer/update`;
    console.log(this.state.account_number);
    let c = {};
    c["account_number"] = this.state.account_number;
    c["hub_number"] = this.state.hub_number;
    c["mac_address"] = this.state.mac_address;
    c["first_name"] = this.state.first_name;
    c["last_name"] = this.state.last_name;
    c["email"] = this.state.email;
    c["zip_code"] = this.state.zip_code;

    return axios
      .post(url, c)
      .then(response =>
        this.setState({
          customer: response.data.data.recordsets[0][0],
          account_number: response.data.data.recordsets[0][0].account_number,
          hub_number: response.data.data.recordsets[0][0].hub_number,
          mac_address: response.data.data.recordsets[0][0].mac_address,
          first_name: response.data.data.recordsets[0][0].first_name,
          last_name: response.data.data.recordsets[0][0].last_name,
          email: response.data.data.recordsets[0][0].email,
          zip_code: response.data.data.recordsets[0][0].zip_code
        })
      )
      .then(response =>
        notify.show("updated succefuly  ! ", "custom", 5000, myColor)
      )
      .then(response=>{
        $.LoadingOverlay("hide", {
          imageColor: "#007bff",
          size: "30"
        });
      })
      .catch(err => console.error(err));

  }

  handleNote(e) {
    e.preventDefault();
    $.LoadingOverlay("show", {
      imageColor: "#007bff",
      size: "30"
    });

    let myColor = { background: "#5de67d", text: "#FFFFFF" };

    if (this.state.content.length !== 0) {
      const url = `http://localhost:8080/insert/note`;
      return axios
        .post(url, {
          id_customer: e.target.value,
          content: this.state.content
        })
        .then(response =>
          this.setState({ notes: response.data.data.recordsets[0].reverse()})
        )
        .then(response => notify.show("note saved ! ", "custom", 5000, myColor))
        .then(response => $("#textNote").text(""))
        .then(response=>{
          $.LoadingOverlay("hide", {
            imageColor: "#007bff",
            size: "30"
          });
        })
        .catch(err => console.error(err));
    }
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }
  handleDelete(e) {
    e.preventDefault();
    let myColor = { background: "#5de67d", text: "#FFFFFF" };
    const url = "http://localhost:8080/delete/note?id_note="+e.target.value+"&id_customer="+e.target.id;
    return axios
      .get(url)
      .then(response =>
        this.setState({ notes: response.data.data.recordsets[0].reverse() })
      )
      .then(response => notify.show("note deleted ! ", "custom", 5000, myColor))
      .catch(err => console.error(err));

//     console.log(+' '+e.target.id)

    }

  render() {
    const handleDelete = this.handleDelete;
    const handleNote = this.handleNote;
    const handleClick = this.handleClick;
    return (
      <div class="container-fluid emp-profile">
        <Notifications />
        <form method="post">
          <div class="row mt-5">
            <div class="col-md-3 py-5 mx-auto shadow component rounded">
              <table class="list-group px-3 col border-0">
                <tr className="list-group-item list-item row">
                  <td className="col">Account number :</td>
                  <td className="col">{this.state.customer.account_number}{" sdhcjdbdfjnf"}</td>
                </tr>
                <tr className="list-group-item list-item row">
                  <td className="col">Esn number :</td>
                  <td className="col">{this.state.customer.hub_number}{" something"}</td>
                </tr>
                <tr className="list-group-item list-item row">
                  <td className="col">MAC :</td>
                  <td className="col">{this.state.customer.mac_address}{"fjkdngdf "}</td>
                </tr>
                <tr className="list-group-item list-item row">
                  <td className="col">First name :</td>
                  <td className="col">{this.state.customer.first_name}{" "}</td>
                </tr>
                <tr className="list-group-item list-item row">
                  <td className="col">Last name :</td>
                  <td className="col">{this.state.customer.last_name}{" "}</td>
                </tr>
                <tr className="list-group-item list-item row">
                  <td className="col">Email :</td>
                  <td className="col">{this.state.customer.email}{" "}</td>
                </tr>
                <tr className="list-group-item list-item row">
                  <td className="col">ZIP :</td>
                  <td className="col">{this.state.customer.zip_code}{" "}</td>
                </tr>
              </table>
            </div>

            <div class="col-md-8 mx-auto pb-5 px-0 shadow component rounded test">
              <div class="profile-head">
                <ul class="nav nav-tabs" id="myTab" role="tablist">
                  <li class="nav-item">
                    <a
                      class="nav-link active navItem_styling"
                      id="home-tab"
                      data-toggle="tab"
                      href="#home"
                      role="tab"
                      aria-controls="home"
                      aria-selected="true"
                    >
                      Sensors status
                    </a>
                  </li>
                  <li class="nav-item">
                    <a
                      class="nav-link navItem_styling"
                      id="customer-tab"
                      data-toggle="tab"
                      href="#customer"
                      role="tab"
                      aria-controls="customer"
                      aria-selected="true"
                    >
                      Customer informations
                    </a>
                  </li>
                  <li class="nav-item">
                    <a
                      class="nav-link navItem_styling"
                      id="profile-tab"
                      data-toggle="tab"
                      href="#notes"
                      role="tab"
                      aria-controls="notes"
                      aria-selected="false"
                    >
                      notes
                    </a>
                  </li>
                  <li class="nav-item">
                    <a
                      class="nav-link navItem_styling"
                      id="hubs-tab"
                      data-toggle="tab"
                      href="#hubs"
                      role="tab"
                      aria-controls="hubs"
                      aria-selected="false"
                    >
                      Hubs
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
                      Net
                    </a>
                  </li>
                </ul>
              </div>
              <div class="tab-content profile-tab" id="myTabContent">
                <div
                  class="tab-pane fade show active"
                  id="home"
                  role="tabpanel"
                  aria-labelledby="home-tab"
                >
                  <table class="table value">
                    <thead>
                      <tr>
                        <th scope="col"></th>
                        <th scope="col"></th>
                        <th scope="col">status</th>
                        <th scope="col">last reported</th>
                        <th scope="col">battery</th>
                        <th scope="col">last reported</th>
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
                              <td>{item.SensorID}</td>
                              <td className={`${item.LastStatus}`}>
                                {item.LastStatus === "ONLINE" ? (
                                    <i className="fas fa-check-circle text-success mx-3"></i>
                                ) : (
                                    <i className="fas fa-times-circle text-danger mx-3"></i>
                                )}
                              </td>
                              <td>
                                <Moment date={item.lastActivateTime} />
                              </td>
                              <td className="text-center">
                                {item.BatteryPct == null ? (
                                    <span>0%</span>
                                ) : (
                                  <p>{item.BatteryPct}%</p>
                                )}
                              </td>
                              <td>8/22/2019 5:30 PM</td>
                              <td>open</td>
                              <td>8/22/2019 5:30 PM</td>
                            </tr>
                            {item.Events.map(event => (
                              <tr
                                className={"table-row" + key}
                                style={{ display: "none" }}
                              >
                                <td colspan="2"></td>
                                <td>
                                  {event.State == 0 ? (
                                    <p>offline</p>
                                  ) : (
                                    <p>online</p>
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
                <div
                  class="tab-pane fade"
                  id="hubs"
                  role="tabpanel"
                  aria-labelledby="hubs-tab"
                >
                  <table class="table value">
                    <thead>
                      <tr>
                        <th scope="col"></th>
                        <th scope="col">status</th>
                        <th scope="col">last reported</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <th scope="row">{"Mac Address"}</th>
                        <td>{this.state.Hub.MacAddress}</td>
                        <td><Moment format="YYYY-MM-DD HH:mm" date={this.state.Hub.LastPayLoad} /></td>
                      </tr>

                      <tr>
                        <th scope="row">IP Addresses</th>
                        <td>{this.state.Hub.IPAddresses}</td>
                        <td><Moment format="YYYY-MM-DD HH:mm" date={this.state.Hub.LastPayLoad} /></td>
                      </tr>
                      <tr>
                        <th>Scripts Version</th>
                        <td>{this.state.Hub.Scripts_Version}</td>
                        <td><Moment format="YYYY-MM-DD HH:mm" date={this.state.Hub.LastPayLoad} /></td>
                      </tr>
                      <tr>
                        <th scope="row">CSQ</th>
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
                        <td>{this.state.Hub.Power_Source}</td>
                        <td><Moment format="YYYY-MM-DD HH:mm" date={this.state.Hub.LastPayLoad} /></td>
                      </tr>
                      <tr>
                        <th scope="row">Battery Level</th>
                        <td>{this.state.Hub.BatteryPct}</td>
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
                          Update Customer
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
                            name="hub_number"
                            placeholder="Enter hub number"
                            value={this.state.hub_number}
                            onChange={this.onChange}
                          />
                        </div>
                        <div className="form-group">
                          <input
                            type="text"
                            className="form-control input-styling text-center form-styling"
                            name="mac_address"
                            placeholder="Enter mac adress : "
                            value={this.state.mac_address}
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
              </div>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

export default Details;
