import React, { Component } from "react";
import { Link } from "react-router-dom";
import "../App.css";

class Card extends Component {
  constructor(props) {
    super(props);

    this.state = {
      title: this.props.title,
      image: this.props.image
    };
  }

  show = () => {
    this.props.current(this.state.title);
    this.props.popup();
  };

  render() {
    return (
      <div className="col-md-4">
        <Link
          className="link-text"
          to={{
            pathname:
              this.state.title === "Teacher"
                ? "/teacher/data/"
                : "/enter/" + this.state.title,
            state: {
              batch: this.state.title
            }
          }}
        >
          <div className="dash-cards">
            <img
              src={this.state.image}
              className="card-image"
              alt="Loading..."
            />

            <h4 className="card-title">
              <b>{this.state.title}</b>
            </h4>
          </div>
        </Link>
        <i class="material-icons edit-option" onClick={this.show}>
          edit
        </i>
      </div>
    );
  }
}

export default Card;
