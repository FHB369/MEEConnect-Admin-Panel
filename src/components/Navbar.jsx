import React, { Component } from "react";
import "../App.css";
import { NavLink } from "react-router-dom";
import fire from "../config/config";

class Navbar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: localStorage.getItem("user")
    };

    this.logout = this.logout.bind(this);
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

  logout() {
    fire.auth().signOut();
    this.setState({ user: null });
    localStorage.removeItem("user");
  }

  render() {
    return (
      <div>
        <div className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top justify-content-center shadow-box gradiant-nav">
          <div className="container">
            <NavLink className="navbar-brand" to="/">
              <img
                className="d-inline-block align-top"
                width="30"
                height="30"
                src="./icon.svg"
                alt="Nav-Icon"
              />
              &nbsp;
              <b>MEE</b>Connect Admin Panel
            </NavLink>
            {this.state.user ? (
              <div
                className="btn navbar-toggler"
                data-toggle="collapse"
                data-target="#navbarNavAltMarkup"
                aria-controls="navbarNavAltMarkup"
                aria-expanded="false"
                aria-label="Toggle navigation"
              >
                <i className="material-icons white-text">more_vert</i>
              </div>
            ) : (
              <div />
            )}
            {this.state.user ? (
              <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
                <div className="navbar-nav offset-md-8">
                  <div className="nav-item nav-link admin-email">
                    {this.state.user.email}
                  </div>
                  <NavLink
                    className="nav-item nav-link"
                    onClick={this.logout}
                    to="/"
                  >
                    Sign&nbsp;Out
                  </NavLink>
                </div>
              </div>
            ) : (
              <p />
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default Navbar;
