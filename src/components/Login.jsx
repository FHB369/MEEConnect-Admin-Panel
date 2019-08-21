import React, { Component } from "react";
import "../App.css";
import fire from "../config/config";

class Login extends Component {
  constructor(props) {
    super(props);
    this.login = this.login.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      email: "",
      password: "",
      err: "",
      sign_in: "Sign In"
    };
  }

  handleChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  login(e) {
    e.preventDefault();
    this.setState({
      sign_in: "Signing in...."
    });
    fire
      .auth()
      .signInWithEmailAndPassword(this.state.email, this.state.password)
      .then(u => {})
      .catch(error => {
        console.log(error);
        this.setState({
          err: error.message,
          sign_in: "Sign in"
        });
      });
  }

  render() {
    return (
      <div>
        <section className="dash-content">
          <div className="container">
            <div className="row">
              <div className="col-md-6 offset-md-3">
                <div className="login-form">
                  <h3>Admin Login</h3>
                  <br />
                  <form>
                    <div className="form-group">
                      <label for="adminEmail">Email address</label>
                      <input
                        type="email"
                        onChange={this.handleChange}
                        className="form-control"
                        id="adminEmail"
                        name="email"
                        aria-describedby="emailHelp"
                        placeholder="Enter email"
                      />
                    </div>
                    <div className="form-group">
                      <label for="adminPassword">Password</label>
                      <input
                        type="password"
                        onChange={this.handleChange}
                        className="form-control"
                        id="adminPassword"
                        name="password"
                        placeholder="Password"
                      />
                    </div>
                    {this.state.err ? (
                      <div className="alert alert-danger" role="alert">
                        {this.state.err}
                      </div>
                    ) : (
                      <div />
                    )}
                    <button
                      type="submit"
                      onClick={this.login}
                      className="btn btn-dark"
                    >
                      {this.state.sign_in}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }
}

export default Login;
