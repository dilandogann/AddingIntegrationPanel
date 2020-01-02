import React, { Component } from "react";
import "../../Assets/Css/Custom.css";
import "../../Assets/Css/styles.css";
import { Modal } from "semantic-ui-react";
import _ from "lodash";
import EditIntegration from "../EditIntegration/EditIntegration";
import { Link } from "react-router-dom";
import { Redirect } from "react-router";

class AddIntegration extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = {
      Show: false,
      Name: "",
      Fields: [{ text: "", inputType: "", RadioFields: [{ text: "" }] }],
      IntegrationRequirements: [{ text: "" }],
      open: false,
      Options: [{ name: "Dropdown" }, { name: "Text" }, { name: "Radio" }],
      Selected: ""
    };
  }

  handleSubmit = () => {
    let url = document.getElementById("avatar").value;
    let username = this.props.username;
    let src = url.substring(url.indexOf("fakepath"));
    let src2 = src.substring(src.indexOf("\\") + 1);
    let Fields = this.state.Fields;
    let IntegrationRequirements = this.state.IntegrationRequirements;
    let integrationFields = new FormData();
    integrationFields.append("Name", document.getElementById("name").value);
    integrationFields.append(
      "Description",
      document.getElementById("description").value
    );
    integrationFields.append("File", src2);
    integrationFields.append("Fields", JSON.stringify(Fields));
    integrationFields.append(
      "IntegrationRequirements",
      JSON.stringify(IntegrationRequirements)
    );
    integrationFields.append("Operation", "Add");
    fetch("http://localhost/integrations/src/PHP/integrationFields.php", {
      method: "POST",
      header: {
        "Content-Type": "text/plain"
      },
      body: integrationFields
    })
      .then(response => response.json())
      .then(response => {
        window.alert(response.message);
        setTimeout(() => {
          this.setState({ Show: true });
        }, 100);
      });
  };

  handleAdd = () => {
    this.setState({
      Fields: [{ text: "", inputType: "", RadioFields: [{ text: "" }] }]
    });
    this.setState({ IntegrationRequirements: [{ text: "" }] });
  };

  addField = () => {
    this.setState({
      Fields: [
        ...this.state.Fields,
        { text: "", inputType: "", RadioFields: [{}] }
      ]
    });
  };
  addIntegrationRequirements = () => {
    this.setState({
      IntegrationRequirements: [
        ...this.state.IntegrationRequirements,
        { text: "" }
      ]
    });
  };

  addRadioField = key => {
    const newFields = this.state.Fields;
    newFields[key].RadioFields.push({ text: "" });
    this.setState({ Fields: newFields });
  };

  deleteField = index => {
    var array = [...this.state.Fields];
    if (index !== -1) {
      array.splice(index, 1);
      this.setState({ Fields: array });
    }
  };

  deleteIntegrationRequirements = index => {
    var array = [...this.state.IntegrationRequirements];
    if (index !== -1) {
      array.splice(index, 1);
      this.setState({ IntegrationRequirements: array });
    }
  };

  deleteRadioField = (index, key) => {
    const newFields = this.state.Fields;
    newFields[key].RadioFields.splice(index, 1);
    this.setState({ Fields: newFields });
  };
  render() {
    if (this.props.username == "") {
      return <Redirect to="/" />;
    }
    if (this.state.Show == true) {
      return <Redirect to="/ShowIntegration" />;
    }

    return (
      <div>
        <div className="MainContent">
          <div className="card bg-light mb-3 cardContent">
            <div className="card-header cardHeader">
              <label
                className="AppButtonsSelected"
                onClick={() => this.handleAdd()}
              >
                ADD
              </label>
              <Link to="/ShowIntegration">
                <label className="AppButtons">SHOW</label>
              </Link>
            </div>
            <div className="card-body cardBody ">
              <div className="App">
                <label className="labelHeader">ADD INTEGRATION</label>
                <label className="label">Logo</label>
                <div>
                  <div className="upload-btn-wrapper">
                    <button className="btn">Upload Logo</button>
                    <input type="file" id="avatar" />
                  </div>
                </div>
                <label className="label">Name</label>
                <div>
                  <input
                    id="name"
                    className="input"
                    type="text"
                    autocomplete="off"
                  ></input>
                </div>
                <label className="label">Description</label>
                <div>
                  <input
                    id="description"
                    className="input"
                    type="text"
                    autocomplete="off"
                  ></input>
                </div>
                <div className="flex">
                  <label className="label">Mapper-Fields</label>
                  <label className="labelInputType">Input Types</label>
                </div>
                <div className="coloumnForAll">
                  {this.state.Fields.map((item, key) => (
                    <div id={key} key={key} className="flex">
                      <div className="coloumn">
                        <div>
                          <input
                            className="inputField"
                            key={key}
                            type="text"
                            value={item.text}
                            onChange={e => {
                              this.state.Fields[key].text = e.target.value;
                              this.setState({ Fields: this.state.Fields });
                            }}
                          />
                        </div>
                        <div>
                          <select
                            className="Select"
                            id="mySelect"
                            onChange={event => {
                              this.state.Fields[key].inputType =
                                event.target.value;
                              this.setState({ Fields: this.state.Fields });
                            }}
                          >
                            <option value=""></option>
                            {this.state.Options.map((values, index) => (
                              <option
                                className="Option"
                                value={values.name}
                                key={index}
                              >
                                {values.name}
                              </option>
                            ))}
                          </select>
                        </div>
                        {(() => {
                          switch (item.inputType) {
                            case "Radio":
                              return (
                                <div>
                                  {this.state.Fields[key].RadioFields.map(
                                    (obj, index) => (
                                      <div className="flex">
                                        <input
                                          className="inputRadio"
                                          value={obj.text}
                                          type="text"
                                          onChange={e => {
                                            this.state.Fields[key].RadioFields[
                                              index
                                            ].text = e.target.value;
                                            this.setState({
                                              Fields: this.state.Fields
                                            });
                                          }}
                                        />
                                        {index ==
                                        this.state.Fields[key].RadioFields
                                          .length -
                                          1 ? (
                                          <button
                                            class="w3-button w3-xlarge w3-circle w3-black plusButton"
                                            onClick={() =>
                                              this.addRadioField(key)
                                            }
                                          >
                                            +
                                          </button>
                                        ) : null}
                                        <button
                                          class="w3-button w3-xlarge w3-circle w3-black minusButton"
                                          onClick={() =>
                                            this.deleteRadioField(index, key)
                                          }
                                        >
                                          -
                                        </button>
                                      </div>
                                    )
                                  )}
                                </div>
                              );
                            default:
                              return "";
                          }
                        })()}
                      </div>
                      {key > 0 ? (
                        <button
                          className="btnDeleteField"
                          onClick={() => this.deleteField(key)}
                        >
                          Delete
                        </button>
                      ) : null}
                    </div>
                  ))}
                  <button
                    className="btnAddField"
                    onClick={() => this.addField()}
                  >
                    Add field
                  </button>
                </div>
                <div className="flex">
                  <label className="label">Authantication-Fields</label>
                </div>
                <div className="coloumnForAll">
                  {this.state.IntegrationRequirements.map((item, key) => (
                    <div id={key} className="flex" key={key}>
                      <div className="coloumn">
                        <div>
                          <input
                            className="inputField"
                            key={key}
                            type="text"
                            value={item.text}
                            onChange={e => {
                              this.state.IntegrationRequirements[key].text =
                                e.target.value;
                              this.setState({
                                IntegrationRequirements: this.state
                                  .IntegrationRequirements
                              });
                            }}
                          />
                        </div>
                      </div>
                      {key > 0 ? (
                        <button
                          className="btnDeleteField"
                          onClick={() =>
                            this.deleteIntegrationRequirements(key)
                          }
                        >
                          Delete
                        </button>
                      ) : null}
                    </div>
                  ))}
                  <button
                    className="btnAddField"
                    onClick={() => this.addIntegrationRequirements()}
                  >
                    Add field
                  </button>
                </div>

                <button onClick={this.handleSubmit} className="submit">
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default AddIntegration;
