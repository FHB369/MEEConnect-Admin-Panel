import React, { Component } from "react";
import { BrowserRouter, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import EnterData from "./components/EnterData";
import EnterDataTeacher from "./components/EnterDataTeacher";
import EnterDataStaff from "./components/EnterDataStaff";

require("firebase/database");
require("firebase/auth");

class App extends Component {
  constructor(props) {
    super(props);

    this.year = "";
  }
  render() {
    return (
      <BrowserRouter>
        <div>
          <Navbar />
          <Route exact path="/" component={Home} />
          <Route exact path="/teacher/data/" component={EnterDataTeacher} />
          <Route exact path="/staff/data/" component={EnterDataStaff} />
          <Route path={"/enter/:year"} component={EnterData} />
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
