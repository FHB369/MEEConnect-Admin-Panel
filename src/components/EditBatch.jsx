import React, { Component } from "react";
import fire from "../config/config";
import "../App.css";
import FileUploader from "react-firebase-file-uploader";

require("firebase/storage");

class EditBatch extends Component {
  constructor(props) {
    super(props);

    this.state = {
      batchName: this.props.batch,
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

  editBatch = () => {
    fire
      .database()
      .ref("Users/" + this.state.batchName + "/coverImage")
      .set(this.state.imageURL);
    this.props.closePopup();
    window.location.reload();
  };

  render() {
    return (
      <div className="popup">
        <div className="col-md-6 offset-md-3 login-form popup-inner">
          <h3>Change cover image of {this.props.batch}</h3>
          <br />
          <label className="col-md-12 btn btn-dark">
            {this.state.status}
            <FileUploader
              hidden
              accept="image/*"
              name="image"
              filename={file => this.state.batchName + file.name.split(".")[1]}
              storageRef={fire.storage().ref("users")}
              onUploadStart={this.handleUploadStart}
              onUploadSuccess={this.handleUploadSuccess}
            />
          </label>

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

          {this.state.imageURL ? (
            <div>
              <button
                type="button"
                className="col-md-12 btn btn-info"
                onClick={this.editBatch}
              >
                Done
              </button>
              <br />
              <button
                type="button"
                className="col-md-12 mt-2 btn btn-danger"
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

export default EditBatch;
