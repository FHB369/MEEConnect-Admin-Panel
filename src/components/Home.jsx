import React, { Component } from "react";
import fire from "../config/config";
import Login from "./Login";
import Dash from "./Dash";

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: localStorage.getItem("user")
    };
    this.authListener = this.authListener.bind(this);
  }

  componentDidMount() {
    this.authListener();
  }

  authListener() {
    fire.auth().onAuthStateChanged(user => {
      if (user) {
        this.setState({ user });
        localStorage.setItem("user", user.uid);
      } else {
        this.setState({ user: null });
        localStorage.removeItem("user");
      }
    });
  }

  render() {
    return <div>{this.state.user ? <Dash /> : <Login />}</div>;
  }
}

export default Home;
