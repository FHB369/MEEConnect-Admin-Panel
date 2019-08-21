import React, { Component } from "react";
import fire from "../config/config";
import Card from "./Card";
import "../App.css";
import CreateNewBatch from "./CreateNewBatch";
import EditBatch from "./EditBatch";

require("firebase/database");

class Dash extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: [],
      showPopup: false,
      showEditPopup: false,
      currentBatch: ""
    };
  }

  togglePopup() {
    this.setState({
      showPopup: !this.state.showPopup
    });
  }

  toggleEditPopup() {
    this.setState({
      showEditPopup: !this.state.showEditPopup
    });
  }

  setcurrentBatch = batch => {
    this.setState({
      currentBatch: batch
    });
  };

  componentWillMount() {
    const newUser = this.state.user;

    fire
      .database()
      .ref("/Users")
      .on("child_added", snap => {
        newUser.push({
          id: snap.key,
          image: snap.val().coverImage
        });

        this.setState({
          user: newUser
        });
      });

    fire
      .database()
      .ref("/Users")
      .on("child_removed", snap => {
        for (var i = 0; i < newUser.length; i++) {
          if (newUser[i].id === snap.key) {
            newUser.splice(i, 1);
          }
        }

        this.setState({
          user: newUser
        });
      });
  }

  render() {
    return (
      <div>
        <section className="dash-content">
          <div className="container">
            <div className="row">
              {this.state.user.map(user => (
                <Card
                  title={user.id}
                  image={user.image}
                  popup={this.toggleEditPopup.bind(this)}
                  current={this.setcurrentBatch.bind(this)}
                />
              ))}
              <div className="col-md-4">
                <div
                  className="dash-cards bg-secondary btn btn-secondary"
                  onClick={this.togglePopup.bind(this)}
                >
                  <br />
                  <br />
                  <i className="material-icons large-icon">add_circle</i>
                  Add New Batch
                </div>
              </div>
            </div>
          </div>
        </section>
        {this.state.showPopup ? (
          <CreateNewBatch
            text='Click "Close Button" to hide popup'
            closePopup={this.togglePopup.bind(this)}
          />
        ) : null}
        {this.state.showEditPopup ? (
          <EditBatch
            text='Click "Close Button" to hide popup'
            closePopup={this.toggleEditPopup.bind(this)}
            batch={this.state.currentBatch}
          />
        ) : null}
      </div>
    );
  }
}

export default Dash;
