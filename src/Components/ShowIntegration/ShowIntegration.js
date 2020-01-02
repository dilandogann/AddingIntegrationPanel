import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Redirect } from "react-router";
import "./../../App.css";

class ShowIntegration extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Integrations: []
    };
  }

  componentDidMount = () => {
    let integration_data = new FormData();
    integration_data.append("operation", "all");
    fetch("http://localhost/integrations/src/PHP/getIntegrations.php", {
      method: "POST",
      header: {
        "Content-Type": "text/plain"
      },
      body: integration_data
    })
      .then(response => response.json())
      .then(response => {
        response.fields.forEach(element => {
          this.setState({
            Integrations: [
              ...this.state.Integrations,
              {
                name: element.name,
                description: element.description,
                file: element.file
              }
            ]
          });
        });
      });
  };

  showModal = integration => {
    const { setIntegration } = this.props;
    setIntegration(integration);
  };

  render() {
    if (this.props.username == "") {
      return <Redirect to="/" />;
    }
    return (
      <div>
        <div className="MainContent">
          <div className="card bg-light mb-3 cardContent">
            <div className="card-header cardHeader">
              <Link to="/AddIntegration">
                <label className="AppButtonsSelected">ADD</label>
              </Link>
              <label className="AppButtons">SHOW</label>
            </div>
            <label className="labelHeaderShow">INTEGRATIONS</label>
            <div className="card-body carBodyShow">
              {this.state.Integrations.map((item, index) => (
                <div className="App-appBoxBorder" id={index} key={index}>
                  <div className="App-iconContainer"></div>
                  <div className="App-appBoxImage">
                    <div
                      className={item.name}
                      style={{ backgroundImage: `url(${item.file})` }}
                    ></div>
                  </div>
                  <h5 className="App-appBoxTitle">{item.name}</h5>
                  <p className="App-appBoxText">{item.description}</p>
                  <Link to="/EditIntegration">
                    <button
                      className="editButton"
                      onClick={() => this.showModal(item.name)}
                    >
                      Edit
                    </button>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ShowIntegration;
