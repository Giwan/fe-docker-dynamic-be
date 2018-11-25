import React, { Component } from "react";

class App extends Component {
    /**
     * When this app component is rendered on the server, it's provided with the
     * api host immediately.
     * If the app has to be re-rendered on the client for any reason,
     * then the apiHost can be retrieved from the window object.
     */
    render() {
        const apiHost = this.props.apiHost || window.__API_HOST__;
        return (
            <div className="App">
                <h1>Sample app testing dynamic backend</h1>
                <div>Loaded backend host: {apiHost} </div>
            </div>
        );
    }
}

export default App;
