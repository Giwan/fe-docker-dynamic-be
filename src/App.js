import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";

class App extends Component {
  componentDidMount() {
    fetch("/backendapiroute")
      .then(rsp => rsp.json())
      .then(rsp => {
        window.apiHost = rsp.apiHost;
      })
      .catch(e => console.error("failed to get the api host", e));
  }
  render() {
    return (
      <div className="App">
        <h1>Sample app testing dynamic backend</h1>
      </div>
    );
  }
}

export default App;
