import LoadingOverlay from "gasparesganga-jquery-loading-overlay";
// import jwt_decode from 'jwt-decode'
// import { search } from './CustomerFunctions'
import background from '../assets/Background.jpg'
import React, { Component } from 'react'
import Notifications, { notify } from "react-notify-toast";
import $ from "jquery";
const fetch = require('node-fetch');
global.Headers = fetch.Headers
let base64 = require('base-64');


class Profile extends Component {
    constructor() {
        super();
        //------------------------------------------- define states --------------------------------------------------------
        this.state = {
            HomeID:'',
            FirstName:'',
            LastName:'',
            EmailAddress:'',
            MobileNumber:'',
            MacAddress:'',
            ZipCode:'',
            errors: {},
            results: [],
        };
        //------------------------------------------ binding functions -----------------------------------------------------
        this.onChange = this.onChange.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
        this.isInt = this.isInt.bind(this)

    }
    componentDidMount() {
        //------------------------------------------ hide loading animation ------------------------------------------------
        $.LoadingOverlay("hide", {
            imageColor: "#007bff",
            size: "30"
        });

        let myColor = { background: "#007bff", text: "#FFFFFF" };
        //------------------------------------------ if not logged in redirect to login page -------------------------------
        if (sessionStorage.getItem("username")===null) {
            console.log('undefined username')
            this.props.history.push({
                pathname : '/',
            })
        }else{


        }
    }

    onSubmit(e) {
        e.preventDefault()
        //------------------------------------------ show loading animation ------------------------------------------------
        $.LoadingOverlay("show", {
            imageColor: "#007bff",
            size: "30"
        });
        let myColor = { background: "#007bff", text: "#FFFFFF" };
        //------------------------------------------ define costumer object ------------------------------------------------
        const customer = {
            account_number:this.state.account_number,
            phone_number:this.state.phone_number,
            mac_address:String(this.state.mac_address),
            FirstName:String(this.state.FirstName),
            LastName:String(this.state.LastName),
            EmailAddress:String(this.state.EmailAddress),
            zip_code:String(this.state.zip_code)
        }
        //check if inputs are empty
        if (!customer.account_number) {
            customer.account_number=0;
        }
        if (!customer.phone_number) {
            customer.phone_number=0;
        }
        //------------------------------------------ check if account & esn are numbers ------------------------------------
        if (!this.isInt(customer.account_number) || !this.isInt(customer.phone_number)) {
            //------------------------------------------ hide loading animation ----------------------------------------------
            $.LoadingOverlay("hide", {
                imageColor: "#007bff",
                size: "30"
            });
            //------------------------------------------ wrong input type notification----------------------------------------
            notify.show("error in type fields", "custom", 5000, { background: "#e73e46", text: "#FFFFFF" })
            return 0;
        }

        async function getUserAsync(state){


            const proxyurl = "https://cors-anywhere.herokuapp.com/";
            const url = `=${customer.EmailAddress}&macSegment=${customer.MacAddress}&lastName=${customer.LastName}`
            const resp = await fetch( proxyurl + url,{
                method:'GET',
                headers: new Headers({
                    // eslint-disable-next-line
                    'Authorization': `Basic ${base64.encode(sessionStorage.getItem("username") + ":" + sessionStorage.getItem("password"))}`,
                    'Content-Type': 'application/json'
                }),
            });
            let data = await resp.json();
            console.log("data  :" + data)
            return data;
        }

            //------------------------------------------ set returned response to result stat ----------------------------------
            getUserAsync()
            //.then(response => {console.log(response[0].LastName)})
             //.then(response => this.setState({results:response.data.data.recordsets[0]}))
            .then(response => {this.setState({results: response})})
            .then(response =>{

                //------------------------------------------ if the response is empty ----------------------------------------
                if (this.state.results.length === 0) {
                    notify.show("No record found  ! ", "custom", 5000, myColor)
                    //------------------------------------------ redirect to search result page --------------------------------
                }else{

                    this.props.history.push({
                        pathname : '/search',
                        state :this.state.results
                    })

                }
            })
            .then(response=>{
                //------------------------------------------ hide loading animation ------------------------------------------
                $.LoadingOverlay("hide", {
                    imageColor: "#007bff",
                    size: "30"
                });

            })
            //------------------------------------------ handling errors ---------------------------------------------------
            .catch(err => {
                notify.show(err.message)
                console.log(err.message)
                //notify.show("error occurred please try refreshing the page !  ", "custom", 5000, { background: "#e73e46", text: "#FFFFFF" })
            })

    }
    //----------------------------------------to bind state var with input value -----------------------------------------
    onChange(e) {
        this.setState({ [e.target.name]: e.target.value })
    }


    isInt(value) {
        return !isNaN(value) &&
            parseInt(Number(value)) == value &&
            !isNaN(parseInt(value, 10));
    }
    
    /*------------------------------------------ render search costumer component ----------------------------------------
    The Bootstrap grid system has four classes: xs (phones), sm (tablets), md (desktops), and lg (larger desktops)*/
    render() {
        return (
            <div style={{backgroundColor: '#066bd1', height: '100vh'}}>
                <div className="imageLightBG" style={{backgroundImage: `url(${background})`}}></div>
              <div className="container pt-5">
                <Notifications />
                <div className="row" style={{justifyContent: 'center'}}>
                    <div className="shadow component rounded p-5 col-sm-10 col-md-6 mt-4">
                        {/*---------------------------------- search costumer form --------------------------------------------*/}
                        <form noValidate onSubmit={this.onSubmit}>
                            <h1 className="h3 text-center mb-3 font-weight-normal h1" >Search Customer</h1>
                            <div className="form-group">
                                <input
                                    type="text"
                                    className="form-control form-styling text-center"
                                    name="account_number"
                                    placeholder="Account number"
                                    value={this.state.account_number}
                                    onChange={this.onChange}
                                />
                            </div>
                            <div className="form-group">
                                <input
                                    type="text"
                                    className="form-control form-styling text-center"
                                    name="phone_number"
                                    placeholder="Phone number"
                                    value={this.state.phone_number}
                                    onChange={this.onChange}
                                />
                            </div>
                            <div className="form-group">
                                <input
                                    type="text"
                                    className="form-control form-styling text-center"
                                    name="MacAddress"
                                    placeholder="Mac Address"
                                    value={this.state.MacAddress}
                                    onChange={this.onChange}
                                />
                            </div>
                            <div className="form-group">
                                <input
                                    type="text"
                                    className="form-control form-styling text-center"
                                    name="FirstName"
                                    placeholder="First Name"
                                    value={this.state.FirstName}
                                    onChange={this.onChange}
                                />
                            </div>
                            <div className="form-group">
                                <input
                                    type="text"
                                    className="form-control form-styling text-center"
                                    name="LastName"
                                    placeholder="Last Name"
                                    value={this.state.LastName}
                                    onChange={this.onChange}
                                />
                            </div>
                            <div className="form-group">
                                <input
                                    type="email"
                                    //disabled="disabled"
                                    className="form-control form-styling text-center"
                                    name="EmailAddress"
                                    placeholder="Email Address"
                                    value={this.state.EmailAddress}
                                    onChange={this.onChange}
                                />
                            </div>
                            <div className="form-group">
                                <input
                                    type="text"
                                    className="form-control form-styling text-center"
                                    name="zip_code"
                                    placeholder="Hub id"
                                    value={this.state.zip_code}
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
            </div>
        )
    }
}

export default Profile
