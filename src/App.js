import React, { Component } from "react";
import "./App.css";

class App extends Component {
  /**
   * Once the App is mounted, the API_HOST is fetched.
   * All /api request can now be directed to that host.
   * In this example it's stored on the window object
   * but it might even be cleaner to store this in Redux.
   * (no need to pollute the global object if we don't need to)
   */
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
