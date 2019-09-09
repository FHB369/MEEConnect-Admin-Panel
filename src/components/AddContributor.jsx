import React, { Component } from "react";
import fire from "../config/config";
import "../App.css";

class AddContributor extends Component {
  constructor(props) {
    super(props);

    this.state = {
      peoples: [],
      addPeople: {
        name: null,
        batch: null
      }
    };

    this.authListener = this.authListener.bind(this);
    this.testSubmit = this.testSubmit.bind(this);
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

  componentWillMount() {
    const newPeople = this.state.peoples;

    fire
      .database()
      .ref("/Contributors")
      .on("child_added", snap => {
        newPeople.push({
          id: snap.key,
          name: snap.val().Name,
          batch: snap.val().Batch
        });

        this.setState({
          peoples: newPeople
        });
      });

    fire
      .database()
      .ref("/Contributors")
      .on("child_removed", snap => {
        for (var i = 0; i < newPeople.length; i++) {
          if (newPeople[i].id === snap.key) {
            newPeople.splice(i, 1);
          }
        }

        this.setState({
          peoples: newPeople
        });
      });
  }

  testSubmit = e => {
    e.preventDefault();
    const peop = this.state.addPeople;
    peop.name = e.target.name.value;
    peop.batch = e.target.batch.value + " Batch";

    this.setState({
      addPeople: peop
    });

    console.log(this.state.addPeople);
    try {
      fire
        .database()
        .ref("/Contributors")
        .push()
        .set({
          Name: this.state.addPeople.name,
          Batch: this.state.addPeople.batch
        });
    } catch (e) {
      console.log(e);
    }

    document.getElementById("dataEntryForm").reset();
  };

  deletePerson = id => {
    fire
      .database()
      .ref("/Contributors")
      .child(id)
      .remove();
  };

  render() {
    return (
      <div className="container">
        <div className="dash-content">
          <div className="row">
            <div className="col-md-12">
              <div className="enter-data-form">
                <h4>Add a new contributor</h4>
                <br />

                <form onSubmit={this.testSubmit} id="dataEntryForm">
                  <div className="row">
                    <div className="col-md-5">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Name"
                        name="name"
                        required
                      />
                    </div>

                    <div className="col-md-5">
                      <input
                        type="number"
                        className="form-control"
                        placeholder="Batch"
                        name="batch"
                        required
                      />
                    </div>

                    <div className="col-md-2">
                      <button
                        type="submit"
                        className="form-control btn btn-success"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                  <br />
                </form>
              </div>
            </div>
          </div>
        </div>

        <table className="table">
          <thead>
            <tr>
              <th scope="col">Name</th>
              <th scope="col">Batch</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>
            {this.state.peoples.map(people => (
              <tr>
                <th scope="row">{people.name}</th>
                <td>{people.batch}</td>
                <td>
                  <button
                    onClick={() => this.deletePerson(people.id)}
                    className="btn btn-danger btn-sm"
                  >
                    DELETE
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}

export default AddContributor;
