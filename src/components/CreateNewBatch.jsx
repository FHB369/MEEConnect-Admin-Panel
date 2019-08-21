import React, { Component } from "react";
import fire from "../config/config";
import "../App.css";
import FileUploader from "react-firebase-file-uploader";

require("firebase/storage");

class CreateNewBatch extends Component {
  constructor(props) {
    super(props);

    this.state = {
      batchName: "",
      image: "",
      imageURL: "",
      progress: 0,
      status: "Upload an image"
    };
  }

  handleNameChange = name => {
    this.setState({
      batchName: name.target.value
    });
  };

  handleUploadStart = () => {
    this.setState({
      progress: 0,
      status: "Uploading..."
    });
  };

  handleUploadSuccess = filename => {
    this.setState({
      image: filename,
      progress: 100,
      status: "Upload Successful. Want to change?"
    });

    fire
      .storage()
      .ref("users")
      .child(filename)
      .getDownloadURL()
      .then(url =>
        this.setState({
          imageURL: url
        })
      );
  };

  createNewBatch = () => {
    fire
      .database()
      .ref("Users/" + this.state.batchName)
      .set({
        coverImage: this.state.imageURL
      });
    this.props.closePopup();
  };

  render() {
    return (
      <div className="popup">
        <div className="col-md-6 offset-md-3 login-form popup-inner">
          <h3>Give the batch a name & choose a cover image</h3>
          <br />
          <div className="input-group mb-3">
            <div className="input-group-prepend">
              <span className="input-group-text" id="basic-addon3">
                Batch Name
              </span>
            </div>
            <input
              type="text"
              className="form-control"
              id="basic-url"
              aria-describedby="basic-addon3"
              onChange={this.handleNameChange}
            />
          </div>
          {this.state.batchName ? (
            <label className="col-md-12 btn btn-dark">
              {this.state.status}
              <FileUploader
                hidden
                accept="image/*"
                name="image"
                filename={file =>
                  this.state.batchName + file.name.split(".")[1]
                }
                storageRef={fire.storage().ref("users")}
                onUploadStart={this.handleUploadStart}
                onUploadSuccess={this.handleUploadSuccess}
              />
            </label>
          ) : (
            <div />
          )}

          {this.state.imageURL ? (
            <img
              src={this.state.imageURL}
              className="col-md-12 preview-image"
              alt="Loading..."
            />
          ) : (
            <div />
          )}

          <br />

          {this.state.batchName && this.state.imageURL ? (
            <div>
              <button
                type="button"
                className="col-md-12 btn btn-info"
                onClick={this.createNewBatch}
              >
                Done
              </button>
              <br />
              &nbsp;
              <button
                type="button"
                className="col-md-12 btn btn-danger"
                onClick={this.props.closePopup}
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              type="button"
              className="col-md-12 btn btn-danger"
              onClick={this.props.closePopup}
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    );
  }
}

export default CreateNewBatch;
