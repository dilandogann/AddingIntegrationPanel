import React, { Component } from "react";
import "../../Assets/Css/Custom.css";
import "../../Assets/Css/Login.css";
import _ from "lodash";
import { Redirect } from "react-router";

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Login: true,
      Modal: [
        {
          show: true,
          operation: "Login",
          message: "Login To Dashboard",
          username: "",
          password: ""
        },
        {
          show: false,
          operation: "Sign Up",
          message: "Sign Up",
          username: "",
          password: ""
        }
      ]
    };
  }

  handleOperation = operation => {
    const Modal = this.state.Modal;
    Modal.forEach(element => {
      element.username = "";
      element.password = "";
      if (element.operation == operation) {
        element.show = true;
        this.setState({ Modal: Modal });
      } else {
        element.show = false;
        this.setState({ Modal: Modal });
      }
    });
  };
  userLogin = () => {
    const { setUsername } = this.props;
    this.state.Modal.map(element => {
      if (element.show == true) {
        let userValues = new FormData();
        userValues.append("Username", element.username);
        userValues.append("Password", element.password);
        userValues.append("Operation", element.operation);
        fetch("http://localhost/integrations/src/PHP/getAdminUsers.php", {
          method: "POST",
          header: {
            "Content-Type": "text/plain"
          },
          body: userValues
        })
          .then(response => response.json())
          .then(response => {
            if (response.message == "Login succesfull") {
              setUsername(element.username);
              this.setState({ Login: false });
            } else if ("Welcome to application") {
              this.handleOperation("Login");
              window.alert(response.message);
            } else window.alert(response.message);
          });
      }
    });
  };

  render() {
    if (this.props.username != "") {
      return <Redirect to="/AddIntegration" />;
    }
    return (
      <div>
        {this.state.Modal.map((element, index) =>
          element.show ? (
            <div id={element.operation} key={index}>
              <div className="Admin-Background">
                <div className="Admin-Modal">
                  <p className="Admin-p">{element.message}</p>
                  <div className="Admin-InputContent">
                    <h4 className="Admin-h4">Username</h4>
                    <input
                      className="Admin-Input"
                      type="text"
                      value={element.username}
                      onChange={e => {
                        (this.state.Modal[index].username = e.target.value),
                          this.setState({ Modal: this.state.Modal });
                      }}
                    />
                    <h4 className="Admin-h4">Password</h4>
                    <input
                      type="password"
                      className="Admin-Input"
                      value={element.password}
                      onChange={e => {
                        (this.state.Modal[index].password = e.target.value),
                          this.setState({ Modal: this.state.Modal });
                      }}
                    />
                    <button className="Admin-Button" onClick={this.userLogin}>
                      {element.operation}
                    </button>
                    {element.operation == "Login" ? (
                      <i
                        className="goSignup"
                        onClick={() => this.handleOperation("Sign Up")}
                      >
                        Click to create account
                      </i>
                    ) : (
                      <i
                        className="goSignup"
                        onClick={() => this.handleOperation("Login")}
                      >
                        Login to Application!
                      </i>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : null
        )}
      </div>
    );
  }
}
export default Login;
