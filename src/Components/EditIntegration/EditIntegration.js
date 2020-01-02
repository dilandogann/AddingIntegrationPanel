import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Redirect } from "react-router";
var res = [];

class EditIntegration extends Component {
  constructor(props) {
    super(props);
    this.handledit = this.handledit.bind(this);
    this.state = {
      Integration: [],
      Fields: [],
      FieldOptions: [],
      Options: [{ name: "Dropdown" }, { name: "Text" }, { name: "Radio" }],
      Requirements: []
    };
  }

  componentDidMount = () => {
    let integration = this.props.integration;
    let integration_data = new FormData();
    integration_data.append("operation", "one");
    integration_data.append("integration", integration);
    fetch("http://localhost/integrations/src/PHP/getIntegrations.php", {
      method: "POST",
      header: {
        "Content-Type": "text/plain"
      },
      body: integration_data
    })
      .then(response => response.json())
      .then(response => {
        this.setState({
          Integration: {
            oldName: response.name,
            name: response.name,
            description: response.description,
            file: response.file
          }
        });
        response.fields.forEach((element, index) => {
          this.setState({
            Fields: [
              ...this.state.Fields,
              {
                text: element.field,
                inputType: element.inputType,
                oldInputType: element.inputType,
                oldInputName: element.field
              }
            ]
          });

          if (element.inputType == "Radio") {
            response.options.forEach(elm => {
              if (elm.field == element.field) {
                this.setState({
                  FieldOptions: [
                    ...this.state.FieldOptions,
                    {
                      text: elm.fieldoption,
                      oldRadioName: elm.fieldoption
                    }
                  ]
                });

                const Fields = this.state.Fields;
                Fields[index].RadioFields = this.state.FieldOptions;
                this.setState({ Fields: Fields });
              }
            });
            this.setState({ FieldOptions: [] });
          }
        });
        response.requirements.forEach(element => {
          this.setState({
            Requirements: [
              ...this.state.Requirements,
              {
                text: element.text,
                oldReqName: element.text
              }
            ]
          });
        });
      });
  };
  handledit = () => {
    let url = document.getElementById("avatar").value;
    let src = url.substring(url.indexOf("fakepath"));
    let src2 = src.substring(src.indexOf("\\") + 1);
    let Fields = this.state.Fields;
    let Requirements = this.state.Requirements;
    let integrationFields = new FormData();
    integrationFields.append("oldName", this.state.Integration.oldName);
    integrationFields.append("Name", document.getElementById("name").value);
    integrationFields.append(
      "Description",
      document.getElementById("description").value
    );
    if (src2 != "") integrationFields.append("File", src2);
    else integrationFields.append("File", this.state.Integration.file);
    integrationFields.append("Fields", JSON.stringify(Fields));
    integrationFields.append("Operation", "Update");
    integrationFields.append(
      "IntegrationRequirements",
      JSON.stringify(Requirements)
    );
    fetch("http://localhost/integrations/src/PHP/integrationFields.php", {
      method: "POST",
      header: {
        "Content-Type": "text/plain"
      },
      body: integrationFields
    });
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
      Requirements: [...this.state.Requirements, { text: "", oldReqName: "" }]
    });
  };

  deleteField = index => {
    var array = [...this.state.Fields];
    if (index !== -1) {
      array.splice(index, 1);
      this.setState({ Fields: array });
    }
  };

  addRadioField = index => {
    const newFields = this.state.Fields;
    newFields[index].RadioFields.push({ text: "", oldRadioName: "" });
    this.setState({ Fields: newFields });
  };

  deleteRadioField = (key, index) => {
    const newFields = this.state.Fields;
    newFields[index].RadioFields.splice(key, 1);
    this.setState({ Fields: newFields });

    if (this.state.Fields[index].RadioFields.length == 0)
      this.addRadioField(index);
  };

  deleteIntegrationRequirements = index => {
    var array = [...this.state.Requirements];
    if (index !== -1) {
      array.splice(index, 1);
      this.setState({ Requirements: array });
    }
  };

  render() {
    if (this.props.username == "") {
      return <Redirect to="/" />;
    }
    return (
      <div>
        <div className="card bg-light mb-3 Maincardcontent">
          <div className="card-header">
            <h4 className="card-title">Edit Your Integration</h4>
          </div>
          <div className="card-body cardBodyEdit">
            <div className="App">
              <label className="label">Logo</label>
              <div className="upload-btn-wrapper">
                <button className="btn">Upload Logo</button>
                <input type="file" id="avatar" />
              </div>

              <label className="label">Name</label>
              <div>
                <input
                  id="name"
                  className="input"
                  type="text"
                  value={this.state.Integration.name}
                  onChange={e => {
                    this.state.Integration.name = e.target.value;
                    this.setState({ Integration: this.state.Integration });
                  }}
                ></input>
              </div>
              <label className="label">Description</label>
              <div>
                <input
                  id="description"
                  className="input"
                  type="text"
                  value={this.state.Integration.description}
                  onChange={e => {
                    this.state.Integration.description = e.target.value;
                    this.setState({ Integration: this.state.Integration });
                  }}
                ></input>
              </div>
              <label className="label">Fields</label>
              <div className="list">
                <div className="coloumnForAll">
                  {this.state.Fields.map((item, index) => (
                    <div id={index} className="flex" key={index}>
                      <div className="coloumn">
                        <div>
                          <input
                            className="inputField"
                            key={index}
                            type="text"
                            value={item.text}
                            onChange={e => {
                              this.state.Fields[index].text = e.target.value;
                              this.setState({ Fields: this.state.Fields });
                            }}
                          />
                        </div>
                        <div>
                          <select
                            className="Select"
                            id="mySelect"
                            onChange={event => {
                              this.state.Fields[index].inputType =
                                event.target.value;
                              this.setState({ Fields: this.state.Fields });
                              if (
                                this.state.Fields[index].inputType == "Radio"
                              ) {
                                this.state.Fields[index].RadioFields = [];
                                this.state.Fields[index].RadioFields.push({
                                  text: ""
                                });
                              }
                            }}
                          >
                            <option value=""></option>
                            {this.state.Options.map((values, key) => (
                              <option
                                selected={item.inputType == values.name}
                                className="Option"
                                value={values.name}
                                key={key}
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
                                  {this.state.Fields[index].RadioFields
                                    ? this.state.Fields[index].RadioFields.map(
                                        (obj, key) => (
                                          <div className="flex" key={key}>
                                            <input
                                              className="inputRadio"
                                              value={obj.text}
                                              type="text"
                                              onChange={e => {
                                                this.state.Fields[
                                                  index
                                                ].RadioFields[key].text =
                                                  e.target.value;
                                                this.setState({
                                                  Fields: this.state.Fields
                                                });
                                              }}
                                            />
                                            {key ==
                                            this.state.Fields[index].RadioFields
                                              .length -
                                              1 ? (
                                              <button
                                                className="w3-button w3-xlarge w3-circle w3-black plusButton"
                                                onClick={() =>
                                                  this.addRadioField(index)
                                                }
                                              >
                                                +
                                              </button>
                                            ) : null}
                                            <button
                                              className="w3-button w3-xlarge w3-circle w3-black minusButton"
                                              onClick={() =>
                                                this.deleteRadioField(
                                                  key,
                                                  index
                                                )
                                              }
                                            >
                                              -
                                            </button>
                                          </div>
                                        )
                                      )
                                    : null}
                                </div>
                              );
                            default:
                              return "";
                          }
                        })()}
                      </div>
                      <button
                        className="btnDeleteField"
                        onClick={() => this.deleteField(index)}
                      >
                        Delete
                      </button>
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
                  <label className="label">Integration-Fields</label>
                </div>
                <div className="coloumnForAll">
                  {this.state.Requirements.map((item, key) => (
                    <div id={key} className="flex" key={key}>
                      <div className="coloumn">
                        <div>
                          <input
                            className="inputField"
                            key={key}
                            type="text"
                            value={item.text}
                            onChange={e => {
                              this.state.Requirements[key].text =
                                e.target.value;
                              this.setState({
                                Requirements: this.state.Requirements
                              });
                            }}
                          />
                        </div>
                      </div>

                      <button
                        className="btnDeleteField"
                        onClick={() => this.deleteIntegrationRequirements(key)}
                      >
                        Delete
                      </button>
                    </div>
                  ))}
                  <button
                    className="btnAddField"
                    onClick={() => this.addIntegrationRequirements()}
                  >
                    Add field
                  </button>
                </div>
              </div>
              <div className="flex">
                <Link to="/ShowIntegration">
                  <button onClick={this.handledit} className="editIntg">
                    Edit
                  </button>
                  <button className="quit">Quit</button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default EditIntegration;
