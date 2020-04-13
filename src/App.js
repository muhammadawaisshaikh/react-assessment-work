// Classes Names are well set up , landing should be the first page , but for some reasons its not  ....
import React, { Component } from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'

import Navbar from './components/Navbar'
import Landing from './components/Landing'
import Login from './components/Login'
import Register from './components/Register'
import Profile from './components/Profile'
import Search from './components/Search'
import Details from './components/details/details';

class App extends Component {
  render() {
    return (
      <Router >
          <div className="App">
              <Navbar />
              <Route exact path="/" component={Login} />
              <Route exact path="/home" component={Landing} />
              <Route exact path="/register" component={Register} />
              <Route exact path="/profile" component={Profile} />
              <Route exact path="/search" component={Search} />
              <Route exact path="/customer/:id" component={Details} />
          </div>
        </Router>
    )
  }
}

export default App
