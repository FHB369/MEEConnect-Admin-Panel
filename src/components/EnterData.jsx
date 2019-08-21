import React, { Component } from "react";
import fire from "../config/config";
import "../App.css";
import axios from "axios";

require("firebase/database");

class EnterData extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isValid: false,
      catagory: this.props.match.params.year,
      user: "",
      error: null,
      empty: "",
      status: "Submit",
      imageURL: null,
      peoples: [],
      addPeople: {
        reg_no: null,
        name: null,
        nickname: null,
        phone: null,
        email: null,
        dob: null,
        blood: null,
        msg_id: null,
        photo: null
      }
    };

    this.authListener = this.authListener.bind(this);
    this.testSubmit = this.testSubmit.bind(this);
  }

  componentDidMount() {
    this.authListener();
    fire
      .database()
      .ref("/Users/")
      .once("value", snap => {
        this.setState({
          isValid: snap.child(this.state.catagory).exists()
        });
      });
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
      .ref("/Users/" + this.state.catagory + "/peoples")
      .on("child_added", snap => {
        newPeople.push({
          reg_no: snap.key,
          name: snap.val().Name,
          nickname: snap.val().Nickname,
          phone: snap.val().Phone,
          email: snap.val().Email,
          dob: snap.val().DOB,
          blood: snap.val().Blood,
          msg_id: snap.val().MSG_Id,
          photo: snap.val().Photo
        });

        this.setState({
          peoples: newPeople
        });
      });

    fire
      .database()
      .ref("/Users/" + this.state.catagory + "/peoples")
      .on("child_removed", snap => {
        for (var i = 0; i < newPeople.length; i++) {
          if (newPeople[i].reg_no === snap.key) {
            newPeople.splice(i, 1);
          }
        }

        this.setState({
          peoples: newPeople
        });
      });
  }

  handlePhotoChange = event => {
    event.preventDefault();
    this.setState({
      addPeople: {
        photo: event.target.files[0]
      }
    });
  };

  testSubmit = e => {
    e.preventDefault();
    const peop = this.state.addPeople;
    peop.reg_no = e.target.reg_no.value;
    peop.name = e.target.name.value;
    peop.nickname = e.target.nickname.value;
    peop.phone = e.target.phone.value;
    peop.email = e.target.email.value;
    peop.dob = e.target.dob.value;
    peop.blood = e.target.blood.value;
    peop.msg_id = e.target.msg_id.value;
    peop.photo = e.target.photo.files[0];

    this.setState({
      addPeople: peop
    });

    this.setState({
      status: "Uploading...."
    });

    this.uploadData();
  };

  uploadData = async () => {
    try {
      let axiosConfig = {
        headers: {
          Authorization: "Client-ID ead116aab30174c"
        },
        timeout: 8000
      };

      let formData = new FormData();
      formData.append("image", this.state.addPeople.photo);

      let res = await axios.post(
        "https://api.imgur.com/3/image",
        formData,
        axiosConfig
      );

      if (res.status === 200) {
        console.log(res.status);
        let { data } = res;
        this.setState({ imageURL: data.data.link, status: "Submit" });

        fire
          .database()
          .ref(
            "Users/" +
              this.state.catagory +
              "/peoples/" +
              this.state.addPeople.reg_no
          )
          .set({
            Name: this.state.addPeople.name,
            Nickname: this.state.addPeople.nickname,
            Phone: this.state.addPeople.phone,
            Email: this.state.addPeople.email,
            DOB: this.state.addPeople.dob,
            Blood: this.state.addPeople.blood,
            MSG_Id: this.state.addPeople.msg_id,
            Photo: this.state.imageURL
          });

        document.getElementById("dataEntryForm").reset();
      } else {
        this.setState({ error: "Upload Failed", status: "Submit", empty: "" });
      }
      return res.data;
    } catch (err) {
      console.log(err);
      this.setState({ error: err.toString(), status: "Submit" });
      setTimeout(() => {
        this.setState({
          error: ""
        });
      }, 2000);
    }
  };

  deletePerson = reg => {
    fire
      .database()
      .ref("Users/" + this.state.catagory + "/peoples/")
      .child(reg)
      .remove();
  };

  render() {
    return (
      <div className="container">
        {this.state.isValid ? (
          <div className="dash-content">
            <div className="row">
              <div className="col-md-12">
                <div className="enter-data-form">
                  <h4>
                    Add a new person's information to {this.state.catagory}
                  </h4>
                  <br />

                  <form onSubmit={this.testSubmit} id="dataEntryForm">
                    <div className="row">
                      <div className="col-md-3">
                        <input
                          type="number"
                          className="form-control"
                          placeholder="Registration No"
                          name="reg_no"
                          required
                        />
                      </div>

                      <div className="col-md-3">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Name"
                          name="name"
                          required
                        />
                      </div>

                      <div className="col-md-3">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Nickname"
                          name="nickname"
                          required
                        />
                      </div>

                      <div className="col-md-3">
                        <input
                          type="number"
                          className="form-control"
                          placeholder="Phone"
                          name="phone"
                          required
                        />
                      </div>
                    </div>
                    <br />
                    <div className="row">
                      <div className="col-md-3">
                        <input
                          type="email"
                          className="form-control"
                          placeholder="Email"
                          name="email"
                          required
                        />
                      </div>

                      <div className="col-md-3">
                        <div className="input-group mb-3">
                          <div className="input-group-prepend">
                            <span
                              className="input-group-text"
                              id="basic-addon3"
                            >
                              Birthdate
                            </span>
                          </div>
                          <input
                            type="date"
                            className="form-control"
                            name="dob"
                            required
                          />
                        </div>
                      </div>

                      <div className="col-md-3">
                        <select
                          class="custom-select mr-sm-2 form-control"
                          id="inlineFormCustomSelect"
                          name="blood"
                          required
                        >
                          <option selected disabled hidden>
                            Choose Blood Group...
                          </option>
                          <option value="A+">A+</option>
                          <option value="A-">A-</option>
                          <option value="B+">B+</option>
                          <option value="B-">B-</option>
                          <option value="O+">O+</option>
                          <option value="O-">O-</option>
                          <option value="AB+">AB+</option>
                          <option value="AB-">AB-</option>
                        </select>
                      </div>
                      <div className="col-md-3">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Messenger Link"
                          name="msg_id"
                          required
                        />
                      </div>
                    </div>
                    <br />
                    <div className="row">
                      <div className="col-md-4 offset-md-4">
                        <input
                          type="file"
                          accept="image/*"
                          className="form-control"
                          placeholder="Photo"
                          name="photo"
                          required
                        />
                      </div>
                    </div>
                    <br />
                    {this.state.error ? (
                      <div className="alert alert-danger" role="alert">
                        {this.state.error}
                      </div>
                    ) : (
                      <div />
                    )}
                    <div className="row">
                      <div className="col-md-12">
                        <button className="col-md-3 btn btn-dark text-center">
                          {this.state.status}
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>

            <div className="row">
              <table className="table col-md-12">
                <thead>
                  <tr>
                    <th scope="col">Reg_No</th>
                    <th scope="col">Name</th>
                    <th scope="col">Nickname</th>
                    <th scope="col">Phone</th>
                    <th scope="col">Email</th>
                    <th scope="col">Blood</th>
                    <th scope="col">Birthdate</th>
                    <th scope="col">Messenger</th>
                    <th scope="col">Photo</th>
                    <th scope="col">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.peoples.map(people => (
                    <tr>
                      <th scope="row">{people.reg_no}</th>
                      <td>{people.name}</td>
                      <td>{people.nickname}</td>
                      <td>{people.phone}</td>
                      <td>{people.email}</td>
                      <td>{people.blood}</td>
                      <td>{people.dob}</td>
                      <td>
                        <a href={people.msg_id} target="blank">
                          {people.msg_id}
                        </a>
                      </td>
                      <td>
                        <img src={people.photo} alt="" className="small-img" />
                      </td>
                      <td>
                        <button
                          onClick={() => this.deletePerson(people.reg_no)}
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
          </div>
        ) : (
          <div />
        )}
      </div>
    );
  }
}

export default EnterData;
