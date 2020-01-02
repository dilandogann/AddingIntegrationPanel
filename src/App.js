import React, { Component } from "react";
import "./App.css";
import "./Assets/Css/Custom.css";
import "./Assets/Css/styles.css";
import { Modal } from "semantic-ui-react";
import Login from "./Components/Login/Login";
import EditIntegration from "./Components/EditIntegration/EditIntegration";
import ShowIntegration from "./Components/ShowIntegration/ShowIntegration";
import AddIntegration from "./Components/AddIntegration/AddIntegration";
import { Switch, Route } from "react-router-dom";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      integration: ""
    };
  }
  setUsername = username => {
    this.setState({ username });
  };
  setIntegration = integration => {
    this.setState({ integration });
  };
  render() {
    return (
      <Switch>
        <Route
          exact
          path="/"
          component={() => (
            <div className="App">
              <Login
                setUsername={this.setUsername}
                username={this.state.username}
              />
            </div>
          )}
        />
        <Route
          path="/AddIntegration"
          component={() => <AddIntegration username={this.state.username} />}
        />
        <Route
          path="/ShowIntegration"
          component={() => (
            <ShowIntegration
              username={this.state.username}
              setIntegration={this.setIntegration}
            />
          )}
        />
        <Route
          path="/EditIntegration"
          component={() => (
            <Modal dimmer="blurring" className="Modal" open={true}>
              <EditIntegration
                username={this.state.username}
                integration={this.state.integration}
              />
            </Modal>
          )}
        />
      </Switch>
    );
  }
}
export default App;
